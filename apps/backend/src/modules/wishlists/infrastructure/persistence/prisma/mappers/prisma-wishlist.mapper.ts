import { Wishlist, WishlistItem } from '../../../../domain';

export class PrismaWishlistMapper {
  static toDomain(raw: {
    id: string; tenantId: string; customerId: string | null; guestTokenHash: string | null; name: string; status: string; isDefault: boolean; expiresAt: Date | null; createdAt: Date; updatedAt: Date; deletedAt: Date | null; version: number; items?: Array<any>;
  }): Wishlist {
    return Wishlist.fromPrimitives({
      id: raw.id, tenantId: raw.tenantId, customerId: raw.customerId, guestTokenHash: raw.guestTokenHash, name: raw.name, status: raw.status, isDefault: raw.isDefault, expiresAt: raw.expiresAt, createdAt: raw.createdAt, updatedAt: raw.updatedAt, deletedAt: raw.deletedAt, version: raw.version,
      items: (raw.items ?? []).map(i => ({ id: i.id, tenantId: i.tenantId, wishlistId: i.wishlistId, productId: i.productId, productVariantId: i.productVariantId, sku: i.sku, itemKey: i.itemKey, note: i.note, priority: i.priority, addedAt: i.addedAt, createdAt: i.createdAt, updatedAt: i.updatedAt, deletedAt: i.deletedAt })),
    });
  }
  static toPrisma(wishlist: Wishlist): Record<string, unknown> { const p = wishlist.toPrimitives(); return { id: p.id, tenantId: p.tenantId, customerId: p.customerId, guestTokenHash: p.guestTokenHash, name: p.name, status: p.status, isDefault: p.isDefault, expiresAt: p.expiresAt, deletedAt: p.deletedAt, version: p.version }; }
}
