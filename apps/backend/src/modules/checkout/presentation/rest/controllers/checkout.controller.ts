import { Controller, Get, Post, Patch, Body, Param, Headers, HttpCode, HttpStatus } from '@nestjs/common';
import { CheckoutAppService } from '../../../services';
import { StartCheckoutRequestDto, UpdateAddressRequestDto, SelectShippingMethodRequestDto, SelectPaymentMethodRequestDto } from '../dto';
import { StartCheckoutCommand, UpdateAddressCommand, SelectShippingMethodCommand, SelectPaymentMethodCommand, ConfirmCheckoutCommand } from '../../../application/commands';
import type { CheckoutSessionResponseDto, OrderResponseDto } from '../../../application/dto';

@Controller('api/v1/checkout')
export class CheckoutController {
  constructor(private readonly checkoutAppService: CheckoutAppService) {}

  private getTenantId(headers: Record<string, string>): string {
    return headers['x-tenant-id'] || 'default';
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async start(@Headers() headers: Record<string, string>, @Body() dto: StartCheckoutRequestDto): Promise<CheckoutSessionResponseDto> {
    return this.checkoutAppService.startCheckout(new StartCheckoutCommand(this.getTenantId(headers), dto.cartId));
  }

  @Get(':id')
  async get(@Headers() headers: Record<string, string>, @Param('id') id: string): Promise<CheckoutSessionResponseDto> {
    return this.checkoutAppService.getCheckoutSession(id, this.getTenantId(headers));
  }

  @Patch(':id/address')
  async updateAddress(@Headers() headers: Record<string, string>, @Param('id') id: string, @Body() dto: UpdateAddressRequestDto): Promise<CheckoutSessionResponseDto> {
    const tenantId = this.getTenantId(headers);
    const cmd = new UpdateAddressCommand(
      dto.recipientName, dto.phone ?? null, dto.street, dto.number,
      dto.apartment ?? null, dto.city, dto.province, dto.postalCode,
      dto.country ?? 'AR', dto.notes ?? null,
    );
    return this.checkoutAppService.updateAddress(id, tenantId, cmd);
  }

  @Patch(':id/shipping-method')
  async selectShipping(@Headers() headers: Record<string, string>, @Param('id') id: string, @Body() dto: SelectShippingMethodRequestDto): Promise<CheckoutSessionResponseDto> {
    return this.checkoutAppService.selectShippingMethod(id, this.getTenantId(headers), new SelectShippingMethodCommand(dto.code));
  }

  @Patch(':id/payment-method')
  async selectPayment(@Headers() headers: Record<string, string>, @Param('id') id: string, @Body() dto: SelectPaymentMethodRequestDto): Promise<CheckoutSessionResponseDto> {
    return this.checkoutAppService.selectPaymentMethod(id, this.getTenantId(headers), new SelectPaymentMethodCommand(dto.code));
  }

  @Post(':id/validate')
  @HttpCode(HttpStatus.OK)
  async validate(@Headers() headers: Record<string, string>, @Param('id') id: string): Promise<CheckoutSessionResponseDto> {
    return this.checkoutAppService.validateCheckout(id, this.getTenantId(headers));
  }

  @Post(':id/confirm')
  @HttpCode(HttpStatus.CREATED)
  async confirm(@Headers() headers: Record<string, string>, @Param('id') id: string, @Body('idempotencyKey') idempotencyKey: string): Promise<OrderResponseDto> {
    return this.checkoutAppService.confirmCheckout(id, this.getTenantId(headers), new ConfirmCheckoutCommand(this.getTenantId(headers), idempotencyKey));
  }

  @Post(':id/cancel')
  @HttpCode(HttpStatus.OK)
  async cancel(@Headers() headers: Record<string, string>, @Param('id') id: string): Promise<CheckoutSessionResponseDto> {
    return this.checkoutAppService.cancelCheckout(id, this.getTenantId(headers));
  }
}
