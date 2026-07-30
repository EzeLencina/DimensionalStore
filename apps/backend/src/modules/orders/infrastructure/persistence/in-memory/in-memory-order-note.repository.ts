import type { OrderNote } from '../../../domain/aggregates';
import type { OrderNoteRepository } from '../../../domain/repositories';

export class InMemoryOrderNoteRepository implements OrderNoteRepository {
  private store: Map<string, OrderNote> = new Map();

  private key(id: string, tenantId: string): string { return `${tenantId}:${id}`; }

  async save(note: OrderNote): Promise<OrderNote> {
    this.store.set(this.key(note.getId(), note.getTenantId()), note);
    return note;
  }

  async findById(id: string, tenantId: string): Promise<OrderNote | null> {
    return this.store.get(this.key(id, tenantId)) ?? null;
  }

  async listByOrder(orderId: string, tenantId: string): Promise<OrderNote[]> {
    return Array.from(this.store.values()).filter(n => n.getTenantId() === tenantId && n.getOrderId() === orderId && !n.isDeleted());
  }

  async softDelete(id: string, tenantId: string): Promise<void> {
    const note = this.store.get(this.key(id, tenantId));
    if (note) note.softDelete(new Date());
  }

  clear(): void { this.store.clear(); }
}
