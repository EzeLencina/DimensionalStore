import { Body, Controller, Delete, Get, Headers, Param, Patch, Post } from '@nestjs/common';
import { CustomerAppService } from '../../services';
import type { UpdateCustomerProfileRequestDto, CustomerAddressRequestDto, CustomerPreferencesRequestDto } from '../dto';
import { UpdateCustomerProfileCommand, AddCustomerAddressCommand, UpdateCustomerAddressCommand, RemoveCustomerAddressCommand, UpdateCustomerPreferencesCommand } from '../../application/commands';

@Controller('api/v1/account')
export class CustomerAccountController {
  constructor(private readonly service: CustomerAppService) {}
  private tenant(headers: Record<string, string>): string { return headers['x-tenant-id'] || 'default'; }
  private customer(headers: Record<string, string>): string { return headers['x-customer-id'] || headers['x-user-id'] || ''; }

  @Get('profile') profile(@Headers() headers: Record<string, string>) { return this.service.getCustomerById(this.customer(headers), this.tenant(headers)); }
  @Patch('profile') updateProfile(@Headers() headers: Record<string, string>, @Body() dto: UpdateCustomerProfileRequestDto) { return this.service.updateCustomerProfile(new UpdateCustomerProfileCommand(this.tenant(headers), this.customer(headers), dto.firstName, dto.lastName, dto.phone ?? null, dto.documentType ?? null, dto.documentNumber ?? null)); }
  @Get('addresses') addresses(@Headers() headers: Record<string, string>) { return this.service.getCustomerById(this.customer(headers), this.tenant(headers)); }
  @Post('addresses') addAddress(@Headers() headers: Record<string, string>, @Body() dto: CustomerAddressRequestDto) { return this.service.addCustomerAddress(new AddCustomerAddressCommand(this.tenant(headers), this.customer(headers), dto.type, dto.label ?? null, dto.recipientName, dto.phone ?? null, dto.street, dto.number, dto.apartment ?? null, dto.city, dto.province, dto.postalCode, dto.country, dto.notes ?? null)); }
  @Patch('addresses/:addressId') updateAddress(@Headers() headers: Record<string, string>, @Param('addressId') addressId: string, @Body() dto: CustomerAddressRequestDto) { return this.service.updateCustomerAddress(new UpdateCustomerAddressCommand(this.tenant(headers), this.customer(headers), addressId, dto.label ?? null, dto.recipientName, dto.phone ?? null, dto.street, dto.number, dto.apartment ?? null, dto.city, dto.province, dto.postalCode, dto.country, dto.notes ?? null)); }
  @Delete('addresses/:addressId') removeAddress(@Headers() headers: Record<string, string>, @Param('addressId') addressId: string) { return this.service.removeCustomerAddress(new RemoveCustomerAddressCommand(this.tenant(headers), this.customer(headers), addressId)); }
  @Patch('preferences') updatePreferences(@Headers() headers: Record<string, string>, @Body() dto: CustomerPreferencesRequestDto) { return this.service.updateCustomerPreferences(new UpdateCustomerPreferencesCommand(this.tenant(headers), this.customer(headers), dto.language, dto.currency, dto.marketingEmail, dto.marketingWhatsApp, dto.marketingSms, dto.orderNotifications, dto.productRecommendations)); }
}
