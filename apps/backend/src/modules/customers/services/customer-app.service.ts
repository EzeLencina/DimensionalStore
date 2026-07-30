import { Inject, Injectable } from '@nestjs/common';
import { LOGGER_TOKEN } from '@tienda/logger/nest';
import { Customer, CustomerAddress, CustomerNote, CustomerPreferences, CustomerTag, CustomerException, CUSTOMER_ERROR_CODES, CustomerId } from '../domain';
import { CUSTOMER_REPOSITORY, CUSTOMER_ADDRESS_REPOSITORY, CUSTOMER_TAG_REPOSITORY, CUSTOMER_NOTE_REPOSITORY } from '../domain';
import type { CustomerRepository, CustomerAddressRepository, CustomerTagRepository, CustomerNoteRepository } from '../domain';
import type { CustomerListFilters, CustomerTagPrimitives, CustomerNotePrimitives } from '../domain';
import type { UserReader, OrderReader, EventPublisher, Clock, CurrentActor } from '../domain';
import { CustomerValidator } from '../application/validators';
import { CustomerMapper } from '../application/mappers';
import type { CustomerResponseDto, CustomerListResponseDto } from '../application/dto';
import {
  CreateCustomerCommand, UpdateCustomerProfileCommand, ChangeCustomerStatusCommand, LinkCustomerToUserCommand,
  ConvertGuestCustomerCommand, ArchiveCustomerCommand, RestoreCustomerCommand,
  AddCustomerAddressCommand, UpdateCustomerAddressCommand, RemoveCustomerAddressCommand,
  SetDefaultShippingAddressCommand, SetDefaultBillingAddressCommand, UpdateCustomerPreferencesCommand,
  CreateCustomerTagCommand, AssignCustomerTagCommand, RemoveCustomerTagCommand,
  AddCustomerNoteCommand, UpdateCustomerNoteCommand, RemoveCustomerNoteCommand,
  RecalculateCustomerMetricsCommand, UpdateCustomerMetricsFromOrderCommand,
} from '../application/commands';

type LoggerLike = { info: (...args: unknown[]) => void; warn?: (...args: unknown[]) => void; error?: (...args: unknown[]) => void; debug?: (...args: unknown[]) => void };

@Injectable()
export class CustomerAppService {
  constructor(
    @Inject(CUSTOMER_REPOSITORY) private readonly customerRepo: CustomerRepository,
    @Inject(CUSTOMER_ADDRESS_REPOSITORY) private readonly addressRepo: CustomerAddressRepository,
    @Inject(CUSTOMER_TAG_REPOSITORY) private readonly tagRepo: CustomerTagRepository,
    @Inject(CUSTOMER_NOTE_REPOSITORY) private readonly noteRepo: CustomerNoteRepository,
    @Inject('USER_READER') private readonly userReader: UserReader,
    @Inject('ORDER_READER') private readonly orderReader: OrderReader,
    @Inject('EVENT_PUBLISHER_CUSTOMERS') private readonly eventPublisher: EventPublisher,
    @Inject('CLOCK_CUSTOMERS') private readonly clock: Clock,
    @Inject('CURRENT_ACTOR_CUSTOMERS') private readonly actor: CurrentActor,
    @Inject(LOGGER_TOKEN) private readonly logger: LoggerLike,
  ) {}

  private async getCustomerOrThrow(id: string, tenantId: string): Promise<Customer> {
    const customer = await this.customerRepo.findById(new CustomerId(id), tenantId);
    if (!customer) throw new CustomerException(CUSTOMER_ERROR_CODES.CUSTOMER_NOT_FOUND, 'Customer not found');
    return customer;
  }

  private ensureWritable(customer: Customer): void {
    if (customer.getStatus().isArchived()) throw new CustomerException(CUSTOMER_ERROR_CODES.CUSTOMER_ARCHIVED, 'Customer archived');
    if (customer.getStatus().isBlocked()) throw new CustomerException(CUSTOMER_ERROR_CODES.CUSTOMER_BLOCKED, 'Customer blocked');
  }

