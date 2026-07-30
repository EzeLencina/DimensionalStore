import { CartItemId, Quantity } from '../value-objects';

export type CartItemPrimitives = {
  id: string; cartId: string; productVariantId: string;
  sku: string; quantity: number;
  unitPriceSnapshot: number; subtotalSnapshot: number;
  addedAt: Date; updatedAt: Date;
};

export class CartItem {
  readonly id: CartItemId;
  private cartId: string;
  private productVariantId: string;
  private sku: string;
  private quantity: Quantity;
  unitPriceSnapshot: number;
  subtotalSnapshot: number;
  addedAt: Date;
  updatedAt: Date;

  private constructor(id: CartItemId, cartId: string, productVariantId: string, sku: string, quantity: Quantity, unitPrice: number) {
    this.id = id;
    this.cartId = cartId;
    this.productVariantId = productVariantId;
    this.sku = sku;
    this.quantity = quantity;
    this.unitPriceSnapshot = unitPrice;
    this.subtotalSnapshot = unitPrice * quantity.getValue();
    this.addedAt = new Date();
    this.updatedAt = new Date();
  }

  static create(cartId: string, productVariantId: string, sku: string, quantity: Quantity, unitPrice: number): CartItem {
    return new CartItem(new CartItemId(), cartId, productVariantId, sku, quantity, unitPrice);
  }

  static fromPrimitives(p: CartItemPrimitives): CartItem {
    const item = new CartItem(new CartItemId(p.id), p.cartId, p.productVariantId, p.sku, Quantity.create(p.quantity), p.unitPriceSnapshot);
    item.subtotalSnapshot = p.subtotalSnapshot;
    item.addedAt = p.addedAt;
    item.updatedAt = p.updatedAt;
    return item;
  }

  toPrimitives(): CartItemPrimitives {
    return {
      id: this.id.toString(), cartId: this.cartId, productVariantId: this.productVariantId,
      sku: this.sku, quantity: this.quantity.getValue(),
      unitPriceSnapshot: this.unitPriceSnapshot, subtotalSnapshot: this.subtotalSnapshot,
      addedAt: this.addedAt, updatedAt: this.updatedAt,
    };
  }

  getId(): CartItemId { return this.id; }
  getCartId(): string { return this.cartId; }
  getProductVariantId(): string { return this.productVariantId; }
  getSku(): string { return this.sku; }
  getQuantity(): Quantity { return this.quantity; }
  getUnitPriceSnapshot(): number { return this.unitPriceSnapshot; }
  getSubtotalSnapshot(): number { return this.subtotalSnapshot; }
  getAddedAt(): Date { return this.addedAt; }

  updateQuantity(quantity: Quantity, unitPrice: number): void {
    this.quantity = quantity;
    this.unitPriceSnapshot = unitPrice;
    this.subtotalSnapshot = unitPrice * quantity.getValue();
    this.updatedAt = new Date();
  }
}
