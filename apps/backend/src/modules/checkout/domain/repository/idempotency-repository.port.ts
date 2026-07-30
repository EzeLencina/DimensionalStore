export const IDEMPOTENCY_REPOSITORY = 'IDEMPOTENCY_REPOSITORY';

export interface IdempotencyRecord {
  id: string; tenantId: string; key: string; operation: string;
  payloadHash: string; response: any; createdAt: Date;
}

export interface IdempotencyRepository {
  find(key: string, operation: string, tenantId: string): Promise<IdempotencyRecord | null>;
  save(record: Omit<IdempotencyRecord, 'id' | 'createdAt'>): Promise<IdempotencyRecord>;
}
