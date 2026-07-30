import { Injectable, Inject } from '@nestjs/common';
import type { PrismaClient } from '@tienda/database';
import type { OrderStatusHistoryRepository } from '../../../domain/repositories';
import { OrderStatusHistory } from '../../../domain';
import { PrismaOrderHistoryMapper } from './mappers';

@Injectable()
export class PrismaOrderStatusHistoryRepository implements OrderStatusHistoryRepository {
  constructor(@Inject('PRISMA_CLIENT_ORDERS') private readonly prisma: PrismaClient) {}

  async append(entry: OrderStatusHistory): Promise<void> {
    const data = PrismaOrderHistoryMapper.toPrisma(entry);
    await this.prisma.orderStatusHistory.create({ data });
  }

  async listByOrder(orderId: string, tenantId: string): Promise<OrderStatusHistory[]> {
    const raws = await this.prisma.orderStatusHistory.findMany({
      where: { orderId, tenantId },
      orderBy: { createdAt: 'asc' },
    });
    return raws.map(r => PrismaOrderHistoryMapper.toDomain(r));
  }
}