  async createCustomer(command: CreateCustomerCommand): Promise<CustomerResponseDto> {
    const errors = CustomerValidator.validateCreate(command);
    if (errors.length) throw new CustomerException(CUSTOMER_ERROR_CODES.CUSTOMER_INVALID_EMAIL, errors.join('; '));

    if (await this.customerRepo.existsByEmail(command.email, command.tenantId)) {
      throw new CustomerException(CUSTOMER_ERROR_CODES.CUSTOMER_EMAIL_ALREADY_EXISTS, 'Email already exists for tenant');
    }

    const customer = Customer.create({
      tenantId: command.tenantId, email: command.email, firstName: command.firstName, lastName: command.lastName,
      source: command.source, locale: command.locale, preferredCurrency: command.preferredCurrency,
      userId: command.userId ?? null, phone: command.phone ?? null,
    });
    await this.customerRepo.save(customer);
    this.logger.info({ event: 'customer.created', customerId: customer.getId().toString(), tenantId: command.tenantId }, 'Customer created');
    return CustomerMapper.toResponse(customer);
  }

  async getCustomerById(id: string, tenantId: string): Promise<CustomerResponseDto> {
    const customer = await this.getCustomerOrThrow(id, tenantId);
    return CustomerMapper.toResponse(customer);
  }

  async getCustomerByEmail(email: string, tenantId: string): Promise<CustomerResponseDto> {
    const customer = await this.customerRepo.findByEmail(email.toLowerCase(), tenantId);
    if (!customer) throw new CustomerException(CUSTOMER_ERROR_CODES.CUSTOMER_NOT_FOUND, 'Customer not found');
    return CustomerMapper.toResponse(customer);
  }

  async listCustomers(tenantId: string, filters?: CustomerListFilters): Promise<CustomerListResponseDto> {
    const result = await this.customerRepo.list(tenantId, filters);
    return { items: result.items.map(c => CustomerMapper.toResponse(c)), total: result.total, limit: result.limit, offset: result.offset };
  }

  async updateCustomerProfile(command: UpdateCustomerProfileCommand): Promise<CustomerResponseDto> {
    const customer = await this.getCustomerOrThrow(command.customerId, command.tenantId);
    this.ensureWritable(customer);
    customer.updateProfile(command.firstName, command.lastName, command.phone, command.documentType, command.documentNumber);
    await this.customerRepo.save(customer);
    return CustomerMapper.toResponse(customer);
  }

  async changeCustomerStatus(command: ChangeCustomerStatusCommand): Promise<CustomerResponseDto> {
    const customer = await this.getCustomerOrThrow(command.customerId, command.tenantId);
    if (customer.getStatus().toString() === command.status) return CustomerMapper.toResponse(customer);
    switch (command.status) {
      case 'ACTIVE': customer.activate(); break;
      case 'INACTIVE': customer.deactivate(); break;
      case 'BLOCKED': customer.block(); break;
      case 'ARCHIVED': customer.archive(); break;
      default: throw new CustomerException(CUSTOMER_ERROR_CODES.CUSTOMER_INVALID_STATUS_TRANSITION, 'Invalid status');
    }
    await this.customerRepo.save(customer);
    return CustomerMapper.toResponse(customer);
  }

  async linkCustomerToUser(command: LinkCustomerToUserCommand): Promise<CustomerResponseDto> {
    const customer = await this.getCustomerOrThrow(command.customerId, command.tenantId);
    if (customer.getUserId() && customer.getUserId() !== command.userId) throw new CustomerException(CUSTOMER_ERROR_CODES.CUSTOMER_USER_ALREADY_LINKED, 'Customer already linked');
    const existing = await this.customerRepo.findByUserId(command.userId, command.tenantId);
    if (existing && existing.getId().toString() !== command.customerId) throw new CustomerException(CUSTOMER_ERROR_CODES.CUSTOMER_USER_ALREADY_LINKED, 'User already linked to another customer');
    if (!(await this.userReader.exists(command.userId, command.tenantId))) throw new CustomerException(CUSTOMER_ERROR_CODES.CUSTOMER_USER_MISMATCH, 'User does not exist');
    customer.linkUser(command.userId);
    await this.customerRepo.save(customer);
    return CustomerMapper.toResponse(customer);
  }

