import type { IdempotencyRepository, IdempotencyRecord } from '../../../domain/repository';

export class InMemoryIdempotencyRepository implements IdempotencyRepository {
  private items: IdempotencyRecord[] = [];
  private counter = 0;

  async find(key: string, operation: string, tenantId: string): Promise<IdempotencyRecord | null> {
    return this.items.find(r => r.key === key && r.operation === operation && r.tenantId === tenantId) ?? null;
  }

  async save(record: Omit<IdempotencyRecord, 'id' | 'createdAt'>): Promise<IdempotencyRecord> {
    const created: IdempotencyRecord = { ...record, id: `idem_${++this.counter}`, createdAt: new Date() } as IdempotencyRecord;
    this.items.push(created);
    return created;
  }

  clear(): void { this.items = []; this.counter = 0; }
}
