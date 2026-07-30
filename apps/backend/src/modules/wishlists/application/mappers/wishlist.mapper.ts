import type { Wishlist, WishlistItem } from '../../domain';
import type { WishlistResponseDto, WishlistItemResponseDto } from '../dto';

export class WishlistMapper {
  static toResponse(wishlist: Wishlist, items: Array<{ item: WishlistItem; productName?: string | null; variantName?: string | null; slug?: string | null; primaryImage?: string | null; currentPrice?: number | null; currency?: string | null; inStock?: boolean | null; availableQuantity?: number | null; purchasable?: boolean | null }> = []): WishlistResponseDto {
    const p = wishlist.toPrimitives();
    const derived = new Map(items.map(v => [v.item.getId(), v] as const));
    return {
      id: p.id, tenantId: p.tenantId, customerId: p.customerId, guestTokenHash: p.guestTokenHash ?? null, name: p.name, status: p.status, isDefault: p.isDefault,
      expiresAt: p.expiresAt?.toISOString() ?? null, createdAt: p.createdAt.toISOString(), updatedAt: p.updatedAt.toISOString(), deletedAt: p.deletedAt?.toISOString() ?? null, version: p.version,
      items: p.items.map(i => {
        const extra = derived.get(i.id);
        return {
          id: i.id, productId: i.productId, productVariantId: i.productVariantId, sku: i.sku,
          productName: extra?.productName ?? null, variantName: extra?.variantName ?? null, slug: extra?.slug ?? null, primaryImage: extra?.primaryImage ?? null,
          currentPrice: extra?.currentPrice ?? null, currency: extra?.currency ?? null, inStock: extra?.inStock ?? null, availableQuantity: extra?.availableQuantity ?? null, purchasable: extra?.purchasable ?? null,
          addedAt: i.addedAt.toISOString(), note: i.note, priority: i.priority,
        } as WishlistItemResponseDto;
      }),
    };
  }
}
