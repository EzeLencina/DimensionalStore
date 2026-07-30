import type { OrderCancellation } from '../../../domain/aggregates';
import type { OrderCancellationRepository } from '../../../domain/repositories';

export class InMemoryOrderCancellationRepository implements OrderCancellationRepository {
  private store: Map<string, OrderCancellation> = new Map();

  private key(id: string, tenantId: string): string { return `${tenantId}:${id}`; }

  async save(cancellation: OrderCancellation): Promise<OrderCancellation> {
    this.store.set(this.key(cancellation.getId(), cancellation.getTenantId()), cancellation);
    return cancellation;
  }

  async findById(id: string, tenantId: string): Promise<OrderCancellation | null> {
    return this.store.get(this.key(id, tenantId)) ?? null;
  }

  async findByOrder(orderId: string, tenantId: string): Promise<OrderCancellation | null> {
    for (const c of this.store.values()) {
      if (c.getTenantId() === tenantId && c.getOrderId() === orderId) return c;
    }
    return null;
  }

  clear(): void { this.store.clear(); }
}
