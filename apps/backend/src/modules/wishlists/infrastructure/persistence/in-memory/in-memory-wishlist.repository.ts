import type { Wishlist } from '../../../../wishlists/domain';
import type { WishlistRepository, WishlistListFilters, WishlistListResult } from '../../../../wishlists/domain';
import type { WishlistId } from '../../../../wishlists/domain';

export class InMemoryWishlistRepository implements WishlistRepository {
  private store = new Map<string, Wishlist>();
  private key(id: string, tenantId: string): string { return `${tenantId}:${id}`; }
  async save(wishlist: Wishlist): Promise<Wishlist> { this.store.set(this.key(wishlist.getId(), wishlist.getTenantId()), wishlist); return wishlist; }
  async findById(id: WishlistId, tenantId: string): Promise<Wishlist | null> { return this.store.get(this.key(id.toString(), tenantId)) ?? null; }
  async findDefaultByCustomer(customerId: string, tenantId: string): Promise<Wishlist | null> { return Array.from(this.store.values()).find(w => w.getTenantId() === tenantId && w.getCustomerId() === customerId && w.getIsDefault() && w.isActive()) ?? null; }
  async findActiveByGuestTokenHash(guestTokenHash: string, tenantId: string): Promise<Wishlist | null> { return Array.from(this.store.values()).find(w => w.getTenantId() === tenantId && w.getGuestTokenHash() === guestTokenHash && w.isActive()) ?? null; }
  async findByCustomerAndName(customerId: string, name: string, tenantId: string): Promise<Wishlist | null> { return Array.from(this.store.values()).find(w => w.getTenantId() === tenantId && w.getCustomerId() === customerId && w.getName() === name && w.isActive()) ?? null; }
  async listByCustomer(customerId: string, tenantId: string, filters?: WishlistListFilters): Promise<WishlistListResult> { const items = Array.from(this.store.values()).filter(w => w.getTenantId() === tenantId && w.getCustomerId() === customerId); const total = items.length; const limit = filters?.limit ?? 20; const offset = filters?.offset ?? 0; return { items: items.slice(offset, offset + limit), total, limit, offset }; }
  async findForUpdate(id: WishlistId, tenantId: string): Promise<Wishlist | null> { return this.findById(id, tenantId); }
  async listExpired(tenantId: string, before: Date): Promise<Wishlist[]> { return Array.from(this.store.values()).filter(w => w.getTenantId() === tenantId && w.getExpiresAt() !== null && w.getExpiresAt()! <= before && w.isActive()); }
}
