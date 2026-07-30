import type { Order } from '../../../checkout/domain/aggregates/order.aggregate';
import type { OrderId } from '../../../checkout/domain/value-objects';
import type { OrderPrimitives } from '../../../checkout/domain/aggregates/order.aggregate';

export type OrderListFilters = {
  status?: string; customerId?: string; orderNumber?: string;
  email?: string; dateFrom?: Date; dateTo?: Date;
  minTotal?: number; maxTotal?: number;
  paymentStatus?: string; fulfillmentStatus?: string;
  limit?: number; offset?: number;
  sortBy?: string; sortOrder?: 'asc' | 'desc';
};

export type OrderListResult = {
  items: Order[];
  total: number;
  limit: number;
  offset: number;
};

export const ORDER_REPOSITORY = 'ORDER_REPOSITORY_ORDERS';

export interface OrderRepository {
  save(order: Order): Promise<Order>;
  findById(id: OrderId, tenantId: string): Promise<Order | null>;
  findByOrderNumber(orderNumber: string, tenantId: string): Promise<Order | null>;
  findByCheckoutSession(checkoutSessionId: string, tenantId: string): Promise<Order | null>;
  list(tenantId: string, filters?: OrderListFilters): Promise<OrderListResult>;
  listByCustomer(customerId: string, tenantId: string, filters?: { limit?: number; offset?: number }): Promise<OrderListResult>;
  listByStatus(status: string, tenantId: string): Promise<Order[]>;
  listPendingExpiration(tenantId: string, before: Date): Promise<Order[]>;
  countByStatus(tenantId: string): Promise<Record<string, number>>;
}
