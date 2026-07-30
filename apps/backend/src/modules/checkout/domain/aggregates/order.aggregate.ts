import { OrderId, OrderStatus, type OrderStatusValue } from '../value-objects';
import { OrderItem, type OrderItemPrimitives } from './order-item';
import { CheckoutException, CHECKOUT_ERROR_CODES } from '../exceptions';

export type OrderPrimitives = {
  id: string; tenantId: string; orderNumber: string;
  cartId: string; checkoutSessionId: string;
  customerId: string | null; guestEmail: string | null;
  status: string; currency: string;
  subtotal: number; shippingAmount: number; discountAmount: number; taxAmount: number; total: number;
  shippingMethodCode: string | null; paymentMethodCode: string | null;
  paymentStatus: string | null; fulfillmentStatus: string | null;
  cancellationReason: string | null;
  cancelledAt: Date | null; confirmedAt: Date | null;
  processingStartedAt: Date | null; readyAt: Date | null;
  shippedAt: Date | null; deliveredAt: Date | null; expiredAt: Date | null;
  carrierCode: string | null; trackingNumber: string | null; trackingUrl: string | null;
  version: number; createdAt: Date; updatedAt: Date;
  items: OrderItemPrimitives[];
};

type CreateOrderParams = {
  tenantId: string; orderNumber: string; cartId: string; checkoutSessionId: string;
  customerId?: string | null; guestEmail?: string | null;
  currency: string; subtotal: number; shippingAmount: number; discountAmount: number; taxAmount: number; total: number;
  shippingMethodCode?: string | null; paymentMethodCode?: string | null;
  items: Array<{ productVariantId: string; sku: string; productName: string; variantName: string | null; quantity: number; unitPrice: number }>;
};

export class Order {
  private id!: OrderId;
  private tenantId!: string;
  private orderNumber!: string;
  private cartId!: string;
  private checkoutSessionId!: string;
  private customerId!: string | null;
  private guestEmail!: string | null;
  private status!: OrderStatus;
  private previousStatus: string | null = null;
  private currency!: string;
  private subtotal!: number;
  private shippingAmount!: number;
  private discountAmount!: number;
  private taxAmount!: number;
  private total!: number;
  private shippingMethodCode!: string | null;
  private paymentMethodCode!: string | null;
  private paymentStatus: string | null = null;
  private fulfillmentStatus: string | null = null;
  private cancellationReason: string | null = null;
  private cancelledAt: Date | null = null;
  private confirmedAt: Date | null = null;
  private processingStartedAt: Date | null = null;
  private readyAt: Date | null = null;
  private shippedAt: Date | null = null;
  private deliveredAt: Date | null = null;
  private expiredAt: Date | null = null;
  private carrierCode: string | null = null;
  private trackingNumber: string | null = null;
  private trackingUrl: string | null = null;
  private items!: OrderItem[];
  private version!: number;
  private createdAt!: Date;
  private updatedAt!: Date;

  private constructor() {}

  static create(params: CreateOrderParams): Order {
    const order = new Order();
    order.id = new OrderId(); order.tenantId = params.tenantId;
    order.orderNumber = params.orderNumber; order.cartId = params.cartId;
    order.checkoutSessionId = params.checkoutSessionId;
    order.customerId = params.customerId ?? null; order.guestEmail = params.guestEmail ?? null;
    order.status = OrderStatus.PENDING_PAYMENT(); order.currency = params.currency;
    order.subtotal = params.subtotal; order.shippingAmount = params.shippingAmount;
    order.discountAmount = params.discountAmount; order.taxAmount = params.taxAmount;
    order.total = params.total;
    order.shippingMethodCode = params.shippingMethodCode ?? null;
    order.paymentMethodCode = params.paymentMethodCode ?? null;
    order.version = 1; order.createdAt = new Date(); order.updatedAt = new Date();
    order.items = params.items.map(i => OrderItem.create(order.id.toString(), i.productVariantId, i.sku, i.productName, i.variantName, i.quantity, i.unitPrice));
    return order;
  }

  static fromPrimitives(p: OrderPrimitives): Order {
    const order = new Order();
    order.id = new OrderId(p.id); order.tenantId = p.tenantId; order.orderNumber = p.orderNumber;
    order.cartId = p.cartId; order.checkoutSessionId = p.checkoutSessionId;
    order.customerId = p.customerId; order.guestEmail = p.guestEmail;
    order.status = OrderStatus.create(p.status); order.currency = p.currency;
    order.subtotal = p.subtotal; order.shippingAmount = p.shippingAmount;
    order.discountAmount = p.discountAmount; order.taxAmount = p.taxAmount; order.total = p.total;
    order.shippingMethodCode = p.shippingMethodCode; order.paymentMethodCode = p.paymentMethodCode;
    order.paymentStatus = p.paymentStatus; order.fulfillmentStatus = p.fulfillmentStatus;
    order.cancellationReason = p.cancellationReason;
    order.cancelledAt = p.cancelledAt; order.confirmedAt = p.confirmedAt;
    order.processingStartedAt = p.processingStartedAt; order.readyAt = p.readyAt;
    order.shippedAt = p.shippedAt; order.deliveredAt = p.deliveredAt; order.expiredAt = p.expiredAt;
    order.carrierCode = p.carrierCode; order.trackingNumber = p.trackingNumber; order.trackingUrl = p.trackingUrl;
    order.version = p.version; order.createdAt = p.createdAt; order.updatedAt = p.updatedAt;
    order.items = p.items.map(i => OrderItem.fromPrimitives(i));
    return order;
  }

