import { Injectable, Inject } from '@nestjs/common';
import type { PrismaClient } from '@tienda/database';
import { Order } from '../../../../checkout/domain';
import { OrderId } from '../../../../checkout/domain';
import type { OrderRepository, OrderListFilters, OrderListResult } from '../../../domain/repositories';
import { PrismaOrderMapper } from './mappers';

const SORTABLE_FIELDS = ['createdAt', 'updatedAt', 'orderNumber', 'status', 'total'];

@Injectable()
export class PrismaOrderRepository implements OrderRepository {
  constructor(@Inject('PRISMA_CLIENT_ORDERS') private readonly prisma: PrismaClient) {}

  async save(order: Order): Promise<Order> {
    const data = PrismaOrderMapper.toPrisma(order);
    await this.prisma.order.upsert({
      where: { id: order.getId().toString() },
      create: { ...data, items: { create: data.items } },
      update: { ...data, items: { deleteMany: {}, create: data.items } },
    });
    return order;
  }

  async findById(id: OrderId, tenantId: string): Promise<Order | null> {
    const raw = await this.prisma.order.findUnique({
      where: { id: id.toString() },
      include: { items: true },
    });
    if (!raw || raw.tenantId !== tenantId) return null;
    return PrismaOrderMapper.toDomain(raw);
  }

  async findByOrderNumber(orderNumber: string, tenantId: string): Promise<Order | null> {
    const raw = await this.prisma.order.findFirst({
      where: { orderNumber, tenantId },
      include: { items: true },
    });
    return raw ? PrismaOrderMapper.toDomain(raw) : null;
  }

  async findByCheckoutSession(checkoutSessionId: string, tenantId: string): Promise<Order | null> {
    const raw = await this.prisma.order.findUnique({
      where: { checkoutSessionId },
      include: { items: true },
    });
    if (!raw || raw.tenantId !== tenantId) return null;
    return PrismaOrderMapper.toDomain(raw);
  }

  async list(tenantId: string, filters?: OrderListFilters): Promise<OrderListResult> {
    const where: any = { tenantId };
    if (filters?.status) where.status = filters.status;
    if (filters?.customerId) where.customerId = filters.customerId;
    if (filters?.orderNumber) where.orderNumber = { contains: filters.orderNumber };
    if (filters?.email) where.guestEmail = { contains: filters.email };
    if (filters?.paymentStatus) where.paymentStatus = filters.paymentStatus;
    if (filters?.fulfillmentStatus) where.fulfillmentStatus = filters.fulfillmentStatus;
    if (filters?.dateFrom || filters?.dateTo) {
      where.createdAt = {};
      if (filters.dateFrom) where.createdAt.gte = filters.dateFrom;
      if (filters.dateTo) where.createdAt.lte = filters.dateTo;
    }
    if (filters?.minTotal !== undefined || filters?.maxTotal !== undefined) {
      where.total = {};
      if (filters.minTotal !== undefined) where.total.gte = filters.minTotal;
      if (filters.maxTotal !== undefined) where.total.lte = filters.maxTotal;
    }

    const orderBy: any = {};
    if (filters?.sortBy && SORTABLE_FIELDS.includes(filters.sortBy)) {
      orderBy[filters.sortBy] = filters.sortOrder ?? 'desc';
    } else {
      orderBy.createdAt = 'desc';
    }

    const limit = Math.min(filters?.limit ?? 20, 100);
    const offset = filters?.offset ?? 0;

    const [raws, total] = await Promise.all([
      this.prisma.order.findMany({ where, include: { items: true }, orderBy, take: limit, skip: offset }),
      this.prisma.order.count({ where }),
    ]);

    return { items: raws.map(r => PrismaOrderMapper.toDomain(r)), total, limit, offset };
  }

  async listByCustomer(customerId: string, tenantId: string, filters?: { limit?: number; offset?: number }): Promise<OrderListResult> {
    const limit = Math.min(filters?.limit ?? 20, 100);
    const offset = filters?.offset ?? 0;
    const where = { tenantId, customerId };

    const [raws, total] = await Promise.all([
      this.prisma.order.findMany({ where, include: { items: true }, orderBy: { createdAt: 'desc' }, take: limit, skip: offset }),
      this.prisma.order.count({ where }),
    ]);

    return { items: raws.map(r => PrismaOrderMapper.toDomain(r)), total, limit, offset };
  }

  async listByStatus(status: string, tenantId: string): Promise<Order[]> {
    const raws = await this.prisma.order.findMany({ where: { tenantId, status: status as never }, include: { items: true } });
    return raws.map(r => PrismaOrderMapper.toDomain(r));
  }

  async listPendingExpiration(tenantId: string, before: Date): Promise<Order[]> {
    const raws = await this.prisma.order.findMany({
      where: { tenantId, status: 'PENDING_PAYMENT', createdAt: { lte: before } },
      include: { items: true },
    });
    return raws.map(r => PrismaOrderMapper.toDomain(r));
  }

  async countByStatus(tenantId: string): Promise<Record<string, number>> {
    const raws = await this.prisma.order.groupBy({
      by: ['status'],
      where: { tenantId },
      _count: { status: true },
    } as never) as Array<{ status: string; _count: { status: number } }>;
    const counts: Record<string, number> = {};
    for (const r of raws) counts[r.status] = r._count.status;
    return counts;
  }
}
