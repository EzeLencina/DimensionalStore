import { Injectable, Inject } from '@nestjs/common';
import { LOGGER_TOKEN } from '@tienda/logger/nest';
import { Cart, CartId, Quantity, GuestCartToken, CustomerId } from '../domain';
import { CartException, CART_ERROR_CODES } from '../domain';
import { CartValidator } from '../application/validators';
import { CartMapper } from '../application/mappers';
import { CART_REPOSITORY } from '../domain/repository';
import type { CartRepository } from '../domain/repository';
import type { ProductVariantReader, PricingResolver, InventoryAvailabilityReader, Clock } from '../domain/ports';
import type { CartResponseDto, CreateGuestCartResponseDto } from '../application/dto';
import {
  CreateGuestCartCommand, GetOrCreateCustomerCartCommand,
  AddCartItemCommand, UpdateCartItemQuantityCommand,
  RemoveCartItemCommand, MergeCartCommand,
} from '../application/commands';

export const CART_DEFAULT_EXPIRATION_HOURS = 72;

@Injectable()
export class CartAppService {
  constructor(
    @Inject(CART_REPOSITORY) private readonly repository: CartRepository,
    @Inject('PRODUCT_VARIANT_READER') private readonly variantReader: ProductVariantReader,
    @Inject('PRICING_RESOLVER') private readonly pricingResolver: PricingResolver,
    @Inject('INVENTORY_AVAILABILITY_READER') private readonly inventoryReader: InventoryAvailabilityReader,
    @Inject('CLOCK') private readonly clock: Clock,
    @Inject(LOGGER_TOKEN) private readonly logger: any,
  ) {}

  private getDefaultExpiresAt(): Date {
    const now = this.clock.now();
    return new Date(now.getTime() + CART_DEFAULT_EXPIRATION_HOURS * 60 * 60 * 1000);
  }

  private async resolvePrice(productVariantId: string, tenantId: string): Promise<{ amount: number; currency: string }> {
    try {
      return await this.pricingResolver.resolveEffectivePrice(productVariantId, tenantId);
    } catch {
      throw new CartException(CART_ERROR_CODES.CART_PRICE_NOT_AVAILABLE, `Price not available for variant ${productVariantId}`);
    }
  }

  private async ensureVariantActive(productVariantId: string, tenantId: string): Promise<string> {
    const active = await this.variantReader.isActive(productVariantId, tenantId);
    if (!active) throw new CartException(CART_ERROR_CODES.CART_VARIANT_NOT_AVAILABLE, `Variant ${productVariantId} is not available`);
    const sku = await this.variantReader.getSku(productVariantId, tenantId);
    if (!sku) throw new CartException(CART_ERROR_CODES.CART_VARIANT_NOT_AVAILABLE, `Variant ${productVariantId} not found`);
    return sku;
  }

  private async ensureStock(productVariantId: string, tenantId: string, quantity: Quantity): Promise<void> {
    const available = await this.inventoryReader.getAvailableStock(productVariantId, tenantId);
    if (available < quantity.getValue()) {
      throw new CartException(CART_ERROR_CODES.CART_INSUFFICIENT_STOCK, `Insufficient stock for variant ${productVariantId}: requested ${quantity.getValue()}, available ${available}`);
    }
  }

  // ── Create Guest Cart ──

  async createGuestCart(command: CreateGuestCartCommand): Promise<CreateGuestCartResponseDto> {
    const { cart, rawToken } = Cart.createGuest({
      tenantId: command.tenantId,
      currency: command.currency,
      expiresAt: this.getDefaultExpiresAt(),
    });
    await this.repository.save(cart);
    this.logger.info({ event: 'cart.guest.created', cartId: cart.getId().toString(), tenantId: command.tenantId }, 'Guest cart created');
    return CartMapper.toGuestResponse(cart, rawToken);
  }

  // ── Get or Create Customer Cart ──

  async getOrCreateCustomerCart(command: GetOrCreateCustomerCartCommand): Promise<CartResponseDto> {
    const existing = await this.repository.findActiveByCustomer(command.customerId, command.tenantId);
    if (existing) return CartMapper.toResponse(existing);

    const cart = Cart.createCustomer({
      tenantId: command.tenantId,
      customerId: command.customerId,
      currency: command.currency,
      expiresAt: this.getDefaultExpiresAt(),
    });
    await this.repository.save(cart);
    this.logger.info({ event: 'cart.customer.created', cartId: cart.getId().toString(), tenantId: command.tenantId, customerId: command.customerId }, 'Customer cart created');
    return CartMapper.toResponse(cart);
  }

