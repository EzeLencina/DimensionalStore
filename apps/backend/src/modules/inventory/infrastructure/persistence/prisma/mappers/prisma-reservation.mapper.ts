import type { Prisma } from '@tienda/database';
import { StockReservation, ReservationId } from '../../../../domain';

export type ReservationPrismaModel = Prisma.StockReservationGetPayload<{}>;

export class PrismaReservationMapper {
  static toDomain(model: ReservationPrismaModel): StockReservation {
    return new StockReservation(
      new ReservationId(model.id), model.tenantId, model.warehouseId,
      model.productVariantId, model.quantity, model.referenceType,
      model.referenceId, model.status as any, model.expiresAt,
      model.createdAt, model.updatedAt,
    );
  }

  static toPrisma(r: StockReservation): Prisma.StockReservationCreateInput {
    return {
      id: r.id.toString(), tenantId: r.tenantId, warehouseId: r.warehouseId,
      productVariantId: r.productVariantId, quantity: r.quantity,
      status: r.status as any, referenceType: r.referenceType,
      referenceId: r.referenceId, expiresAt: r.expiresAt,
      createdAt: r.createdAt,
    };
  }

  static toUpdateInput(r: StockReservation): Prisma.StockReservationUpdateInput {
    return { status: r.status as any, updatedAt: r.updatedAt };
  }
}
