import { Email } from '../../../identity/domain/value-objects/email.value-object';
import { Phone } from '../../../identity/domain/value-objects/phone.value-object';
import { CustomerId, CustomerName, CustomerStatus, CustomerSource, DocumentNumber } from '../value-objects';
import { CustomerAddress, type CustomerAddressPrimitives } from './customer-address';
import { CustomerPreferences, type CustomerPreferencesPrimitives } from './customer-preferences';
import { CustomerTag, type CustomerTagPrimitives } from './customer-tag';
import { CustomerNote, type CustomerNotePrimitives } from './customer-note';

export type CustomerPrimitives = {
  id: string; tenantId: string; userId: string | null; email: string; firstName: string; lastName: string; phone: string | null;
  documentType: string | null; documentNumber: string | null; status: string; source: string; locale: string; preferredCurrency: string;
  acceptsMarketing: boolean; emailVerified: boolean; phoneVerified: boolean; lastOrderAt: Date | null; firstOrderAt: Date | null;
  totalOrders: number; totalSpent: number; averageOrderValue: number; createdAt: Date; updatedAt: Date; deletedAt: Date | null; version: number;
  addresses: CustomerAddressPrimitives[]; preferences: CustomerPreferencesPrimitives | null; tags: CustomerTagPrimitives[]; notes: CustomerNotePrimitives[];
};

type CreateParams = { tenantId: string; email: string; firstName: string; lastName: string; source?: string; locale?: string; preferredCurrency?: string; userId?: string | null; phone?: string | null; documentType?: string | null; documentNumber?: string | null; acceptsMarketing?: boolean; emailVerified?: boolean; phoneVerified?: boolean; };

export class Customer {
  private id!: CustomerId; private tenantId!: string; private userId: string | null = null; private email!: string; private firstName!: string; private lastName!: string; private phone: string | null = null;
  private documentType: string | null = null; private documentNumber: string | null = null; private status!: CustomerStatus; private source!: CustomerSource; private locale!: string; private preferredCurrency!: string;
  private acceptsMarketing = false; private emailVerified = false; private phoneVerified = false; private lastOrderAt: Date | null = null; private firstOrderAt: Date | null = null;
  private totalOrders = 0; private totalSpent = 0; private averageOrderValue = 0; private createdAt!: Date; private updatedAt!: Date; private deletedAt: Date | null = null; private version = 1;
  private addresses: CustomerAddress[] = []; private preferences: CustomerPreferences | null = null; private tags: CustomerTag[] = []; private notes: CustomerNote[] = [];

  private constructor() {}

  static create(params: CreateParams): Customer {
    const c = new Customer();
    c.id = new CustomerId(); c.tenantId = params.tenantId;
    c.email = new Email(params.email).toString(); c.firstName = new CustomerName(params.firstName).toString(); c.lastName = new CustomerName(params.lastName).toString();
    c.phone = params.phone ? new Phone(params.phone).toString() : null; c.documentType = params.documentType ?? null; c.documentNumber = params.documentNumber ? new DocumentNumber(params.documentNumber).toString() : null;
    c.status = CustomerStatus.ACTIVE(); c.source = CustomerSource.create(params.source ?? 'WEB'); c.locale = params.locale ?? 'es-AR'; c.preferredCurrency = params.preferredCurrency ?? 'ARS';
    c.acceptsMarketing = params.acceptsMarketing ?? false; c.emailVerified = params.emailVerified ?? false; c.phoneVerified = params.phoneVerified ?? false; c.createdAt = new Date(); c.updatedAt = new Date();
    c.userId = params.userId ?? null; return c;
  }

  static fromPrimitives(p: CustomerPrimitives): Customer {
    const c = new Customer();
    c.id = new CustomerId(p.id); c.tenantId = p.tenantId; c.userId = p.userId; c.email = p.email; c.firstName = p.firstName; c.lastName = p.lastName; c.phone = p.phone;
    c.documentType = p.documentType; c.documentNumber = p.documentNumber; c.status = CustomerStatus.create(p.status); c.source = CustomerSource.create(p.source); c.locale = p.locale; c.preferredCurrency = p.preferredCurrency;
    c.acceptsMarketing = p.acceptsMarketing; c.emailVerified = p.emailVerified; c.phoneVerified = p.phoneVerified; c.lastOrderAt = p.lastOrderAt; c.firstOrderAt = p.firstOrderAt; c.totalOrders = p.totalOrders; c.totalSpent = p.totalSpent; c.averageOrderValue = p.averageOrderValue;
    c.createdAt = p.createdAt; c.updatedAt = p.updatedAt; c.deletedAt = p.deletedAt; c.version = p.version;
    c.addresses = p.addresses.map(a => CustomerAddress.fromPrimitives(a)); c.preferences = p.preferences ? CustomerPreferences.fromPrimitives(p.preferences) : null; c.tags = p.tags.map(t => CustomerTag.fromPrimitives(t)); c.notes = p.notes.map(n => CustomerNote.fromPrimitives(n));
    return c;
  }

