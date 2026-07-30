import type { CheckoutRepository } from '../../../domain/repository';
import { CheckoutSession, CheckoutId } from '../../../domain';

export class InMemoryCheckoutSessionRepository implements CheckoutRepository {
  private items: Map<string, CheckoutSession> = new Map();

  async findById(id: CheckoutId, tenantId: string): Promise<CheckoutSession | null> {
    const cs = this.items.get(id.getValue());
    if (!cs || cs.getTenantId() !== tenantId) return null;
    return cs;
  }

  async findActiveByCart(cartId: string, tenantId: string): Promise<CheckoutSession | null> {
    for (const cs of this.items.values()) {
      if (cs.getTenantId() === tenantId && cs.getCartId() === cartId && cs.isModifiable()) return cs;
    }
    return null;
  }

  async findByIdempotencyKey(key: string, tenantId: string): Promise<CheckoutSession | null> {
    for (const cs of this.items.values()) {
      if (cs.getTenantId() === tenantId && cs.getIdempotencyKey() === key) return cs;
    }
    return null;
  }

  async listExpired(tenantId: string, before: Date): Promise<CheckoutSession[]> {
    return [...this.items.values()].filter(c => c.getTenantId() === tenantId && c.isModifiable() && c.getExpiresAt() <= before);
  }

  async save(cs: CheckoutSession): Promise<CheckoutSession> {
    this.items.set(cs.getId().toString(), cs);
    return cs;
  }

  clear(): void { this.items.clear(); }
  seed(items: CheckoutSession[]): void { for (const c of items) this.items.set(c.getId().toString(), c); }
}
