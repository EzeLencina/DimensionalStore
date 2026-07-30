import { Injectable, Inject } from '@nestjs/common';
import { LOGGER_TOKEN } from '@tienda/logger/nest';
import { Order, OrderId } from '../../../../domain';
import type { OrderRepository } from '../../../../domain/repository';
import { PrismaOrderMapper } from '../mappers/prisma-order.mapper';

@Injectable()
export class PrismaOrderRepository implements OrderRepository {
  constructor(private readonly prisma: any, @Inject(LOGGER_TOKEN) private readonly logger: any) {}

  async findById(id: OrderId, tenantId: string): Promise<Order | null> {
    const model = await this.prisma.order.findFirst({
      where: { id: id.getValue(), tenantId },
      include: { items: true },
    });
    return model ? PrismaOrderMapper.toDomain(model) : null;
  }

  async findByOrderNumber(orderNumber: string, tenantId: string): Promise<Order | null> {
    const model = await this.prisma.order.findFirst({
      where: { orderNumber, tenantId },
      include: { items: true },
    });
    return model ? PrismaOrderMapper.toDomain(model) : null;
  }

  async findByCheckoutSession(checkoutSessionId: string, tenantId: string): Promise<Order | null> {
    const model = await this.prisma.order.findFirst({
      where: { checkoutSessionId, tenantId },
      include: { items: true },
    });
    return model ? PrismaOrderMapper.toDomain(model) : null;
  }

  async save(order: Order): Promise<Order> {
    const p = order.toPrimitives();
    const existing = await this.prisma.order.findUnique({ where: { id: p.id } });

    if (existing) {
      await this.prisma.$transaction(async (tx: any) => {
        await tx.orderItem.deleteMany({ where: { orderId: p.id } });
        await tx.order.update({
          where: { id: p.id },
          data: {
            status: p.status, version: p.version, updatedAt: new Date(),
            items: { create: p.items.map(i => ({
              id: i.id, productVariantId: i.productVariantId, sku: i.sku,
              productNameSnapshot: i.productNameSnapshot, variantNameSnapshot: i.variantNameSnapshot,
              quantity: i.quantity, unitPrice: i.unitPrice, subtotal: i.subtotal,
            }))},
          },
        });
      });
    } else {
      await this.prisma.order.create({ data: PrismaOrderMapper.toCreateInput(order) });
    }

    this.logger.debug({ event: 'checkout.repository.order.saved', orderId: p.id, orderNumber: p.orderNumber }, 'Order persisted');
    const saved = await this.findById(new OrderId(p.id), p.tenantId);
    return saved!;
  }
}
