import { Cart, type CartPrimitives } from '../../../../domain';

export class PrismaCartMapper {
  static toDomain(model: any): Cart {
    return Cart.fromPrimitives({
      id: model.id, tenantId: model.tenantId,
      customerId: model.customerId, guestTokenHash: model.guestTokenHash,
      status: model.status, currency: model.currency,
      itemsCount: model.itemsCount, subtotal: model.subtotal, total: model.total,
      expiresAt: model.expiresAt, version: model.version,
      createdAt: model.createdAt, updatedAt: model.updatedAt,
      items: (model.items || []).map((item: any) => ({
        id: item.id, cartId: item.cartId, productVariantId: item.productVariantId,
        sku: item.sku, quantity: item.quantity,
        unitPriceSnapshot: item.unitPriceSnapshot, subtotalSnapshot: item.subtotalSnapshot,
        addedAt: item.addedAt, updatedAt: item.updatedAt,
      })),
    } as CartPrimitives);
  }

  static toCreateInput(cart: Cart): any {
    const p = cart.toPrimitives();
    return {
      id: p.id, tenantId: p.tenantId,
      customerId: p.customerId, guestTokenHash: p.guestTokenHash,
      status: p.status, currency: p.currency,
      itemsCount: p.itemsCount, subtotal: p.subtotal, total: p.total,
      expiresAt: p.expiresAt, createdAt: p.createdAt, updatedAt: p.updatedAt,
      items: { create: p.items.map(item => ({
        id: item.id, productVariantId: item.productVariantId,
        sku: item.sku, quantity: item.quantity,
        unitPriceSnapshot: item.unitPriceSnapshot, subtotalSnapshot: item.subtotalSnapshot,
        addedAt: item.addedAt, updatedAt: item.updatedAt,
      }))},
    };
  }
}
