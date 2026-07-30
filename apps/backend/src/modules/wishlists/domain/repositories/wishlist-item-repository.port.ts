import type { WishlistItem } from '../aggregates';

export const WISHLIST_ITEM_REPOSITORY = 'WISHLIST_ITEM_REPOSITORY';

export interface WishlistItemRepository {
  save(item: WishlistItem): Promise<WishlistItem>;
  findById(id: string, tenantId: string): Promise<WishlistItem | null>;
  exists(wishlistId: string, itemKey: string, tenantId: string): Promise<boolean>;
  listByWishlist(wishlistId: string, tenantId: string): Promise<WishlistItem[]>;
  softDelete(id: string, tenantId: string): Promise<void>;
}
