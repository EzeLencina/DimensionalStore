import { Injectable, Inject } from '@nestjs/common';
import { LOGGER_TOKEN } from '@tienda/logger/nest';
import { CheckoutSession, CheckoutId, Order, Address, IdempotencyKey, CheckoutException, CHECKOUT_ERROR_CODES } from '../domain';
import { CheckoutValidator } from '../application/validators';
import { CheckoutMapper } from '../application/mappers';
import { CHECKOUT_REPOSITORY, ORDER_REPOSITORY, IDEMPOTENCY_REPOSITORY } from '../domain/repository';
import type { CheckoutRepository, OrderRepository, IdempotencyRepository } from '../domain/repository';
import type { CartReader, PricingResolver, InventoryReservationService, ProductVariantReader, CustomerReader, ShippingMethodReader, PaymentMethodReader, OrderNumberGenerator, Clock } from '../domain/ports';
import type { CheckoutSessionResponseDto, OrderResponseDto } from '../application/dto';
import { StartCheckoutCommand, UpdateAddressCommand, SelectShippingMethodCommand, SelectPaymentMethodCommand, ConfirmCheckoutCommand } from '../application/commands';

export const CHECKOUT_DEFAULT_EXPIRATION_MINUTES = 30;

@Injectable()
export class CheckoutAppService {
  constructor(
    @Inject(CHECKOUT_REPOSITORY) private readonly checkoutRepo: CheckoutRepository,
    @Inject(ORDER_REPOSITORY) private readonly orderRepo: OrderRepository,
    @Inject(IDEMPOTENCY_REPOSITORY) private readonly idempotencyRepo: IdempotencyRepository,
    @Inject('CART_READER') private readonly cartReader: CartReader,
    @Inject('PRICING_RESOLVER') private readonly pricingResolver: PricingResolver,
    @Inject('INVENTORY_RESERVATION_SERVICE') private readonly inventoryService: InventoryReservationService,
    @Inject('PRODUCT_VARIANT_READER') private readonly variantReader: ProductVariantReader,
    @Inject('CUSTOMER_READER') private readonly customerReader: CustomerReader,
    @Inject('SHIPPING_METHOD_READER') private readonly shippingReader: ShippingMethodReader,
    @Inject('PAYMENT_METHOD_READER') private readonly paymentReader: PaymentMethodReader,
    @Inject('ORDER_NUMBER_GENERATOR') private readonly orderNumberGen: OrderNumberGenerator,
    @Inject('CLOCK') private readonly clock: Clock,
    @Inject(LOGGER_TOKEN) private readonly logger: any,
  ) {}

  private getDefaultExpiresAt(): Date {
    return new Date(this.clock.now().getTime() + CHECKOUT_DEFAULT_EXPIRATION_MINUTES * 60 * 1000);
  }

  // ── Start Checkout ──

  async startCheckout(command: StartCheckoutCommand): Promise<CheckoutSessionResponseDto> {
    const errors = CheckoutValidator.validateStart(command);
    if (errors.length > 0) throw new CheckoutException(CHECKOUT_ERROR_CODES.CHECKOUT_INVALID_CART, errors.join('; '));

    const cart = await this.cartReader.getCart(command.cartId, command.tenantId);
    if (!cart) throw new CheckoutException(CHECKOUT_ERROR_CODES.CHECKOUT_INVALID_CART, 'Cart not found');
    if (cart.status !== 'ACTIVE') throw new CheckoutException(CHECKOUT_ERROR_CODES.CHECKOUT_INVALID_CART, `Cart is ${cart.status}`);
    if (cart.items.length === 0) throw new CheckoutException(CHECKOUT_ERROR_CODES.CHECKOUT_EMPTY_CART, 'Cart is empty');

    const existing = await this.checkoutRepo.findActiveByCart(command.cartId, command.tenantId);
    if (existing) return CheckoutMapper.toResponse(existing);

    const cs = CheckoutSession.start({
      tenantId: command.tenantId, cartId: command.cartId,
      customerId: cart.customerId, subtotal: cart.items.reduce((s, i) => s + i.unitPriceSnapshot * i.quantity, 0),
      expiresAt: this.getDefaultExpiresAt(),
    });

    await this.checkoutRepo.save(cs);
    this.logger.info({ event: 'checkout.started', checkoutId: cs.getId().toString(), cartId: command.cartId }, 'Checkout started');
    return CheckoutMapper.toResponse(cs);
  }

  // ── Get Checkout Session ──

  async getCheckoutSession(checkoutId: string, tenantId: string): Promise<CheckoutSessionResponseDto> {
    const cs = await this.checkoutRepo.findById(new CheckoutId(checkoutId), tenantId);
    if (!cs) throw new CheckoutException(CHECKOUT_ERROR_CODES.CHECKOUT_NOT_FOUND, 'Checkout not found');
    return CheckoutMapper.toResponse(cs);
  }

  // ── Update Address ──

