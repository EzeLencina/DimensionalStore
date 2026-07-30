import { Injectable, Inject } from '@nestjs/common';
import type { PrismaClient } from '@tienda/database';
import type { OrderCancellationRepository } from '../../../domain/repositories';
import { OrderCancellation } from '../../../domain';
import { PrismaOrderCancellationMapper } from './mappers';

@Injectable()
export class PrismaOrderCancellationRepository implements OrderCancellationRepository {
  constructor(@Inject('PRISMA_CLIENT_ORDERS') private readonly prisma: PrismaClient) {}

  async save(cancellation: OrderCancellation): Promise<OrderCancellation> {
    const data = PrismaOrderCancellationMapper.toPrisma(cancellation);
    const raw = await this.prisma.orderCancellation.upsert({
      where: { id: cancellation.getId() },
      create: data,
      update: data,
    });
    return PrismaOrderCancellationMapper.toDomain(raw);
  }

  async findById(id: string, tenantId: string): Promise<OrderCancellation | null> {
    const raw = await this.prisma.orderCancellation.findUnique({ where: { id } });
    if (!raw || raw.tenantId !== tenantId) return null;
    return PrismaOrderCancellationMapper.toDomain(raw);
  }

  async findByOrder(orderId: string, tenantId: string): Promise<OrderCancellation | null> {
    const raw = await this.prisma.orderCancellation.findFirst({
      where: { orderId, tenantId },
    });
    return raw ? PrismaOrderCancellationMapper.toDomain(raw) : null;
  }
}
