import { Injectable, Inject } from '@nestjs/common';
import { LOGGER_TOKEN } from '@tienda/logger/nest';
import { PrismaClient } from '@tienda/database';
import { StockMovement } from '../../../../domain';
import type { StockMovementRepository } from '../../../../domain/repository';
import { PrismaMovementMapper } from '../mappers/prisma-movement.mapper';

@Injectable()
export class PrismaMovementRepository implements StockMovementRepository {
  constructor(private readonly prisma: PrismaClient, @Inject(LOGGER_TOKEN) private readonly logger: any) {}

  async append(movement: StockMovement): Promise<StockMovement> {
    await this.prisma.stockMovement.create({ data: PrismaMovementMapper.toPrisma(movement) as any });
    this.logger.debug({ event: 'inventory.movement.appended', type: movement.type, sku: movement.productVariantId, warehouseId: movement.warehouseId }, 'Movement appended');
    return movement;
  }

  async listByVariant(productVariantId: string, tenantId: string, limit = 50, offset = 0): Promise<{ data: StockMovement[]; total: number }> {
    const where = { productVariantId, tenantId };
    const [items, total] = await Promise.all([
      this.prisma.stockMovement.findMany({ where, orderBy: { createdAt: 'desc' }, skip: offset, take: limit }),
      this.prisma.stockMovement.count({ where }),
    ]);
    return { data: items.map(PrismaMovementMapper.toDomain), total };
  }

  async listByWarehouse(warehouseId: string, tenantId: string, limit = 50, offset = 0): Promise<{ data: StockMovement[]; total: number }> {
    const where = { warehouseId, tenantId };
    const [items, total] = await Promise.all([
      this.prisma.stockMovement.findMany({ where, orderBy: { createdAt: 'desc' }, skip: offset, take: limit }),
      this.prisma.stockMovement.count({ where }),
    ]);
    return { data: items.map(PrismaMovementMapper.toDomain), total };
  }

  async listByReference(referenceType: string, referenceId: string, tenantId: string): Promise<StockMovement[]> {
    const items = await this.prisma.stockMovement.findMany({ where: { referenceType, referenceId, tenantId }, orderBy: { createdAt: 'desc' } });
    return items.map(PrismaMovementMapper.toDomain);
  }
}