  toPrimitives(): OrderPrimitives {
    return {
      id: this.id.toString(), tenantId: this.tenantId, orderNumber: this.orderNumber,
      cartId: this.cartId, checkoutSessionId: this.checkoutSessionId,
      customerId: this.customerId, guestEmail: this.guestEmail,
      status: this.status.toString(), currency: this.currency,
      subtotal: this.subtotal, shippingAmount: this.shippingAmount,
      discountAmount: this.discountAmount, taxAmount: this.taxAmount, total: this.total,
      shippingMethodCode: this.shippingMethodCode, paymentMethodCode: this.paymentMethodCode,
      paymentStatus: this.paymentStatus, fulfillmentStatus: this.fulfillmentStatus,
      cancellationReason: this.cancellationReason,
      cancelledAt: this.cancelledAt, confirmedAt: this.confirmedAt,
      processingStartedAt: this.processingStartedAt, readyAt: this.readyAt,
      shippedAt: this.shippedAt, deliveredAt: this.deliveredAt, expiredAt: this.expiredAt,
      carrierCode: this.carrierCode, trackingNumber: this.trackingNumber, trackingUrl: this.trackingUrl,
      version: this.version, createdAt: this.createdAt, updatedAt: this.updatedAt,
      items: this.items.map(i => i.toPrimitives()),
    };
  }

  getId(): OrderId { return this.id; }
  getTenantId(): string { return this.tenantId; }
  getOrderNumber(): string { return this.orderNumber; }
  getCartId(): string { return this.cartId; }
  getCheckoutSessionId(): string { return this.checkoutSessionId; }
  getCustomerId(): string | null { return this.customerId; }
  getGuestEmail(): string | null { return this.guestEmail; }
  getStatus(): OrderStatus { return this.status; }
  getCurrency(): string { return this.currency; }
  getSubtotal(): number { return this.subtotal; }
  getShippingAmount(): number { return this.shippingAmount; }
  getDiscountAmount(): number { return this.discountAmount; }
  getTaxAmount(): number { return this.taxAmount; }
  getTotal(): number { return this.total; }
  getShippingMethodCode(): string | null { return this.shippingMethodCode; }
  getPaymentMethodCode(): string | null { return this.paymentMethodCode; }
  getVersion(): number { return this.version; }
  getItems(): OrderItem[] { return [...this.items]; }
  getCancellationReason(): string | null { return this.cancellationReason; }
  getCancelledAt(): Date | null { return this.cancelledAt; }
  getConfirmedAt(): Date | null { return this.confirmedAt; }
  getShippedAt(): Date | null { return this.shippedAt; }
  getDeliveredAt(): Date | null { return this.deliveredAt; }
  getPreviousStatus(): string | null { return this.previousStatus; }
  getCarrierCode(): string | null { return this.carrierCode; }
  getTrackingNumber(): string | null { return this.trackingNumber; }
  getTrackingUrl(): string | null { return this.trackingUrl; }

  private transition(target: OrderStatusValue, now: Date): void {
    if (!this.status.canTransitionTo(target)) {
      throw new CheckoutException(CHECKOUT_ERROR_CODES.CHECKOUT_NOT_ACTIVE,
        `Cannot transition from ${this.status} to ${target}`);
    }
    this.previousStatus = this.status.toString();
    this.status = OrderStatus.create(target);
    this.updatedAt = now;
    this.version++;
  }

  get statusHistoryEntry(): { fromStatus: string | null; toStatus: string } {
    return { fromStatus: null, toStatus: this.status.toString() };
  }

  confirmPayment(now: Date): void {
    this.transition('PAYMENT_CONFIRMED', now);
    this.paymentStatus = 'CONFIRMED';
    this.confirmedAt = now;
  }

  failPayment(now: Date): void {
    this.transition('PAYMENT_FAILED', now);
    this.paymentStatus = 'FAILED';
  }

  retryPayment(now: Date): void {
    this.transition('PENDING_PAYMENT', now);
    this.paymentStatus = null;
  }

  startProcessing(now: Date): void {
    this.transition('PROCESSING', now);
    this.fulfillmentStatus = 'PROCESSING';
    this.processingStartedAt = now;
  }

  markReady(now: Date): void {
    this.transition('READY_FOR_PICKUP', now);
    this.fulfillmentStatus = 'READY';
    this.readyAt = now;
  }

  markShipped(now: Date, carrierCode?: string, trackingNumber?: string, trackingUrl?: string): void {
    this.transition('SHIPPED', now);
    this.fulfillmentStatus = 'SHIPPED';
    this.shippedAt = now;
    this.carrierCode = carrierCode ?? null;
    this.trackingNumber = trackingNumber ?? null;
    this.trackingUrl = trackingUrl ?? null;
  }

  markDelivered(now: Date): void {
    this.transition('DELIVERED', now);
    this.fulfillmentStatus = 'DELIVERED';
    this.deliveredAt = now;
  }

  cancel(now: Date, reason?: string): void {
    if (this.status.isTerminal()) {
      throw new CheckoutException(CHECKOUT_ERROR_CODES.CHECKOUT_NOT_ACTIVE,
        `Cannot cancel order in terminal status ${this.status}`);
    }
    if (!this.status.canTransitionTo('CANCELLED')) {
      throw new CheckoutException(CHECKOUT_ERROR_CODES.CHECKOUT_NOT_ACTIVE,
        `Order cannot be cancelled in status ${this.status}`);
    }
    this.transition('CANCELLED', now);
    this.cancellationReason = reason ?? null;
    this.cancelledAt = now;
  }

  expire(now: Date): void {
    this.transition('EXPIRED', now);
    this.expiredAt = now;
  }
}
