import type { CustomerNote } from '../../../../customers/domain';
import type { CustomerNoteRepository } from '../../../../customers/domain/repositories';

export class InMemoryCustomerNoteRepository implements CustomerNoteRepository {
  private store = new Map<string, CustomerNote>();
  private key(id: string, tenantId: string): string { return `${tenantId}:${id}`; }
  async save(note: CustomerNote): Promise<CustomerNote> { this.store.set(this.key(note.getId(), note.toPrimitives().tenantId), note); return note; }
  async findById(id: string, tenantId: string): Promise<CustomerNote | null> { return this.store.get(this.key(id, tenantId)) ?? null; }
  async listByCustomer(customerId: string, tenantId: string): Promise<CustomerNote[]> { return Array.from(this.store.values()).filter(n => n.toPrimitives().tenantId === tenantId && n.toPrimitives().customerId === customerId && n.toPrimitives().deletedAt === null); }
  async softDelete(id: string, tenantId: string): Promise<void> { const n = this.store.get(this.key(id, tenantId)); if (n) n.softDelete(new Date()); }
}