  async convertGuestCustomer(command: ConvertGuestCustomerCommand): Promise<CustomerResponseDto> {
    const email = command.email.toLowerCase();
    const existing = await this.customerRepo.findByEmail(email, command.tenantId);
    if (existing && existing.getUserId() && existing.getUserId() !== command.userId) {
      throw new CustomerException(CUSTOMER_ERROR_CODES.CUSTOMER_GUEST_CONVERSION_CONFLICT, 'Existing customer linked to different user');
    }
    const customer = existing ?? Customer.create({ tenantId: command.tenantId, email, firstName: 'Guest', lastName: 'Customer', source: 'GUEST_CHECKOUT', userId: null });
    if (customer.getUserId() && customer.getUserId() !== command.userId) {
      throw new CustomerException(CUSTOMER_ERROR_CODES.CUSTOMER_GUEST_CONVERSION_CONFLICT, 'Customer already linked');
    }
    customer.linkUser(command.userId);
    await this.customerRepo.save(customer);
    return CustomerMapper.toResponse(customer);
  }

  async archiveCustomer(command: ArchiveCustomerCommand): Promise<CustomerResponseDto> {
    const customer = await this.getCustomerOrThrow(command.customerId, command.tenantId);
    customer.archive(); await this.customerRepo.save(customer); return CustomerMapper.toResponse(customer);
  }
  async restoreCustomer(command: RestoreCustomerCommand): Promise<CustomerResponseDto> {
    const customer = await this.getCustomerOrThrow(command.customerId, command.tenantId);
    customer.restore(); await this.customerRepo.save(customer); return CustomerMapper.toResponse(customer);
  }

  async addCustomerAddress(command: AddCustomerAddressCommand): Promise<CustomerResponseDto> {
    const customer = await this.getCustomerOrThrow(command.customerId, command.tenantId); this.ensureWritable(customer);
    const address = new CustomerAddress(command.tenantId, command.customerId, command.type as 'SHIPPING' | 'BILLING' | 'BOTH', command.label, command.recipientName, command.phone, command.street, command.number, command.apartment, command.city, command.province, command.postalCode, command.country, command.notes, false, false);
    customer.addAddress(address); await this.addressRepo.save(address); await this.customerRepo.save(customer); return CustomerMapper.toResponse(customer);
  }
  async updateCustomerAddress(command: UpdateCustomerAddressCommand): Promise<CustomerResponseDto> {
    const customer = await this.getCustomerOrThrow(command.customerId, command.tenantId); this.ensureWritable(customer);
    const address = await this.addressRepo.findById(command.addressId, command.tenantId);
    if (!address) throw new CustomerException(CUSTOMER_ERROR_CODES.CUSTOMER_ADDRESS_NOT_FOUND, 'Address not found');
    await this.addressRepo.softDelete(command.addressId, command.tenantId);
    const updated = new CustomerAddress(command.tenantId, command.customerId, address.getType() as 'SHIPPING' | 'BILLING' | 'BOTH', command.label, command.recipientName, command.phone, command.street, command.number, command.apartment, command.city, command.province, command.postalCode, command.country, command.notes, address.getIsDefaultShipping(), address.getIsDefaultBilling());
    customer.removeAddress(command.addressId); customer.addAddress(updated); await this.addressRepo.save(updated); await this.customerRepo.save(customer); return CustomerMapper.toResponse(customer);
  }
  async removeCustomerAddress(command: RemoveCustomerAddressCommand): Promise<CustomerResponseDto> {
    const customer = await this.getCustomerOrThrow(command.customerId, command.tenantId); customer.removeAddress(command.addressId); await this.addressRepo.softDelete(command.addressId, command.tenantId); await this.customerRepo.save(customer); return CustomerMapper.toResponse(customer);
  }
  async setDefaultShippingAddress(command: SetDefaultShippingAddressCommand): Promise<CustomerResponseDto> {
    const customer = await this.getCustomerOrThrow(command.customerId, command.tenantId); customer.setDefaultShippingAddress(command.addressId); await this.customerRepo.save(customer); return CustomerMapper.toResponse(customer);
  }
  async setDefaultBillingAddress(command: SetDefaultBillingAddressCommand): Promise<CustomerResponseDto> {
    const customer = await this.getCustomerOrThrow(command.customerId, command.tenantId); customer.setDefaultBillingAddress(command.addressId); await this.customerRepo.save(customer); return CustomerMapper.toResponse(customer);
  }
  async updateCustomerPreferences(command: UpdateCustomerPreferencesCommand): Promise<CustomerResponseDto> {
    const customer = await this.getCustomerOrThrow(command.customerId, command.tenantId);
    customer.updatePreferences(new CustomerPreferences(command.customerId, command.language, command.currency, command.marketingEmail, command.marketingWhatsApp, command.marketingSms, command.orderNotifications, command.productRecommendations));
    await this.customerRepo.save(customer); return CustomerMapper.toResponse(customer);
  }