  async updateAddress(checkoutId: string, tenantId: string, command: UpdateAddressCommand): Promise<CheckoutSessionResponseDto> {
    const errors = CheckoutValidator.validateAddress(command);
    if (errors.length > 0) throw new CheckoutException(CHECKOUT_ERROR_CODES.CHECKOUT_INVALID_ADDRESS, errors.join('; '));

    const cs = await this.checkoutRepo.findById(new CheckoutId(checkoutId), tenantId);
    if (!cs) throw new CheckoutException(CHECKOUT_ERROR_CODES.CHECKOUT_NOT_FOUND, 'Checkout not found');
    cs.assertModifiable(this.clock.now());

    const address = Address.create(command);
    cs.setAddress(address);
    await this.checkoutRepo.save(cs);
    return CheckoutMapper.toResponse(cs);
  }

  // ── Select Shipping Method ──

  async selectShippingMethod(checkoutId: string, tenantId: string, command: SelectShippingMethodCommand): Promise<CheckoutSessionResponseDto> {
    const cs = await this.checkoutRepo.findById(new CheckoutId(checkoutId), tenantId);
    if (!cs) throw new CheckoutException(CHECKOUT_ERROR_CODES.CHECKOUT_NOT_FOUND, 'Checkout not found');
    cs.assertModifiable(this.clock.now());

    const valid = await this.shippingReader.isValid(command.code, tenantId);
    if (!valid) throw new CheckoutException(CHECKOUT_ERROR_CODES.CHECKOUT_SHIPPING_METHOD_INVALID, `Invalid shipping method: ${command.code}`);

    const amount = await this.shippingReader.getAmount(command.code, tenantId);
    cs.selectShippingMethod(command.code);
    cs.setTotals(amount, cs.getDiscountAmount(), cs.getTaxAmount());
    await this.checkoutRepo.save(cs);
    return CheckoutMapper.toResponse(cs);
  }

  // ── Select Payment Method ──

  async selectPaymentMethod(checkoutId: string, tenantId: string, command: SelectPaymentMethodCommand): Promise<CheckoutSessionResponseDto> {
    const cs = await this.checkoutRepo.findById(new CheckoutId(checkoutId), tenantId);
    if (!cs) throw new CheckoutException(CHECKOUT_ERROR_CODES.CHECKOUT_NOT_FOUND, 'Checkout not found');
    cs.assertModifiable(this.clock.now());

    const valid = await this.paymentReader.isValid(command.code, tenantId);
    if (!valid) throw new CheckoutException(CHECKOUT_ERROR_CODES.CHECKOUT_PAYMENT_METHOD_INVALID, `Invalid payment method: ${command.code}`);

    cs.selectPaymentMethod(command.code);
    await this.checkoutRepo.save(cs);
    return CheckoutMapper.toResponse(cs);
  }

  // ── Validate Checkout (pre-confirm checks) ──

  async validateCheckout(checkoutId: string, tenantId: string): Promise<CheckoutSessionResponseDto> {
    const cs = await this.checkoutRepo.findById(new CheckoutId(checkoutId), tenantId);
    if (!cs) throw new CheckoutException(CHECKOUT_ERROR_CODES.CHECKOUT_NOT_FOUND, 'Checkout not found');
    const now = this.clock.now();
    cs.assertModifiable(now);

    if (!cs.getAddress()) throw new CheckoutException(CHECKOUT_ERROR_CODES.CHECKOUT_NO_ADDRESS, 'Shipping address is required');
    if (!cs.getShippingMethodCode()) throw new CheckoutException(CHECKOUT_ERROR_CODES.CHECKOUT_NO_SHIPPING, 'Shipping method is required');
    if (!cs.getPaymentMethodCode()) throw new CheckoutException(CHECKOUT_ERROR_CODES.CHECKOUT_NO_PAYMENT, 'Payment method is required');

    const cart = await this.cartReader.getCart(cs.getCartId(), tenantId);
    if (!cart || cart.status !== 'ACTIVE') throw new CheckoutException(CHECKOUT_ERROR_CODES.CHECKOUT_INVALID_CART, 'Cart is not active');

    for (const item of cart.items) {
      const { amount } = await this.pricingResolver.resolveEffectivePrice(item.productVariantId, tenantId);
      if (amount !== item.unitPriceSnapshot) throw new CheckoutException(CHECKOUT_ERROR_CODES.CHECKOUT_PRICE_CHANGED, `Price changed for ${item.sku}`);
    }

    cs.setStatus('VALIDATING', now);
    await this.checkoutRepo.save(cs);
    return CheckoutMapper.toResponse(cs);
  }

  // ── Confirm Checkout (transactional, idempotent) ──

