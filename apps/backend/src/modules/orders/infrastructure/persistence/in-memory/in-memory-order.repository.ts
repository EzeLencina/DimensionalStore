import type { Order } from '../../../../checkout/domain';
import type { OrderId } from '../../../../checkout/domain';
import type { OrderRepository, OrderListFilters, OrderListResult } from '../../../domain/repositories';

export class InMemoryOrderRepository implements OrderRepository {
  private store: Map<string, Order> = new Map();

  private key(id: string, tenantId: string): string { return `${tenantId}:${id}`; }

  async save(order: Order): Promise<Order> {
    this.store.set(this.key(order.getId().toString(), order.getTenantId()), order);
    return order;
  }

  async findById(id: OrderId, tenantId: string): Promise<Order | null> {
    return this.store.get(this.key(id.toString(), tenantId)) ?? null;
  }

  async findByOrderNumber(orderNumber: string, tenantId: string): Promise<Order | null> {
    for (const order of this.store.values()) {
      if (order.getTenantId() === tenantId && order.getOrderNumber() === orderNumber) return order;
    }
    return null;
  }

  async findByCheckoutSession(checkoutSessionId: string, tenantId: string): Promise<Order | null> {
    for (const order of this.store.values()) {
      if (order.getTenantId() === tenantId && order.getCheckoutSessionId() === checkoutSessionId) return order;
    }
    return null;
  }

  async list(tenantId: string, filters?: OrderListFilters): Promise<OrderListResult> {
    let items = Array.from(this.store.values()).filter(o => o.getTenantId() === tenantId);

    if (filters?.status) items = items.filter(o => o.getStatus().toString() === filters.status);
    if (filters?.customerId) items = items.filter(o => o.getCustomerId() === filters.customerId);
    if (filters?.orderNumber) items = items.filter(o => o.getOrderNumber().includes(filters.orderNumber!));
    if (filters?.email) items = items.filter(o => o.getGuestEmail()?.includes(filters.email!) ?? false);
    if (filters?.paymentStatus) items = items.filter(o => o.toPrimitives().paymentStatus === filters.paymentStatus);
    if (filters?.fulfillmentStatus) items = items.filter(o => o.toPrimitives().fulfillmentStatus === filters.fulfillmentStatus);
    if (filters?.dateFrom) items = items.filter(o => o.toPrimitives().createdAt >= filters.dateFrom!);
    if (filters?.dateTo) items = items.filter(o => o.toPrimitives().createdAt <= filters.dateTo!);
    if (filters?.minTotal !== undefined) items = items.filter(o => o.getTotal() >= filters.minTotal!);
    if (filters?.maxTotal !== undefined) items = items.filter(o => o.getTotal() <= filters.maxTotal!);

    const total = items.length;
    const limit = filters?.limit ?? 20;
    const offset = filters?.offset ?? 0;
    items = items.slice(offset, offset + limit);

    return { items, total, limit, offset };
  }

  async listByCustomer(customerId: string, tenantId: string, filters?: { limit?: number; offset?: number }): Promise<OrderListResult> {
    let items = Array.from(this.store.values()).filter(o => o.getTenantId() === tenantId && o.getCustomerId() === customerId);
    const total = items.length;
    const limit = filters?.limit ?? 20;
    const offset = filters?.offset ?? 0;
    items = items.slice(offset, offset + limit);
    return { items, total, limit, offset };
  }

  async listByStatus(status: string, tenantId: string): Promise<Order[]> {
    return Array.from(this.store.values()).filter(o => o.getTenantId() === tenantId && o.getStatus().toString() === status);
  }

  async listPendingExpiration(tenantId: string, before: Date): Promise<Order[]> {
    return Array.from(this.store.values()).filter(o =>
      o.getTenantId() === tenantId &&
      o.getStatus().toString() === 'PENDING_PAYMENT' &&
      o.toPrimitives().createdAt <= before,
    );
  }

  async countByStatus(tenantId: string): Promise<Record<string, number>> {
    const counts: Record<string, number> = {};
    for (const o of this.store.values()) {
      if (o.getTenantId() === tenantId) {
        const s = o.getStatus().toString();
        counts[s] = (counts[s] ?? 0) + 1;
      }
    }
    return counts;
  }

  clear(): void { this.store.clear(); }
}
