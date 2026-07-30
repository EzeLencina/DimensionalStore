import { CartId, CartStatus, GuestCartToken, Quantity, CustomerId, type CartStatusValue } from '../value-objects';
import { CartItem } from './cart-item';
import { CartException, CART_ERROR_CODES } from '../exceptions';
import { CartCreatedEvent, CartItemAddedEvent, CartItemQuantityUpdatedEvent,
  CartItemRemovedEvent, CartClearedEvent, CartConvertedEvent,
  CartCancelledEvent } from '../events';
import type { CartTotals } from '../specifics';

export type CartPrimitives = {
  id: string; tenantId: string; customerId: string | null;
  guestTokenHash: string | null; status: string; currency: string;
  itemsCount: number; subtotal: number; total: number;
  expiresAt: Date; version: number;
  createdAt: Date; updatedAt: Date;
  items: Array<{
    id: string; cartId: string; productVariantId: string;
    sku: string; quantity: number;
    unitPriceSnapshot: number; subtotalSnapshot: number;
    addedAt: Date; updatedAt: Date;
  }>;
};

type CreateGuestCartParams = { tenantId: string; currency?: string; expiresAt: Date };
type CreateCustomerCartParams = { tenantId: string; customerId: string; currency?: string; expiresAt: Date };

export class Cart {
  private id!: CartId;
  private tenantId!: string;
  private customerId!: string | null;
  private guestToken!: GuestCartToken | null;
  private status!: CartStatus;
  private currency!: string;
  private items!: CartItem[];
  private expiresAt!: Date;
  private version!: number;
  private createdAt!: Date;
  private updatedAt!: Date;
  private events: any[] = [];

  private constructor() {}

  static createGuest(params: CreateGuestCartParams): { cart: Cart; rawToken: string } {
    const cart = new Cart();
    cart.id = new CartId();
    cart.tenantId = params.tenantId;
    cart.customerId = null;
    const token = GuestCartToken.generate();
    cart.guestToken = token;
    cart.status = CartStatus.ACTIVE();
    cart.currency = params.currency ?? 'ARS';
    cart.items = [];
    cart.expiresAt = params.expiresAt;
    cart.version = 1;
    cart.createdAt = new Date();
    cart.updatedAt = new Date();
    cart.emit(new CartCreatedEvent(cart.id.toString(), cart.tenantId, 'guest'));
    return { cart, rawToken: token.getRaw() };
  }

  static createCustomer(params: CreateCustomerCartParams): Cart {
    const cart = new Cart();
    cart.id = new CartId();
    cart.tenantId = params.tenantId;
    cart.customerId = params.customerId;
    cart.guestToken = null;
    cart.status = CartStatus.ACTIVE();
    cart.currency = params.currency ?? 'ARS';
    cart.items = [];
    cart.expiresAt = params.expiresAt;
    cart.version = 1;
    cart.createdAt = new Date();
    cart.updatedAt = new Date();
    cart.emit(new CartCreatedEvent(cart.id.toString(), cart.tenantId, 'customer'));
    return cart;
  }

  static fromPrimitives(p: CartPrimitives): Cart {
    const cart = new Cart();
    cart.id = new CartId(p.id);
    cart.tenantId = p.tenantId;
    cart.customerId = p.customerId;
    cart.guestToken = p.guestTokenHash ? GuestCartToken.fromHash(p.guestTokenHash) : null;
    cart.status = CartStatus.create(p.status);
    cart.currency = p.currency;
    cart.items = p.items.map(i => CartItem.fromPrimitives(i));
    cart.expiresAt = p.expiresAt;
    cart.version = p.version;
    cart.createdAt = p.createdAt;
    cart.updatedAt = p.updatedAt;
    return cart;
  }

  toPrimitives(): CartPrimitives {
    return {
      id: this.id.toString(), tenantId: this.tenantId,
      customerId: this.customerId, guestTokenHash: this.guestToken?.getHash() ?? null,
      status: this.status.toString(), currency: this.currency,
      itemsCount: this.items.length, subtotal: this.calcSubtotal(), total: this.calcSubtotal(),
      expiresAt: this.expiresAt, version: this.version,
      createdAt: this.createdAt, updatedAt: this.updatedAt,
      items: this.items.map(i => i.toPrimitives()),
    };
  }

  getId(): CartId { return this.id; }
  getTenantId(): string { return this.tenantId; }
  getCustomerId(): string | null { return this.customerId; }
  getGuestTokenHash(): string | null { return this.guestToken?.getHash() ?? null; }
  getStatus(): CartStatus { return this.status; }
  getCurrency(): string { return this.currency; }
  getItems(): CartItem[] { return [...this.items]; }
  getExpiresAt(): Date { return this.expiresAt; }
  getVersion(): number { return this.version; }
  getEvents(): any[] { return [...this.events]; }
  clearEvents(): void { this.events = []; }

  getTotals(): CartTotals {
    return { itemsCount: this.items.length, subtotal: this.calcSubtotal(), total: this.calcSubtotal() };
  }

  isOwnedByCustomer(customerId: string): boolean { return this.customerId === customerId; }
  isGuest(): boolean { return this.customerId === null && this.guestToken !== null; }
  isExpired(now: Date): boolean { return now > this.expiresAt; }
  isModifiable(): boolean { return this.status.isModifiable(); }

  assertModifiable(now: Date): void {
    if (!this.status.isModifiable()) throw new CartException(CART_ERROR_CODES.CART_NOT_ACTIVE, `Cart is ${this.status}`);
    if (this.isExpired(now)) throw new CartException(CART_ERROR_CODES.CART_EXPIRED, 'Cart has expired');
  }

