import { Prisma } from '@tienda/database';
import { StockMovement, MovementId } from '../../../../domain';

export type MovementPrismaModel = Prisma.StockMovementGetPayload<{}>;

export class PrismaMovementMapper {
  static toDomain(model: MovementPrismaModel): StockMovement {
    return new StockMovement(
      new MovementId(model.id), model.tenantId, model.warehouseId,
      model.productVariantId, model.type as any, model.quantity,
      model.previousOnHand, model.resultingOnHand, model.reason,
      model.createdBy, model.referenceType, model.referenceId,
      model.metadata as Record<string, any> | null, model.createdAt,
    );
  }

  static toPrisma(m: StockMovement): Prisma.StockMovementCreateInput {
    return {
      id: m.id.toString(), tenantId: m.tenantId, warehouseId: m.warehouseId,
      productVariantId: m.productVariantId, type: m.type as any,
      quantity: m.quantity, previousOnHand: m.previousOnHand,
      resultingOnHand: m.resultingOnHand, reason: m.reason,
      createdBy: m.createdBy, referenceType: m.referenceType ?? null,
      referenceId: m.referenceId ?? null,
      metadata: m.metadata ?? Prisma.DbNull,
      createdAt: m.createdAt,
    };
  }
}
