import type { Wishlist } from '../aggregates';
import type { WishlistId } from '../value-objects';

export type WishlistListFilters = { limit?: number; offset?: number };
export type WishlistListResult = { items: Wishlist[]; total: number; limit: number; offset: number };

export const WISHLIST_REPOSITORY = 'WISHLIST_REPOSITORY';

export interface WishlistRepository {
  save(wishlist: Wishlist): Promise<Wishlist>;
  findById(id: WishlistId, tenantId: string): Promise<Wishlist | null>;
  findDefaultByCustomer(customerId: string, tenantId: string): Promise<Wishlist | null>;
  findActiveByGuestTokenHash(guestTokenHash: string, tenantId: string): Promise<Wishlist | null>;
  findByCustomerAndName(customerId: string, name: string, tenantId: string): Promise<Wishlist | null>;
  listByCustomer(customerId: string, tenantId: string, filters?: WishlistListFilters): Promise<WishlistListResult>;
  findForUpdate(id: WishlistId, tenantId: string): Promise<Wishlist | null>;
  listExpired(tenantId: string, before: Date): Promise<Wishlist[]>;
}
