import type { OrderRepository } from '../../../domain/repository';
import { Order, OrderId } from '../../../domain';

export class InMemoryOrderRepository implements OrderRepository {
  private items: Map<string, Order> = new Map();

  async findById(id: OrderId, tenantId: string): Promise<Order | null> {
    const o = this.items.get(id.getValue());
    if (!o || o.getTenantId() !== tenantId) return null;
    return o;
  }

  async findByOrderNumber(orderNumber: string, tenantId: string): Promise<Order | null> {
    for (const o of this.items.values()) {
      if (o.getTenantId() === tenantId && o.getOrderNumber() === orderNumber) return o;
    }
    return null;
  }

  async findByCheckoutSession(checkoutSessionId: string, tenantId: string): Promise<Order | null> {
    for (const o of this.items.values()) {
      if (o.getTenantId() === tenantId && o.getCheckoutSessionId() === checkoutSessionId) return o;
    }
    return null;
  }

  async save(order: Order): Promise<Order> {
    this.items.set(order.getId().toString(), order);
    return order;
  }

  clear(): void { this.items.clear(); }
  seed(items: Order[]): void { for (const c of items) this.items.set(c.getId().toString(), c); }
}
