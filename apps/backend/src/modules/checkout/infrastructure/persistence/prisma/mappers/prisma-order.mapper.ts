import { Order, type OrderPrimitives } from '../../../../domain';

export class PrismaOrderMapper {
  static toDomain(model: any): Order {
    return Order.fromPrimitives({
      id: model.id, tenantId: model.tenantId, orderNumber: model.orderNumber,
      cartId: model.cartId, checkoutSessionId: model.checkoutSessionId,
      customerId: model.customerId, guestEmail: model.guestEmail,
      status: model.status, currency: model.currency,
      subtotal: model.subtotal, shippingAmount: model.shippingAmount,
      discountAmount: model.discountAmount, taxAmount: model.taxAmount, total: model.total,
      shippingMethodCode: model.shippingMethodCode, paymentMethodCode: model.paymentMethodCode,
      version: model.version, createdAt: model.createdAt, updatedAt: model.updatedAt,
      items: (model.items || []).map((i: any) => ({
        id: i.id, orderId: i.orderId, productVariantId: i.productVariantId,
        sku: i.sku, productNameSnapshot: i.productNameSnapshot,
        variantNameSnapshot: i.variantNameSnapshot,
        quantity: i.quantity, unitPrice: i.unitPrice, subtotal: i.subtotal,
        createdAt: i.createdAt,
      })),
    } as OrderPrimitives);
  }

  static toCreateInput(order: Order): any {
    const p = order.toPrimitives();
    return {
      id: p.id, tenantId: p.tenantId, orderNumber: p.orderNumber,
      cartId: p.cartId, checkoutSessionId: p.checkoutSessionId,
      customerId: p.customerId, guestEmail: p.guestEmail,
      status: p.status, currency: p.currency,
      subtotal: p.subtotal, shippingAmount: p.shippingAmount,
      discountAmount: p.discountAmount, taxAmount: p.taxAmount, total: p.total,
      shippingMethodCode: p.shippingMethodCode, paymentMethodCode: p.paymentMethodCode,
      createdAt: p.createdAt, updatedAt: p.updatedAt,
      items: { create: p.items.map(i => ({
        id: i.id, productVariantId: i.productVariantId, sku: i.sku,
        productNameSnapshot: i.productNameSnapshot, variantNameSnapshot: i.variantNameSnapshot,
        quantity: i.quantity, unitPrice: i.unitPrice, subtotal: i.subtotal,
      }))},
    };
  }
}
