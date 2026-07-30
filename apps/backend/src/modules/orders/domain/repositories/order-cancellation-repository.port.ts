import type { OrderCancellation } from '../aggregates/order-cancellation';

export const ORDER_CANCELLATION_REPOSITORY = 'ORDER_CANCELLATION_REPOSITORY';

export interface OrderCancellationRepository {
  save(cancellation: OrderCancellation): Promise<OrderCancellation>;
  findById(id: string, tenantId: string): Promise<OrderCancellation | null>;
  findByOrder(orderId: string, tenantId: string): Promise<OrderCancellation | null>;
}