  // ── Get Cart by ID ──

  async getCart(cartId: string, tenantId: string): Promise<CartResponseDto> {
    const cart = await this.repository.findById(new CartId(cartId), tenantId);
    if (!cart) throw new CartException(CART_ERROR_CODES.CART_NOT_FOUND, 'Cart not found');
    return CartMapper.toResponse(cart);
  }

  // ── Get Cart by Guest Token ──

  async getCartByGuestToken(rawToken: string, tenantId: string): Promise<CartResponseDto> {
    const hash = CartAppService.hashToken(rawToken);
    const found = await this.repository.findActiveByGuestTokenHash(hash, tenantId);
    if (!found) throw new CartException(CART_ERROR_CODES.CART_NOT_FOUND, 'Cart not found for guest token');
    return CartMapper.toResponse(found);
  }

  static hashToken(raw: string): string {
    const crypto = require('node:crypto');
    return crypto.createHash('sha256').update(raw).digest('hex');
  }

  // ── Resolve Current Cart ──

  async resolveCurrentCart(params: { tenantId: string; customerId?: string; guestToken?: string }): Promise<CartResponseDto | null> {
    if (params.customerId) {
      const cart = await this.repository.findActiveByCustomer(params.customerId, params.tenantId);
      return cart ? CartMapper.toResponse(cart) : null;
    }
    if (params.guestToken) {
      const hash = CartAppService.hashToken(params.guestToken);
      const cart = await this.repository.findActiveByGuestTokenHash(hash, params.tenantId);
      return cart ? CartMapper.toResponse(cart) : null;
    }
    return null;
  }

  // ── Add Item ──

  async addItem(cartId: string, tenantId: string, command: AddCartItemCommand): Promise<CartResponseDto> {
    const errors = CartValidator.validateAddItem(command);
    if (errors.length > 0) throw new CartException(CART_ERROR_CODES.CART_INVALID_QUANTITY, errors.join('; '));

    const cart = await this.repository.findById(new CartId(cartId), tenantId);
    if (!cart) throw new CartException(CART_ERROR_CODES.CART_NOT_FOUND, 'Cart not found');

    const now = this.clock.now();
    const sku = await this.ensureVariantActive(command.productVariantId, tenantId);
    const qty = Quantity.create(command.quantity);
    await this.ensureStock(command.productVariantId, tenantId, qty);
    const { amount } = await this.resolvePrice(command.productVariantId, tenantId);

    cart.addItem(command.productVariantId, sku, qty, amount, now);
    await this.repository.save(cart);

    this.logger.info({ event: 'cart.item.added', cartId, tenantId, sku, quantity: command.quantity }, 'Item added to cart');
    return CartMapper.toResponse(cart);
  }

  // ── Update Item Quantity ──

  async updateItemQuantity(cartId: string, tenantId: string, command: UpdateCartItemQuantityCommand): Promise<CartResponseDto> {
    const errors = CartValidator.validateUpdateQuantity(command);
    if (errors.length > 0) throw new CartException(CART_ERROR_CODES.CART_INVALID_QUANTITY, errors.join('; '));

    const cart = await this.repository.findById(new CartId(cartId), tenantId);
    if (!cart) throw new CartException(CART_ERROR_CODES.CART_NOT_FOUND, 'Cart not found');

    const now = this.clock.now();
    const qty = Quantity.create(command.quantity);
    await this.ensureStock(command.productVariantId, tenantId, qty);
    const { amount } = await this.resolvePrice(command.productVariantId, tenantId);

    cart.updateItemQuantity(command.productVariantId, qty, amount, now);
    await this.repository.save(cart);

    this.logger.info({ event: 'cart.item.updated', cartId, tenantId, productVariantId: command.productVariantId, quantity: command.quantity }, 'Cart item quantity updated');
    return CartMapper.toResponse(cart);
  }

  // ── Remove Item ──

  async removeItem(cartId: string, tenantId: string, command: RemoveCartItemCommand): Promise<CartResponseDto> {
    const cart = await this.repository.findById(new CartId(cartId), tenantId);
    if (!cart) throw new CartException(CART_ERROR_CODES.CART_NOT_FOUND, 'Cart not found');

    const now = this.clock.now();
    cart.removeItem(command.productVariantId, now);
    await this.repository.save(cart);

    this.logger.info({ event: 'cart.item.removed', cartId, tenantId, productVariantId: command.productVariantId }, 'Item removed from cart');
    return CartMapper.toResponse(cart);
  }

