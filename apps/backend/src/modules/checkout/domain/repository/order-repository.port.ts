import type { Order } from '../aggregates/order.aggregate';
import type { OrderId } from '../value-objects/order-id';

export const ORDER_REPOSITORY = 'ORDER_REPOSITORY';

export interface OrderRepository {
  save(order: Order): Promise<Order>;
  findById(id: OrderId, tenantId: string): Promise<Order | null>;
  findByOrderNumber(orderNumber: string, tenantId: string): Promise<Order | null>;
  findByCheckoutSession(checkoutSessionId: string, tenantId: string): Promise<Order | null>;
}
