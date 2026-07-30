import { Injectable, Inject } from '@nestjs/common';
import type { PrismaClient } from '@tienda/database';
import { CustomerTag } from '../../../../customers/domain';
import type { CustomerTagRepository } from '../../../../customers/domain';

type Row = { id: string; tenantId: string; name: string; slug: string; description: string | null; createdAt: Date; updatedAt: Date; deletedAt: Date | null };

@Injectable()
export class PrismaCustomerTagRepository implements CustomerTagRepository {
  constructor(@Inject('PRISMA_CLIENT_CUSTOMERS') private readonly prisma: PrismaClient) {}
  async save(tag: CustomerTag): Promise<CustomerTag> { await this.prisma.customerTag.upsert({ where: { id: tag.getId() }, create: tag.toPrimitives() as never, update: tag.toPrimitives() as never }); return tag; }
  async findById(id: string, tenantId: string): Promise<CustomerTag | null> { const raw = await this.prisma.customerTag.findFirst({ where: { id, tenantId } }); return raw ? CustomerTag.fromPrimitives(raw as Row) : null; }
  async findBySlug(slug: string, tenantId: string): Promise<CustomerTag | null> { const raw = await this.prisma.customerTag.findFirst({ where: { slug, tenantId } }); return raw ? CustomerTag.fromPrimitives(raw as Row) : null; }
  async list(tenantId: string): Promise<CustomerTag[]> { const rows = await this.prisma.customerTag.findMany({ where: { tenantId } }); return rows.map((r: Row) => CustomerTag.fromPrimitives(r)); }
  async existsBySlug(slug: string, tenantId: string): Promise<boolean> { return (await this.findBySlug(slug, tenantId)) !== null; }
}
