import type { WishlistItem } from '../../../../wishlists/domain';
import type { WishlistItemRepository } from '../../../../wishlists/domain';

export class InMemoryWishlistItemRepository implements WishlistItemRepository {
  private store = new Map<string, WishlistItem>();
  private key(id: string, tenantId: string): string { return `${tenantId}:${id}`; }
  async save(item: WishlistItem): Promise<WishlistItem> { this.store.set(this.key(item.getId(), item.getTenantId()), item); return item; }
  async findById(id: string, tenantId: string): Promise<WishlistItem | null> { return this.store.get(this.key(id, tenantId)) ?? null; }
  async exists(wishlistId: string, itemKey: string, tenantId: string): Promise<boolean> { return Array.from(this.store.values()).some(i => i.getTenantId() === tenantId && i.getWishlistId() === wishlistId && i.getItemKey() === itemKey && !i.isDeleted()); }
  async listByWishlist(wishlistId: string, tenantId: string): Promise<WishlistItem[]> { return Array.from(this.store.values()).filter(i => i.getTenantId() === tenantId && i.getWishlistId() === wishlistId && !i.isDeleted()); }
  async softDelete(id: string, tenantId: string): Promise<void> { const item = this.store.get(this.key(id, tenantId)); if (item) item.softDelete(new Date()); }
}
