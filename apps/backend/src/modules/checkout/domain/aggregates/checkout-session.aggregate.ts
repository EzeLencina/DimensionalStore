import { CheckoutId, CheckoutStatus, type CheckoutStatusValue, Address, type AddressPrimitives } from '../value-objects';
import { CheckoutException, CHECKOUT_ERROR_CODES } from '../exceptions';

export type CheckoutSessionPrimitives = {
  id: string; tenantId: string; cartId: string;
  customerId: string | null; guestEmail: string | null;
  status: string; currency: string;
  subtotal: number; shippingAmount: number; discountAmount: number; taxAmount: number; total: number;
  shippingMethodCode: string | null; paymentMethodCode: string | null;
  expiresAt: Date; idempotencyKey: string | null; version: number;
  createdAt: Date; updatedAt: Date;
  address: AddressPrimitives | null;
};

type StartCheckoutParams = {
  tenantId: string; cartId: string; customerId?: string | null; guestEmail?: string | null;
  currency?: string; subtotal: number; expiresAt: Date;
};

export class CheckoutSession {
  private id!: CheckoutId;
  private tenantId!: string;
  private cartId!: string;
  private customerId!: string | null;
  private guestEmail!: string | null;
  private status!: CheckoutStatus;
  private currency!: string;
  private subtotal!: number;
  private shippingAmount!: number;
  private discountAmount!: number;
  private taxAmount!: number;
  private total!: number;
  private shippingMethodCode!: string | null;
  private paymentMethodCode!: string | null;
  private address!: Address | null;
  private expiresAt!: Date;
  private idempotencyKey!: string | null;
  private version!: number;
  private createdAt!: Date;
  private updatedAt!: Date;

  private constructor() {}

  static start(params: StartCheckoutParams): CheckoutSession {
    const cs = new CheckoutSession();
    cs.id = new CheckoutId(); cs.tenantId = params.tenantId; cs.cartId = params.cartId;
    cs.customerId = params.customerId ?? null; cs.guestEmail = params.guestEmail ?? null;
    cs.status = CheckoutStatus.OPEN(); cs.currency = params.currency ?? 'ARS';
    cs.subtotal = params.subtotal; cs.shippingAmount = 0; cs.discountAmount = 0; cs.taxAmount = 0;
    cs.total = params.subtotal; cs.shippingMethodCode = null; cs.paymentMethodCode = null;
    cs.address = null; cs.expiresAt = params.expiresAt; cs.idempotencyKey = null;
    cs.version = 1; cs.createdAt = new Date(); cs.updatedAt = new Date();
    return cs;
  }

  static fromPrimitives(p: CheckoutSessionPrimitives): CheckoutSession {
    const cs = new CheckoutSession();
    cs.id = new CheckoutId(p.id); cs.tenantId = p.tenantId; cs.cartId = p.cartId;
    cs.customerId = p.customerId; cs.guestEmail = p.guestEmail;
    cs.status = CheckoutStatus.create(p.status); cs.currency = p.currency;
    cs.subtotal = p.subtotal; cs.shippingAmount = p.shippingAmount; cs.discountAmount = p.discountAmount;
    cs.taxAmount = p.taxAmount; cs.total = p.total;
    cs.shippingMethodCode = p.shippingMethodCode; cs.paymentMethodCode = p.paymentMethodCode;
    cs.address = p.address ? Address.create(p.address) : null;
    cs.expiresAt = p.expiresAt; cs.idempotencyKey = p.idempotencyKey; cs.version = p.version;
    cs.createdAt = p.createdAt; cs.updatedAt = p.updatedAt;
    return cs;
  }

  toPrimitives(): CheckoutSessionPrimitives {
    return {
      id: this.id.toString(), tenantId: this.tenantId, cartId: this.cartId,
      customerId: this.customerId, guestEmail: this.guestEmail,
      status: this.status.toString(), currency: this.currency,
      subtotal: this.subtotal, shippingAmount: this.shippingAmount,
      discountAmount: this.discountAmount, taxAmount: this.taxAmount, total: this.total,
      shippingMethodCode: this.shippingMethodCode, paymentMethodCode: this.paymentMethodCode,
      expiresAt: this.expiresAt, idempotencyKey: this.idempotencyKey, version: this.version,
      createdAt: this.createdAt, updatedAt: this.updatedAt,
      address: this.address?.toPrimitives() ?? null,
    };
  }

  getId(): CheckoutId { return this.id; }
  getTenantId(): string { return this.tenantId; }
  getCartId(): string { return this.cartId; }
  getCustomerId(): string | null { return this.customerId; }
  getGuestEmail(): string | null { return this.guestEmail; }
  getStatus(): CheckoutStatus { return this.status; }
  getCurrency(): string { return this.currency; }
  getSubtotal(): number { return this.subtotal; }
  getTotal(): number { return this.total; }
  getShippingAmount(): number { return this.shippingAmount; }
  getDiscountAmount(): number { return this.discountAmount; }
  getTaxAmount(): number { return this.taxAmount; }
  getShippingMethodCode(): string | null { return this.shippingMethodCode; }
  getPaymentMethodCode(): string | null { return this.paymentMethodCode; }
  getAddress(): Address | null { return this.address; }
  getExpiresAt(): Date { return this.expiresAt; }
  getIdempotencyKey(): string | null { return this.idempotencyKey; }
  getVersion(): number { return this.version; }

  isExpired(now: Date): boolean { return now > this.expiresAt; }
  isModifiable(): boolean { return this.status.isModifiable(); }
  isCompleted(): boolean { return this.status.getValue() === 'COMPLETED'; }

  assertModifiable(now: Date): void {
    if (!this.status.isModifiable()) throw new CheckoutException(CHECKOUT_ERROR_CODES.CHECKOUT_NOT_ACTIVE, `Checkout is ${this.status}`);
    if (this.isExpired(now)) throw new CheckoutException(CHECKOUT_ERROR_CODES.CHECKOUT_EXPIRED, 'Checkout has expired');
  }

  setAddress(address: Address): void { this.address = address; this.touch(); }
  selectShippingMethod(code: string): void { this.shippingMethodCode = code; this.touch(); }
  selectPaymentMethod(code: string): void { this.paymentMethodCode = code; this.touch(); }

  setTotals(shipping: number, discount: number, tax: number): void {
    this.shippingAmount = Math.max(0, shipping);
    this.discountAmount = Math.max(0, discount);
    this.taxAmount = Math.max(0, tax);
    this.total = this.subtotal + shipping + tax - discount;
    if (this.total < 0) this.total = 0;
    this.touch();
  }

  setStatus(target: CheckoutStatusValue, now: Date): void {
    if (!this.status.canTransitionTo(target)) throw new CheckoutException(CHECKOUT_ERROR_CODES.CHECKOUT_NOT_ACTIVE, `Cannot transition from ${this.status} to ${target}`);
    this.status = CheckoutStatus.create(target);
    this.updatedAt = now;
    this.version++;
  }

  setIdempotencyKey(key: string | null): void { this.idempotencyKey = key; this.touch(); }
  markExpired(now: Date): void { if (this.status.isModifiable()) { this.status = CheckoutStatus.EXPIRED(); this.updatedAt = now; this.version++; } }

  private touch(): void { this.updatedAt = new Date(); this.version++; }
}
