import { Injectable } from '@nestjs/common';
import type { IdempotencyRepository, IdempotencyRecord } from '../../../../domain/repository';

@Injectable()
export class PrismaIdempotencyRepository implements IdempotencyRepository {
  constructor(private readonly prisma: any) {}

  async find(key: string, operation: string, tenantId: string): Promise<IdempotencyRecord | null> {
    return this.prisma.idempotencyRecord.findUnique({
      where: { tenantId_key_operation: { tenantId, key, operation } },
    }) as Promise<IdempotencyRecord | null>;
  }

  async save(record: Omit<IdempotencyRecord, 'id' | 'createdAt'>): Promise<IdempotencyRecord> {
    return this.prisma.idempotencyRecord.create({ data: record }) as Promise<IdempotencyRecord>;
  }
}
