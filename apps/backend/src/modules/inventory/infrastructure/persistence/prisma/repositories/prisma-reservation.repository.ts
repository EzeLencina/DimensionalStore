import { Injectable, Inject } from '@nestjs/common';
import { LOGGER_TOKEN } from '@tienda/logger/nest';
import { PrismaClient } from '@tienda/database';
import { StockReservation, ReservationId } from '../../../../domain';
import type { StockReservationRepository } from '../../../../domain/repository';
import { PrismaReservationMapper } from '../mappers/prisma-reservation.mapper';

@Injectable()
export class PrismaReservationRepository implements StockReservationRepository {
  constructor(private readonly prisma: PrismaClient, @Inject(LOGGER_TOKEN) private readonly logger: any) {}

  async save(reservation: StockReservation): Promise<StockReservation> {
    const existing = await this.prisma.stockReservation.findUnique({ where: { id: reservation.id.toString() } });
    if (existing) {
      await this.prisma.stockReservation.update({ where: { id: reservation.id.toString() }, data: PrismaReservationMapper.toUpdateInput(reservation) as any });
    } else {
      await this.prisma.stockReservation.create({ data: PrismaReservationMapper.toPrisma(reservation) as any });
    }
    this.logger.debug({ event: 'inventory.reservation.saved', id: reservation.id.toString(), status: reservation.status }, 'Reservation persisted');
    return reservation;
  }

  async findById(id: ReservationId, tenantId: string): Promise<StockReservation | null> {
    const model = await this.prisma.stockReservation.findUnique({ where: { id: id.getValue() } });
    if (!model || model.tenantId !== tenantId) return null;
    return PrismaReservationMapper.toDomain(model);
  }

  async findByReference(referenceType: string, referenceId: string, productVariantId: string, tenantId: string): Promise<StockReservation | null> {
    const model = await this.prisma.stockReservation.findFirst({ where: { referenceType, referenceId, productVariantId, tenantId } });
    return model ? PrismaReservationMapper.toDomain(model) : null;
  }

  async listActiveExpired(tenantId: string): Promise<StockReservation[]> {
    const now = new Date();
    const models = await this.prisma.stockReservation.findMany({ where: { tenantId, status: 'ACTIVE', expiresAt: { lte: now } } });
    return models.map(PrismaReservationMapper.toDomain);
  }

  async listByVariant(productVariantId: string, tenantId: string): Promise<StockReservation[]> {
    const models = await this.prisma.stockReservation.findMany({ where: { productVariantId, tenantId }, orderBy: { createdAt: 'desc' } });
    return models.map(PrismaReservationMapper.toDomain);
  }
}
