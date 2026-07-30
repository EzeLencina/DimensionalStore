import { Controller, Get, Post, Patch, Delete, Body, Param, Headers, HttpCode, HttpStatus } from '@nestjs/common';
import { CartAppService } from '../../../services';
import { AddCartItemRequestDto, UpdateCartItemQuantityRequestDto, MergeCartRequestDto } from '../dto';
import { CreateGuestCartCommand, AddCartItemCommand, UpdateCartItemQuantityCommand, RemoveCartItemCommand, MergeCartCommand } from '../../../application/commands';
import type { CartResponseDto, CreateGuestCartResponseDto } from '../../../application/dto';

@Controller('api/v1/carts')
export class CartController {
  constructor(private readonly cartAppService: CartAppService) {}

  private getTenantId(headers: Record<string, string>): string {
    return headers['x-tenant-id'] || 'default';
  }

  private getCustomerId(headers: Record<string, string>): string | undefined {
    return headers['x-customer-id'];
  }

  private getGuestToken(headers: Record<string, string>): string | undefined {
    return headers['x-guest-token'];
  }

  private async resolveCartId(headers: Record<string, string>): Promise<string> {
    const tenantId = this.getTenantId(headers);
    const customerId = this.getCustomerId(headers);
    const guestToken = this.getGuestToken(headers);

    if (customerId) {
      const cart = await this.cartAppService.resolveCurrentCart({ tenantId, customerId });
      if (cart) return cart.id;
    }
    if (guestToken) {
      const cart = await this.cartAppService.resolveCurrentCart({ tenantId, guestToken });
      if (cart) return cart.id;
    }
    throw new Error('No active cart found');
  }

  @Post('guest')
  @HttpCode(HttpStatus.CREATED)
  async createGuest(@Headers() headers: Record<string, string>): Promise<CreateGuestCartResponseDto> {
    const tenantId = this.getTenantId(headers);
    return this.cartAppService.createGuestCart(new CreateGuestCartCommand(tenantId));
  }

  @Get('current')
  async getCurrent(@Headers() headers: Record<string, string>): Promise<CartResponseDto> {
    const tenantId = this.getTenantId(headers);
    const customerId = this.getCustomerId(headers);
    const guestToken = this.getGuestToken(headers);

    if (customerId) {
      const cart = await this.cartAppService.resolveCurrentCart({ tenantId, customerId });
      if (cart) return cart;
    }
    if (guestToken) {
      const cart = await this.cartAppService.resolveCurrentCart({ tenantId, guestToken });
      if (cart) return cart;
    }
    throw new Error('No active cart found');
  }

  @Post('current/items')
  @HttpCode(HttpStatus.CREATED)
  async addItem(@Headers() headers: Record<string, string>, @Body() dto: AddCartItemRequestDto): Promise<CartResponseDto> {
    const tenantId = this.getTenantId(headers);
    const cartId = await this.resolveCartId(headers);
    return this.cartAppService.addItem(cartId, tenantId, new AddCartItemCommand(tenantId, dto.productVariantId, dto.quantity));
  }

  @Patch('current/items/:productVariantId')
  async updateItemQuantity(
    @Headers() headers: Record<string, string>,
    @Param('productVariantId') productVariantId: string,
    @Body() dto: UpdateCartItemQuantityRequestDto,
  ): Promise<CartResponseDto> {
    const tenantId = this.getTenantId(headers);
    const cartId = await this.resolveCartId(headers);
    return this.cartAppService.updateItemQuantity(cartId, tenantId, new UpdateCartItemQuantityCommand(tenantId, productVariantId, dto.quantity));
  }

  @Delete('current/items/:productVariantId')
  @HttpCode(HttpStatus.OK)
  async removeItem(@Headers() headers: Record<string, string>, @Param('productVariantId') productVariantId: string): Promise<CartResponseDto> {
    const tenantId = this.getTenantId(headers);
    const cartId = await this.resolveCartId(headers);
    return this.cartAppService.removeItem(cartId, tenantId, new RemoveCartItemCommand(tenantId, productVariantId));
  }

  @Delete('current/items')
  @HttpCode(HttpStatus.OK)
  async clearCart(@Headers() headers: Record<string, string>): Promise<CartResponseDto> {
    const tenantId = this.getTenantId(headers);
    const cartId = await this.resolveCartId(headers);
    return this.cartAppService.clearCart(cartId, tenantId);
  }

  @Post('current/recalculate')
  @HttpCode(HttpStatus.OK)
  async recalculate(@Headers() headers: Record<string, string>): Promise<CartResponseDto> {
    const tenantId = this.getTenantId(headers);
    const cartId = await this.resolveCartId(headers);
    return this.cartAppService.recalculateCart(cartId, tenantId);
  }

  @Post('merge')
  @HttpCode(HttpStatus.OK)
  async merge(@Headers() headers: Record<string, string>, @Body() dto: MergeCartRequestDto): Promise<CartResponseDto> {
    const tenantId = this.getTenantId(headers);
    const customerId = this.getCustomerId(headers);
    if (!customerId) throw new Error('Customer ID required for merge');
    const sourceHash = CartAppService.hashToken(dto.sourceGuestToken);
    return this.cartAppService.mergeCart(tenantId, customerId, new MergeCartCommand(tenantId, sourceHash));
  }

  @Post('current/cancel')
  @HttpCode(HttpStatus.OK)
  async cancel(@Headers() headers: Record<string, string>): Promise<CartResponseDto> {
    const tenantId = this.getTenantId(headers);
    const cartId = await this.resolveCartId(headers);
    return this.cartAppService.cancelCart(cartId, tenantId);
  }
}
