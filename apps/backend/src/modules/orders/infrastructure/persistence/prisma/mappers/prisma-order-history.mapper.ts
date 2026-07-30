import { OrderStatusHistory } from '../../../../domain';

export class PrismaOrderHistoryMapper {
  static toDomain(raw: any): OrderStatusHistory {
    return OrderStatusHistory.fromPrimitives({
      id: raw.id,
      tenantId: raw.tenantId,
      orderId: raw.orderId,
      fromStatus: raw.fromStatus,
      toStatus: raw.toStatus,
      reason: raw.reason,
      metadata: raw.metadata,
      changedByType: raw.changedByType,
      changedById: raw.changedById,
      createdAt: raw.createdAt,
    });
  }

  static toPrisma(entry: OrderStatusHistory): any {
    const p = entry.toPrimitives();
    return {
      id: p.id,
      tenantId: p.tenantId,
      orderId: p.orderId,
      fromStatus: p.fromStatus,
      toStatus: p.toStatus,
      reason: p.reason,
      metadata: p.metadata,
      changedByType: p.changedByType,
      changedById: p.changedById,
    };
  }
}
