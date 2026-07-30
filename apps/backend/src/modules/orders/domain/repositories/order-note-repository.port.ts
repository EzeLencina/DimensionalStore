import type { OrderNote } from '../aggregates/order-note';

export const ORDER_NOTE_REPOSITORY = 'ORDER_NOTE_REPOSITORY';

export interface OrderNoteRepository {
  save(note: OrderNote): Promise<OrderNote>;
  findById(id: string, tenantId: string): Promise<OrderNote | null>;
  listByOrder(orderId: string, tenantId: string): Promise<OrderNote[]>;
  softDelete(id: string, tenantId: string): Promise<void>;
}