  async confirmCheckout(checkoutId: string, tenantId: string, command: ConfirmCheckoutCommand): Promise<OrderResponseDto> {
    if (!command.idempotencyKey?.trim()) throw new CheckoutException(CHECKOUT_ERROR_CODES.IDEMPOTENCY_KEY_REQUIRED, 'Idempotency-Key is required');

    const existingRecord = await this.idempotencyRepo.find(command.idempotencyKey, 'confirm', tenantId);
    if (existingRecord) {
      const existingOrder = await this.orderRepo.findByCheckoutSession(checkoutId, tenantId);
      if (existingOrder) return CheckoutMapper.orderToResponse(existingOrder);
    }

    const cs = await this.checkoutRepo.findById(new CheckoutId(checkoutId), tenantId);
    if (!cs) throw new CheckoutException(CHECKOUT_ERROR_CODES.CHECKOUT_NOT_FOUND, 'Checkout not found');
    if (cs.isCompleted()) {
      const order = await this.orderRepo.findByCheckoutSession(checkoutId, tenantId);
      if (order) return CheckoutMapper.orderToResponse(order);
      throw new CheckoutException(CHECKOUT_ERROR_CODES.CHECKOUT_ALREADY_COMPLETED, 'Checkout already completed');
    }

    const now = this.clock.now();
    cs.assertModifiable(now);
    if (!cs.getAddress()) throw new CheckoutException(CHECKOUT_ERROR_CODES.CHECKOUT_NO_ADDRESS, 'Shipping address is required');
    if (!cs.getShippingMethodCode()) throw new CheckoutException(CHECKOUT_ERROR_CODES.CHECKOUT_NO_SHIPPING, 'Shipping method is required');
    if (!cs.getPaymentMethodCode()) throw new CheckoutException(CHECKOUT_ERROR_CODES.CHECKOUT_NO_PAYMENT, 'Payment method is required');

    cs.setStatus('VALIDATING', now);
    const cart = await this.cartReader.getCart(cs.getCartId(), tenantId);
    if (!cart || cart.status !== 'ACTIVE') throw new CheckoutException(CHECKOUT_ERROR_CODES.CHECKOUT_INVALID_CART, 'Cart is not active');

    const priceMap = new Map<string, number>();
    const variantInfo = new Map<string, { sku: string; productName: string; variantName: string | null }>();

    for (const item of cart.items) {
      const { amount } = await this.pricingResolver.resolveEffectivePrice(item.productVariantId, tenantId);
      if (amount !== item.unitPriceSnapshot) throw new CheckoutException(CHECKOUT_ERROR_CODES.CHECKOUT_PRICE_CHANGED, `Price changed for ${item.sku}`);
      priceMap.set(item.productVariantId, amount);
      const info = await this.variantReader.getVariantName(item.productVariantId, tenantId);
      variantInfo.set(item.productVariantId, info);
    }

    cs.setStatus('READY', now);

    for (const item of cart.items) {
      await this.inventoryService.reserve(item.productVariantId, tenantId, item.quantity, cs.getId().toString());
    }

    const orderNumber = await this.orderNumberGen.generate(tenantId);

    const order = Order.create({
      tenantId, orderNumber,
      cartId: cs.getCartId(), checkoutSessionId: cs.getId().toString(),
      customerId: cs.getCustomerId(),
      currency: cs.getCurrency(), subtotal: cs.getSubtotal(),
      shippingAmount: cs.getShippingAmount(), discountAmount: cs.getDiscountAmount(),
      taxAmount: cs.getTaxAmount(), total: cs.getTotal(),
      shippingMethodCode: cs.getShippingMethodCode(), paymentMethodCode: cs.getPaymentMethodCode(),
      items: cart.items.map(item => {
        const info = variantInfo.get(item.productVariantId)!;
        return {
          productVariantId: item.productVariantId, sku: info.sku,
          productName: info.productName, variantName: info.variantName,
          quantity: item.quantity, unitPrice: priceMap.get(item.productVariantId)!,
        };
      }),
    });

    cs.setStatus('COMPLETED', now);
    cs.setIdempotencyKey(command.idempotencyKey);

    await this.idempotencyRepo.save({
      tenantId, key: command.idempotencyKey, operation: 'confirm',
      payloadHash: new IdempotencyKey(command.idempotencyKey, checkoutId).getPayloadHash(),
      response: { orderId: order.getId().toString(), orderNumber },
    });

    await this.checkoutRepo.save(cs);
    await this.orderRepo.save(order);

    this.logger.info({
      event: 'checkout.confirmed', checkoutId, orderId: order.getId().toString(),
      orderNumber, tenantId, total: order.getTotal(),
    }, 'Checkout confirmed and order created');

    return CheckoutMapper.orderToResponse(order);
  }

  // ── Cancel Checkout ──

  async cancelCheckout(checkoutId: string, tenantId: string): Promise<CheckoutSessionResponseDto> {
    const cs = await this.checkoutRepo.findById(new CheckoutId(checkoutId), tenantId);
    if (!cs) throw new CheckoutException(CHECKOUT_ERROR_CODES.CHECKOUT_NOT_FOUND, 'Checkout not found');
    const now = this.clock.now();
    cs.setStatus('CANCELLED', now);
    await this.checkoutRepo.save(cs);
    this.logger.info({ event: 'checkout.cancelled', checkoutId, tenantId }, 'Checkout cancelled');
    return CheckoutMapper.toResponse(cs);
  }

  // ── Expire Checkouts ──

  async expireCheckouts(tenantId: string): Promise<number> {
    const now = this.clock.now();
    const expired = await this.checkoutRepo.listExpired(tenantId, now);
    for (const cs of expired) {
      cs.markExpired(now);
      await this.checkoutRepo.save(cs);
    }
    return expired.length;
  }
}