  async createCustomerTag(command: CreateCustomerTagCommand): Promise<CustomerTagPrimitives> {
    if (await this.tagRepo.existsBySlug(command.slug, command.tenantId)) throw new CustomerException(CUSTOMER_ERROR_CODES.CUSTOMER_TAG_ALREADY_ASSIGNED, 'Tag exists');
    const tag = new CustomerTag(command.tenantId, command.name, command.slug, command.description ?? null);
    await this.tagRepo.save(tag); return tag.toPrimitives();
  }
  async listCustomerTags(tenantId: string): Promise<CustomerTagPrimitives[]> { return (await this.tagRepo.list(tenantId)).map(t => t.toPrimitives()); }
  async assignCustomerTag(command: AssignCustomerTagCommand): Promise<CustomerResponseDto> {
    const customer = await this.getCustomerOrThrow(command.customerId, command.tenantId);
    const tag = await this.tagRepo.findById(command.tagId, command.tenantId); if (!tag) throw new CustomerException(CUSTOMER_ERROR_CODES.CUSTOMER_TAG_NOT_FOUND, 'Tag not found');
    customer.addTag(tag); await this.customerRepo.save(customer); return CustomerMapper.toResponse(customer);
  }
  async removeCustomerTag(command: RemoveCustomerTagCommand): Promise<CustomerResponseDto> {
    const customer = await this.getCustomerOrThrow(command.customerId, command.tenantId); customer.removeTag(command.tagId); await this.customerRepo.save(customer); return CustomerMapper.toResponse(customer);
  }

  async addCustomerNote(command: AddCustomerNoteCommand): Promise<CustomerNotePrimitives> {
    const customer = await this.getCustomerOrThrow(command.customerId, command.tenantId); const note = new CustomerNote(command.tenantId, command.customerId, command.content, command.createdBy); customer.addInternalNote(note); await this.noteRepo.save(note); await this.customerRepo.save(customer); return note.toPrimitives();
  }
  async updateCustomerNote(command: UpdateCustomerNoteCommand): Promise<CustomerNotePrimitives> {
    const note = await this.noteRepo.findById(command.noteId, command.tenantId); if (!note) throw new CustomerException(CUSTOMER_ERROR_CODES.CUSTOMER_NOTE_NOT_FOUND, 'Note not found'); await this.noteRepo.softDelete(command.noteId, command.tenantId); const updated = new CustomerNote(command.tenantId, command.customerId, command.content, note.toPrimitives().createdBy); await this.noteRepo.save(updated); return updated.toPrimitives();
  }
  async removeCustomerNote(command: RemoveCustomerNoteCommand): Promise<void> { await this.noteRepo.softDelete(command.noteId, command.tenantId); }
  async listCustomerNotes(customerId: string, tenantId: string): Promise<CustomerNotePrimitives[]> { return (await this.noteRepo.listByCustomer(customerId, tenantId)).map(n => n.toPrimitives()); }

  async recalculateCustomerMetrics(command: RecalculateCustomerMetricsCommand): Promise<CustomerResponseDto> {
    const customer = await this.getCustomerOrThrow(command.customerId, command.tenantId);
    const orders = await this.orderReader.countByCustomer(command.customerId, command.tenantId);
    const spent = await this.orderReader.sumSpentByCustomer(command.customerId, command.tenantId);
    const dates = await this.orderReader.findOrderTimestampsByCustomer(command.customerId, command.tenantId);
    customer.updateCommercialMetrics(orders, spent, dates.firstOrderAt, dates.lastOrderAt);
    await this.customerRepo.save(customer); return CustomerMapper.toResponse(customer);
  }
  async updateCustomerMetricsFromOrder(command: UpdateCustomerMetricsFromOrderCommand): Promise<void> {
    const customer = await this.getCustomerOrThrow(command.customerId, command.tenantId);
    const current = customer.toPrimitives();
    const totalOrders = current.totalOrders + 1;
    const totalSpent = current.totalSpent + command.orderTotal;
    customer.updateCommercialMetrics(totalOrders, totalSpent, current.firstOrderAt ?? command.orderCreatedAt, command.orderCreatedAt);
    await this.customerRepo.save(customer);
  }
}
