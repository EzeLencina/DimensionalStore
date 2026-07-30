import { Injectable, Inject } from '@nestjs/common';
import type { PrismaClient } from '@tienda/database';
import type { OrderNoteRepository } from '../../../domain/repositories';
import { OrderNote } from '../../../domain';
import { PrismaOrderNoteMapper } from './mappers';

@Injectable()
export class PrismaOrderNoteRepository implements OrderNoteRepository {
  constructor(@Inject('PRISMA_CLIENT_ORDERS') private readonly prisma: PrismaClient) {}

  async save(note: OrderNote): Promise<OrderNote> {
    const data = PrismaOrderNoteMapper.toPrisma(note);
    const raw = await this.prisma.orderNote.create({ data });
    return PrismaOrderNoteMapper.toDomain(raw);
  }

  async findById(id: string, tenantId: string): Promise<OrderNote | null> {
    const raw = await this.prisma.orderNote.findUnique({ where: { id } });
    if (!raw || raw.tenantId !== tenantId) return null;
    return PrismaOrderNoteMapper.toDomain(raw);
  }

  async listByOrder(orderId: string, tenantId: string): Promise<OrderNote[]> {
    const raws = await this.prisma.orderNote.findMany({
      where: { orderId, tenantId, deletedAt: null },
      orderBy: { createdAt: 'asc' },
    });
    return raws.map(r => PrismaOrderNoteMapper.toDomain(r));
  }

  async softDelete(id: string, tenantId: string): Promise<void> {
    await this.prisma.orderNote.updateMany({
      where: { id, tenantId },
      data: { deletedAt: new Date() },
    });
  }
}
