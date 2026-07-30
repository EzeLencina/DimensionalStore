import { Body, Controller, Delete, Get, Headers, HttpCode, HttpStatus, Param, Patch, Post, Query } from '@nestjs/common';
import { CustomerAppService } from '../../services';
import type { CreateCustomerRequestDto, UpdateCustomerProfileRequestDto, CustomerAddressRequestDto, CustomerPreferencesRequestDto, CustomerTagRequestDto, CustomerNoteRequestDto } from '../dto';
import {
  CreateCustomerCommand, UpdateCustomerProfileCommand, ChangeCustomerStatusCommand, ArchiveCustomerCommand, RestoreCustomerCommand,
  AddCustomerAddressCommand, UpdateCustomerAddressCommand, RemoveCustomerAddressCommand, SetDefaultShippingAddressCommand, SetDefaultBillingAddressCommand,
  UpdateCustomerPreferencesCommand, CreateCustomerTagCommand, AssignCustomerTagCommand, RemoveCustomerTagCommand,
  AddCustomerNoteCommand, UpdateCustomerNoteCommand, RemoveCustomerNoteCommand, RecalculateCustomerMetricsCommand,
} from '../../application/commands';

@Controller('api/v1/admin/customers')
export class AdminCustomerController {
  constructor(private readonly service: CustomerAppService) {}
  private tenant(headers: Record<string, string>): string { return headers['x-tenant-id'] || 'default'; }

  @Post()
  create(@Headers() headers: Record<string, string>, @Body() dto: CreateCustomerRequestDto) { return this.service.createCustomer(new CreateCustomerCommand(this.tenant(headers), dto.email, dto.firstName, dto.lastName, dto.source, dto.locale, dto.preferredCurrency, dto.userId, dto.phone)); }
  @Get()
  list(@Headers() headers: Record<string, string>, @Query('search') search?: string) { return this.service.listCustomers(this.tenant(headers), { search }); }
  @Get(':id') get(@Headers() headers: Record<string, string>, @Param('id') id: string) { return this.service.getCustomerById(id, this.tenant(headers)); }
  @Patch(':id') update(@Headers() headers: Record<string, string>, @Param('id') id: string, @Body() dto: UpdateCustomerProfileRequestDto) { return this.service.updateCustomerProfile(new UpdateCustomerProfileCommand(this.tenant(headers), id, dto.firstName, dto.lastName, dto.phone ?? null, dto.documentType ?? null, dto.documentNumber ?? null)); }
  @Patch(':id/status') status(@Headers() headers: Record<string, string>, @Param('id') id: string, @Body('status') status: string) { return this.service.changeCustomerStatus(new ChangeCustomerStatusCommand(this.tenant(headers), id, status)); }
  @Post(':id/archive') archive(@Headers() headers: Record<string, string>, @Param('id') id: string) { return this.service.archiveCustomer(new ArchiveCustomerCommand(this.tenant(headers), id)); }
  @Post(':id/restore') restore(@Headers() headers: Record<string, string>, @Param('id') id: string) { return this.service.restoreCustomer(new RestoreCustomerCommand(this.tenant(headers), id)); }

  @Get(':id/addresses') addresses(@Headers() headers: Record<string, string>, @Param('id') id: string) { return this.service.getCustomerById(id, this.tenant(headers)); }
  @Post(':id/addresses') addAddress(@Headers() headers: Record<string, string>, @Param('id') id: string, @Body() dto: CustomerAddressRequestDto) { return this.service.addCustomerAddress(new AddCustomerAddressCommand(this.tenant(headers), id, dto.type, dto.label ?? null, dto.recipientName, dto.phone ?? null, dto.street, dto.number, dto.apartment ?? null, dto.city, dto.province, dto.postalCode, dto.country, dto.notes ?? null)); }
  @Patch(':id/addresses/:addressId') updateAddress(@Headers() headers: Record<string, string>, @Param('id') id: string, @Param('addressId') addressId: string, @Body() dto: CustomerAddressRequestDto) { return this.service.updateCustomerAddress(new UpdateCustomerAddressCommand(this.tenant(headers), id, addressId, dto.label ?? null, dto.recipientName, dto.phone ?? null, dto.street, dto.number, dto.apartment ?? null, dto.city, dto.province, dto.postalCode, dto.country, dto.notes ?? null)); }
  @Delete(':id/addresses/:addressId') removeAddress(@Headers() headers: Record<string, string>, @Param('id') id: string, @Param('addressId') addressId: string) { return this.service.removeCustomerAddress(new RemoveCustomerAddressCommand(this.tenant(headers), id, addressId)); }
  @Post(':id/addresses/:addressId/default-shipping') defaultShipping(@Headers() headers: Record<string, string>, @Param('id') id: string, @Param('addressId') addressId: string) { return this.service.setDefaultShippingAddress(new SetDefaultShippingAddressCommand(this.tenant(headers), id, addressId)); }
  @Post(':id/addresses/:addressId/default-billing') defaultBilling(@Headers() headers: Record<string, string>, @Param('id') id: string, @Param('addressId') addressId: string) { return this.service.setDefaultBillingAddress(new SetDefaultBillingAddressCommand(this.tenant(headers), id, addressId)); }

  @Get('/customer-tags') tags(@Headers() headers: Record<string, string>) { return this.service.listCustomerTags(this.tenant(headers)); }
  @Post('/customer-tags') createTag(@Headers() headers: Record<string, string>, @Body() dto: CustomerTagRequestDto) { return this.service.createCustomerTag(new CreateCustomerTagCommand(this.tenant(headers), dto.name, dto.slug, dto.description ?? null)); }
  @Post(':id/tags/:tagId') assignTag(@Headers() headers: Record<string, string>, @Param('id') id: string, @Param('tagId') tagId: string) { return this.service.assignCustomerTag(new AssignCustomerTagCommand(this.tenant(headers), id, tagId, 'admin')); }
  @Delete(':id/tags/:tagId') removeTag(@Headers() headers: Record<string, string>, @Param('id') id: string, @Param('tagId') tagId: string) { return this.service.removeCustomerTag(new RemoveCustomerTagCommand(this.tenant(headers), id, tagId)); }

  @Get(':id/notes') notes(@Headers() headers: Record<string, string>, @Param('id') id: string) { return this.service.listCustomerNotes(id, this.tenant(headers)); }
  @Post(':id/notes') addNote(@Headers() headers: Record<string, string>, @Param('id') id: string, @Body() dto: CustomerNoteRequestDto) { return this.service.addCustomerNote(new AddCustomerNoteCommand(this.tenant(headers), id, dto.content, dto.createdBy)); }
  @Patch(':id/notes/:noteId') updateNote(@Headers() headers: Record<string, string>, @Param('id') id: string, @Param('noteId') noteId: string, @Body('content') content: string) { return this.service.updateCustomerNote(new UpdateCustomerNoteCommand(this.tenant(headers), id, noteId, content)); }
  @Delete(':id/notes/:noteId') removeNote(@Headers() headers: Record<string, string>, @Param('id') id: string, @Param('noteId') noteId: string) { return this.service.removeCustomerNote(new RemoveCustomerNoteCommand(this.tenant(headers), id, noteId)); }

  @Post(':id/recalculate-metrics') recalc(@Headers() headers: Record<string, string>, @Param('id') id: string) { return this.service.recalculateCustomerMetrics(new RecalculateCustomerMetricsCommand(this.tenant(headers), id)); }
}