  // ── Clear Cart ──

  async clearCart(cartId: string, tenantId: string): Promise<CartResponseDto> {
    const cart = await this.repository.findById(new CartId(cartId), tenantId);
    if (!cart) throw new CartException(CART_ERROR_CODES.CART_NOT_FOUND, 'Cart not found');

    const now = this.clock.now();
    cart.clear(now);
    await this.repository.save(cart);

    this.logger.info({ event: 'cart.cleared', cartId, tenantId }, 'Cart cleared');
    return CartMapper.toResponse(cart);
  }

  // ── Recalculate Cart ──

  async recalculateCart(cartId: string, tenantId: string): Promise<CartResponseDto> {
    const cart = await this.repository.findById(new CartId(cartId), tenantId);
    if (!cart) throw new CartException(CART_ERROR_CODES.CART_NOT_FOUND, 'Cart not found');

    const now = this.clock.now();
    const priceEntries = await Promise.all(
      cart.getItems().map(async item => {
        const { amount } = await this.resolvePrice(item.getProductVariantId(), tenantId);
        return [item.getProductVariantId(), amount] as const;
      }),
    );
    const priceMap = new Map(priceEntries);

    cart.recalculate(priceMap, now);
    await this.repository.save(cart);

    this.logger.info({ event: 'cart.recalculated', cartId, tenantId }, 'Cart recalculated');
    return CartMapper.toResponse(cart);
  }

  // ── Merge Guest Cart into Customer Cart ──

  async mergeCart(tenantId: string, customerId: string, command: MergeCartCommand): Promise<CartResponseDto> {
    const sourceCart = await this.repository.findActiveByGuestTokenHash(command.sourceGuestTokenHash, tenantId);
    if (!sourceCart) throw new CartException(CART_ERROR_CODES.CART_NOT_FOUND, 'Source guest cart not found');

    let targetCart = await this.repository.findActiveByCustomer(customerId, tenantId);
    if (!targetCart) {
      targetCart = Cart.createCustomer({ tenantId, customerId, expiresAt: this.getDefaultExpiresAt() });
    }

    const now = this.clock.now();
    const allVariants = [...new Set([
      ...targetCart.getItems().map(i => i.getProductVariantId()),
      ...sourceCart.getItems().map(i => i.getProductVariantId()),
    ])];

    const priceEntries = await Promise.all(
      allVariants.map(async (pvId) => {
        const { amount } = await this.resolvePrice(pvId, tenantId);
        return [pvId, amount] as const;
      }),
    );
    const priceMap = new Map(priceEntries);

    for (const item of sourceCart.getItems()) {
      const qty = item.getQuantity();
      await this.ensureStock(item.getProductVariantId(), tenantId, qty);
    }

    targetCart.mergeFrom(sourceCart, priceMap, now);
    sourceCart.markConverted(now);

    await this.repository.save(sourceCart);
    await this.repository.save(targetCart);

    this.logger.info({ event: 'cart.merged', sourceCartId: sourceCart.getId().toString(), targetCartId: targetCart.getId().toString(), tenantId, customerId }, 'Carts merged');
    return CartMapper.toResponse(targetCart);
  }

  // ── Cancel Cart ──

  async cancelCart(cartId: string, tenantId: string): Promise<CartResponseDto> {
    const cart = await this.repository.findById(new CartId(cartId), tenantId);
    if (!cart) throw new CartException(CART_ERROR_CODES.CART_NOT_FOUND, 'Cart not found');

    const now = this.clock.now();
    cart.cancel(now);
    await this.repository.save(cart);

    this.logger.info({ event: 'cart.cancelled', cartId, tenantId }, 'Cart cancelled');
    return CartMapper.toResponse(cart);
  }

  // ── Expire Carts ──

  async expireCarts(tenantId: string): Promise<number> {
    const now = this.clock.now();
    const expired = await this.repository.listExpired(tenantId, now);
    for (const cart of expired) {
      cart.markExpired(now);
      await this.repository.save(cart);
    }
    this.logger.info({ event: 'cart.expire.batch', tenantId, count: expired.length }, 'Expired carts processed');
    return expired.length;
  }
}
