import { OrderId } from '../value-objects/order-id';

export type OrderItemPrimitives = {
  id: string; orderId: string; productVariantId: string;
  sku: string; productNameSnapshot: string; variantNameSnapshot: string | null;
  quantity: number; unitPrice: number; subtotal: number; createdAt: Date;
};

export class OrderItem {
  readonly id: string;
  private orderId: string;
  private productVariantId: string;
  private sku: string;
  productNameSnapshot: string;
  variantNameSnapshot: string | null;
  private quantity: number;
  unitPrice: number;
  subtotal: number;
  readonly createdAt: Date;

  private constructor(orderId: string, productVariantId: string, sku: string, productName: string, variantName: string | null, quantity: number, unitPrice: number) {
    this.id = crypto.randomUUID();
    this.orderId = orderId;
    this.productVariantId = productVariantId;
    this.sku = sku;
    this.productNameSnapshot = productName;
    this.variantNameSnapshot = variantName;
    this.quantity = quantity;
    this.unitPrice = unitPrice;
    this.subtotal = unitPrice * quantity;
    this.createdAt = new Date();
  }

  static create(orderId: string, productVariantId: string, sku: string, productName: string, variantName: string | null, quantity: number, unitPrice: number): OrderItem {
    return new OrderItem(orderId, productVariantId, sku, productName, variantName, quantity, unitPrice);
  }

  static fromPrimitives(p: OrderItemPrimitives): OrderItem {
    const item = new OrderItem(p.orderId, p.productVariantId, p.sku, p.productNameSnapshot, p.variantNameSnapshot, p.quantity, p.unitPrice);
    (item as any).id = p.id;
    (item as any).subtotal = p.subtotal;
    (item as any).createdAt = p.createdAt;
    return item;
  }

  toPrimitives(): OrderItemPrimitives {
    return {
      id: this.id, orderId: this.orderId, productVariantId: this.productVariantId,
      sku: this.sku, productNameSnapshot: this.productNameSnapshot,
      variantNameSnapshot: this.variantNameSnapshot,
      quantity: this.quantity, unitPrice: this.unitPrice, subtotal: this.subtotal,
      createdAt: this.createdAt,
    };
  }
}