  toPrimitives(): CustomerPrimitives {
    return { id: this.id.toString(), tenantId: this.tenantId, userId: this.userId, email: this.email, firstName: this.firstName, lastName: this.lastName, phone: this.phone, documentType: this.documentType, documentNumber: this.documentNumber, status: this.status.toString(), source: this.source.toString(), locale: this.locale, preferredCurrency: this.preferredCurrency, acceptsMarketing: this.acceptsMarketing, emailVerified: this.emailVerified, phoneVerified: this.phoneVerified, lastOrderAt: this.lastOrderAt, firstOrderAt: this.firstOrderAt, totalOrders: this.totalOrders, totalSpent: this.totalSpent, averageOrderValue: this.averageOrderValue, createdAt: this.createdAt, updatedAt: this.updatedAt, deletedAt: this.deletedAt, version: this.version, addresses: this.addresses.map(a => a.toPrimitives()), preferences: this.preferences?.toPrimitives() ?? null, tags: this.tags.map(t => t.toPrimitives()), notes: this.notes.map(n => n.toPrimitives()) };
  }

  getId(): CustomerId { return this.id; }
  getTenantId(): string { return this.tenantId; }
  getEmail(): string { return this.email; }
  getUserId(): string | null { return this.userId; }
  getStatus(): CustomerStatus { return this.status; }
  getAddresses(): CustomerAddress[] { return [...this.addresses]; }
  getPreferences(): CustomerPreferences | null { return this.preferences; }
  getNotes(): CustomerNote[] { return [...this.notes]; }
  getTags(): CustomerTag[] { return [...this.tags]; }

  updateProfile(firstName: string, lastName: string, phone?: string | null, documentType?: string | null, documentNumber?: string | null): void {
    if (this.status.isArchived()) throw new Error('Customer archived');
    this.firstName = new CustomerName(firstName).toString(); this.lastName = new CustomerName(lastName).toString();
    this.phone = phone ? new Phone(phone).toString() : null; this.documentType = documentType ?? null; this.documentNumber = documentNumber ? new DocumentNumber(documentNumber).toString() : null; this.touch();
  }
  changeEmail(email: string): void { this.email = new Email(email).toString(); this.touch(); }
  changePhone(phone: string | null): void { this.phone = phone ? new Phone(phone).toString() : null; this.touch(); }
  linkUser(userId: string): void { this.userId = userId.trim(); this.touch(); }
  unlinkUser(): void { this.userId = null; this.touch(); }
  activate(): void { if (!this.status.canTransitionTo('ACTIVE')) throw new Error('Invalid transition'); this.status = CustomerStatus.ACTIVE(); this.touch(); }
  deactivate(): void { if (!this.status.canTransitionTo('INACTIVE')) throw new Error('Invalid transition'); this.status = CustomerStatus.INACTIVE(); this.touch(); }
  block(): void { if (!this.status.canTransitionTo('BLOCKED')) throw new Error('Invalid transition'); this.status = CustomerStatus.BLOCKED(); this.touch(); }
  unblock(): void { if (!this.status.canTransitionTo('ACTIVE')) throw new Error('Invalid transition'); this.status = CustomerStatus.ACTIVE(); this.touch(); }
  archive(): void { if (!this.status.canTransitionTo('ARCHIVED')) throw new Error('Invalid transition'); this.status = CustomerStatus.ARCHIVED(); this.deletedAt = new Date(); this.touch(); }
  restore(): void { this.status = CustomerStatus.ACTIVE(); this.deletedAt = null; this.touch(); }
  updatePreferences(preferences: CustomerPreferences): void { this.preferences = preferences; this.touch(); }
  addAddress(address: CustomerAddress): void { this.addresses.push(address); this.touch(); }
  removeAddress(addressId: string): void { this.addresses = this.addresses.filter(a => a.getId() !== addressId); this.touch(); }
  setDefaultShippingAddress(addressId: string): void { this.addresses.forEach(a => a.setDefaultShipping(a.getId() === addressId)); this.touch(); }
  setDefaultBillingAddress(addressId: string): void { this.addresses.forEach(a => a.setDefaultBilling(a.getId() === addressId)); this.touch(); }
  addTag(tag: CustomerTag): void { if (!this.tags.find(t => t.toPrimitives().slug === tag.toPrimitives().slug)) this.tags.push(tag); this.touch(); }
  removeTag(tagId: string): void { this.tags = this.tags.filter(t => t.getId() !== tagId); this.touch(); }
  addInternalNote(note: CustomerNote): void { this.notes.push(note); this.touch(); }
  updateCommercialMetrics(totalOrders: number, totalSpent: number, firstOrderAt?: Date | null, lastOrderAt?: Date | null): void { this.totalOrders = totalOrders; this.totalSpent = totalSpent; this.averageOrderValue = totalOrders > 0 ? Math.round(totalSpent / totalOrders) : 0; this.firstOrderAt = firstOrderAt ?? this.firstOrderAt; this.lastOrderAt = lastOrderAt ?? this.lastOrderAt; this.touch(); }
  softDelete(): void { this.deletedAt = new Date(); this.touch(); }

  private touch(): void { this.updatedAt = new Date(); this.version++; }
}
