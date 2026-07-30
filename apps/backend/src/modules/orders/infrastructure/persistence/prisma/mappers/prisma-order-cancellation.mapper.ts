import { OrderCancellation } from '../../../../domain';

export class PrismaOrderCancellationMapper {
  static toDomain(raw: any): OrderCancellation {
    return OrderCancellation.fromPrimitives({
      id: raw.id,
      tenantId: raw.tenantId,
      orderId: raw.orderId,
      type: raw.type,
      reasonCode: raw.reasonCode,
      reasonText: raw.reasonText,
      status: raw.status,
      requestedByType: raw.requestedByType,
      requestedById: raw.requestedById,
      approvedBy: raw.approvedBy,
      requestedAt: raw.requestedAt,
      approvedAt: raw.approvedAt,
      completedAt: raw.completedAt,
      metadata: raw.metadata,
    });
  }

  static toPrisma(cancellation: OrderCancellation): any {
    const p = cancellation.toPrimitives();
    return {
      id: p.id,
      tenantId: p.tenantId,
      orderId: p.orderId,
      type: p.type,
      reasonCode: p.reasonCode,
      reasonText: p.reasonText,
      status: p.status,
      requestedByType: p.requestedByType,
      requestedById: p.requestedById,
      approvedBy: p.approvedBy,
      completedAt: p.completedAt,
      metadata: p.metadata,
    };
  }
}
