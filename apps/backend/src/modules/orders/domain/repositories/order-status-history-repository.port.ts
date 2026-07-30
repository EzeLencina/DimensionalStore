import type { OrderStatusHistory } from '../aggregates/order-status-history';

export const ORDER_STATUS_HISTORY_REPOSITORY = 'ORDER_STATUS_HISTORY_REPOSITORY';

export interface OrderStatusHistoryRepository {
  append(entry: OrderStatusHistory): Promise<void>;
  listByOrder(orderId: string, tenantId: string): Promise<OrderStatusHistory[]>;
}
