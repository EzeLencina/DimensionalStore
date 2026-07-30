import type { Prisma } from '@tienda/database';
import { Wishlist } from '../../../../domain';

export type WishlistWithItems = Prisma.WishlistGetPayload<{
  include: { items: true };
}>;

export class PrismaWishlistMapper {
  static toDomain(raw: WishlistWithItems): Wishlist {
    return Wishlist.fromPrimitives({
      id: raw.id, tenantId: raw.tenantId, customerId: raw.customerId, guestTokenHash: raw.guestTokenHash, name: raw.name, status: raw.status, isDefault: raw.isDefault, expiresAt: raw.expiresAt, createdAt: raw.createdAt, updatedAt: raw.updatedAt, deletedAt: raw.deletedAt, version: raw.version,
      items: raw.items.map(item => ({ id: item.id, tenantId: item.tenantId, wishlistId: item.wishlistId, productId: item.productId, productVariantId: item.productVariantId, sku: item.sku, itemKey: item.itemKey, note: item.note, priority: item.priority, addedAt: item.addedAt, createdAt: item.createdAt, updatedAt: item.updatedAt, deletedAt: item.deletedAt })),
    });
  }

  static toCreateInput(wishlist: Wishlist): Prisma.WishlistUncheckedCreateInput {
    const p = wishlist.toPrimitives();
    return { id: p.id, tenantId: p.tenantId, customerId: p.customerId, guestTokenHash: p.guestTokenHash, name: p.name, status: wishlist.getStatus().getValue(), isDefault: p.isDefault, expiresAt: p.expiresAt, deletedAt: p.deletedAt, version: p.version };
  }

  static toUpdateInput(wishlist: Wishlist): Prisma.WishlistUncheckedUpdateInput {
    const p = wishlist.toPrimitives();
    return { customerId: p.customerId, guestTokenHash: p.guestTokenHash, name: p.name, status: wishlist.getStatus().getValue(), isDefault: p.isDefault, expiresAt: p.expiresAt, deletedAt: p.deletedAt, version: p.version };
  }
}