  hasSku(sku: string): boolean { return this.items.some(i => i.getSku() === sku); }

  findItemByProductVariant(productVariantId: string): CartItem | undefined {
    return this.items.find(i => i.getProductVariantId() === productVariantId);
  }

  addItem(productVariantId: string, sku: string, quantity: Quantity, unitPrice: number, now: Date): void {
    this.assertModifiable(now);
    if (this.items.some(i => i.getProductVariantId() === productVariantId)) {
      const existing = this.items.find(i => i.getProductVariantId() === productVariantId)!;
      const newQty = existing.getQuantity().add(quantity);
      existing.updateQuantity(newQty, unitPrice);
      this.emit(new CartItemQuantityUpdatedEvent(this.id.toString(), this.tenantId, sku, existing.getQuantity().getValue() - quantity.getValue(), newQty.getValue()));
    } else {
      const item = CartItem.create(this.id.toString(), productVariantId, sku, quantity, unitPrice);
      this.items.push(item);
      this.emit(new CartItemAddedEvent(this.id.toString(), this.tenantId, sku, quantity.getValue()));
    }
    this.touch();
  }

  updateItemQuantity(productVariantId: string, quantity: Quantity, unitPrice: number, now: Date): void {
    this.assertModifiable(now);
    const item = this.items.find(i => i.getProductVariantId() === productVariantId);
    if (!item) throw new CartException(CART_ERROR_CODES.CART_ITEM_NOT_FOUND, 'Item not found in cart');
    const prevQty = item.getQuantity().getValue();
    item.updateQuantity(quantity, unitPrice);
    this.emit(new CartItemQuantityUpdatedEvent(this.id.toString(), this.tenantId, item.getSku(), prevQty, quantity.getValue()));
    this.touch();
  }

  removeItem(productVariantId: string, now: Date): void {
    this.assertModifiable(now);
    const idx = this.items.findIndex(i => i.getProductVariantId() === productVariantId);
    if (idx === -1) throw new CartException(CART_ERROR_CODES.CART_ITEM_NOT_FOUND, 'Item not found in cart');
      const removed = this.items[idx]!;
      this.items.splice(idx, 1);
    this.emit(new CartItemRemovedEvent(this.id.toString(), this.tenantId, removed.getSku()));
    this.touch();
  }

  clear(now: Date): void {
    this.assertModifiable(now);
    this.items = [];
    this.emit(new CartClearedEvent(this.id.toString(), this.tenantId));
    this.touch();
  }

  recalculate(priceMap: Map<string, number>, now: Date): void {
    this.assertModifiable(now);
    for (const item of this.items) {
      const resolvedPrice = priceMap.get(item.getProductVariantId());
      if (resolvedPrice === undefined) throw new CartException(CART_ERROR_CODES.CART_PRICE_NOT_AVAILABLE, `Price not available for variant ${item.getProductVariantId()}`);
      item.unitPriceSnapshot = resolvedPrice;
      item.subtotalSnapshot = resolvedPrice * item.getQuantity().getValue();
    }
    this.touch();
  }

  mergeFrom(other: Cart, priceMap: Map<string, number>, now: Date): void {
    this.assertModifiable(now);
    for (const otherItem of other.getItems()) {
      const resolvedPrice = priceMap.get(otherItem.getProductVariantId());
      if (resolvedPrice === undefined) continue;
      const existing = this.findItemByProductVariant(otherItem.getProductVariantId());
      if (existing) {
        const mergedQty = existing.getQuantity().add(otherItem.getQuantity());
        existing.updateQuantity(mergedQty, resolvedPrice);
      } else {
        const newItem = CartItem.create(this.id.toString(), otherItem.getProductVariantId(), otherItem.getSku(), otherItem.getQuantity(), resolvedPrice);
        this.items.push(newItem);
      }
    }
    this.touch();
  }

  assignToCustomer(customerId: string, now: Date): void {
    this.assertModifiable(now);
    this.customerId = customerId;
    this.guestToken = null;
    this.touch();
  }

  markConverted(now: Date): void {
    if (this.status.getValue() !== 'ACTIVE') throw new CartException(CART_ERROR_CODES.CART_NOT_ACTIVE, 'Only active carts can be converted');
    this.status = CartStatus.CONVERTED();
    this.updatedAt = now;
    this.version++;
    this.emit(new CartConvertedEvent(this.id.toString(), this.tenantId));
  }

  markAbandoned(now: Date): void {
    if (this.status.getValue() !== 'ACTIVE') return;
    this.status = CartStatus.ABANDONED();
    this.updatedAt = now;
    this.version++;
  }

  markExpired(now: Date): void {
    if (this.status.getValue() !== 'ACTIVE' && this.status.getValue() !== 'ABANDONED') return;
    this.status = CartStatus.EXPIRED();
    this.updatedAt = now;
    this.version++;
  }

  cancel(now: Date): void {
    if (this.status.getValue() !== 'ACTIVE') throw new CartException(CART_ERROR_CODES.CART_NOT_ACTIVE, 'Only active carts can be cancelled');
    this.status = CartStatus.CANCELLED();
    this.updatedAt = now;
    this.version++;
    this.emit(new CartCancelledEvent(this.id.toString(), this.tenantId));
  }

  private calcSubtotal(): number {
    return this.items.reduce((sum, i) => sum + i.getSubtotalSnapshot(), 0);
  }

  private emit(event: any): void { this.events.push(event); }

  private touch(): void {
    this.updatedAt = new Date();
    this.version++;
  }
}
