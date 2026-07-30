import { Injectable, Inject } from '@nestjs/common';
import type { PrismaClient } from '@tienda/database';
import { CustomerNote } from '../../../../customers/domain';
import type { CustomerNoteRepository } from '../../../../customers/domain';

type Row = { id: string; tenantId: string; customerId: string; content: string; createdBy: string; createdAt: Date; updatedAt: Date; deletedAt: Date | null };

@Injectable()
export class PrismaCustomerNoteRepository implements CustomerNoteRepository {
  constructor(@Inject('PRISMA_CLIENT_CUSTOMERS') private readonly prisma: PrismaClient) {}
  async save(note: CustomerNote): Promise<CustomerNote> { await this.prisma.customerNote.upsert({ where: { id: note.getId() }, create: note.toPrimitives() as never, update: note.toPrimitives() as never }); return note; }
  async findById(id: string, tenantId: string): Promise<CustomerNote | null> { const raw = await this.prisma.customerNote.findFirst({ where: { id, tenantId } }); return raw ? CustomerNote.fromPrimitives(raw as Row) : null; }
  async listByCustomer(customerId: string, tenantId: string): Promise<CustomerNote[]> { const rows = await this.prisma.customerNote.findMany({ where: { customerId, tenantId, deletedAt: null } }); return rows.map((r: Row) => CustomerNote.fromPrimitives(r)); }
  async softDelete(id: string, tenantId: string): Promise<void> { await this.prisma.customerNote.updateMany({ where: { id, tenantId }, data: { deletedAt: new Date() } }); }
}
