import type { Cart } from '../aggregates/cart.aggregate';
import type { CartId } from '../value-objects/cart-id';

export const CART_REPOSITORY = 'CART_REPOSITORY';

export interface CartRepository {
  save(cart: Cart): Promise<Cart>;
  findById(id: CartId, tenantId: string): Promise<Cart | null>;
  findActiveByCustomer(customerId: string, tenantId: string): Promise<Cart | null>;
  findActiveByGuestTokenHash(guestTokenHash: string, tenantId: string): Promise<Cart | null>;
  listExpired(tenantId: string, before: Date): Promise<Cart[]>;
}
