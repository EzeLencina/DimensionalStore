import type { OrderStatusHistory } from '../../../domain/aggregates';
import type { OrderStatusHistoryRepository } from '../../../domain/repositories';

export class InMemoryOrderStatusHistoryRepository implements OrderStatusHistoryRepository {
  private store: OrderStatusHistory[] = [];

  async append(entry: OrderStatusHistory): Promise<void> {
    this.store.push(entry);
  }

  async listByOrder(orderId: string, tenantId: string): Promise<OrderStatusHistory[]> {
    return this.store.filter(h => h.getTenantId() === tenantId && h.getOrderId() === orderId);
  }

  clear(): void { this.store = []; }
}
