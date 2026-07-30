import type { CartRepository } from '../../../domain/repository';
import { Cart, CartId } from '../../../domain';

export class InMemoryCartRepository implements CartRepository {
  private items: Map<string, Cart> = new Map();

  async findById(id: CartId, tenantId: string): Promise<Cart | null> {
    const cart = this.items.get(id.getValue());
    if (!cart || cart.getTenantId() !== tenantId) return null;
    return cart;
  }

  async findActiveByCustomer(customerId: string, tenantId: string): Promise<Cart | null> {
    for (const cart of this.items.values()) {
      if (cart.getTenantId() === tenantId && cart.getCustomerId() === customerId && cart.getStatus().getValue() === 'ACTIVE') {
        return cart;
      }
    }
    return null;
  }

  async findActiveByGuestTokenHash(guestTokenHash: string, tenantId: string): Promise<Cart | null> {
    for (const cart of this.items.values()) {
      if (cart.getTenantId() === tenantId && cart.getGuestTokenHash() === guestTokenHash && cart.getStatus().getValue() === 'ACTIVE') {
        return cart;
      }
    }
    return null;
  }

  async listExpired(tenantId: string, before: Date): Promise<Cart[]> {
    return [...this.items.values()]
      .filter(c => c.getTenantId() === tenantId && c.getStatus().getValue() === 'ACTIVE' && c.getExpiresAt() <= before);
  }

  async save(cart: Cart): Promise<Cart> {
    this.items.set(cart.getId().toString(), cart);
    return cart;
  }

  clear(): void { this.items.clear(); }

  seed(items: Cart[]): void {
    for (const c of items) this.items.set(c.getId().toString(), c);
  }
}
