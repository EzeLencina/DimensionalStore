import { Injectable, Inject } from '@nestjs/common';
import { LOGGER_TOKEN } from '@tienda/logger/nest';
import { PrismaClient } from '@tienda/database';
import { Warehouse, WarehouseId } from '../../../../domain';
import type { WarehouseRepository } from '../../../../domain/repository';
import { PrismaWarehouseMapper } from '../mappers/prisma-warehouse.mapper';

@Injectable()
export class PrismaWarehouseRepository implements WarehouseRepository {
  constructor(private readonly prisma: PrismaClient, @Inject(LOGGER_TOKEN) private readonly logger: any) {}

  async save(warehouse: Warehouse): Promise<Warehouse> {
    const p = warehouse.toPrimitives();
    const existing = await this.prisma.warehouse.findUnique({ where: { id: p.id } });
    if (existing) {
      await this.prisma.warehouse.update({ where: { id: p.id }, data: PrismaWarehouseMapper.toUpdateInput(warehouse) as any });
    } else {
      await this.prisma.warehouse.create({ data: PrismaWarehouseMapper.toCreateInput(warehouse) as any });
    }
    this.logger.debug({ event: 'inventory.warehouse.saved', warehouseId: p.id }, 'Warehouse persisted');
    return warehouse;
  }

  async findById(id: WarehouseId, tenantId: string): Promise<Warehouse | null> {
    const model = await this.prisma.warehouse.findUnique({ where: { id: id.getValue() } });
    if (!model || model.tenantId !== tenantId) return null;
    return PrismaWarehouseMapper.toDomain(model);
  }

  async findByCode(code: string, tenantId: string): Promise<Warehouse | null> {
    const model = await this.prisma.warehouse.findFirst({ where: { code, tenantId } });
    return model ? PrismaWarehouseMapper.toDomain(model) : null;
  }

  async list(tenantId: string): Promise<Warehouse[]> {
    const models = await this.prisma.warehouse.findMany({ where: { tenantId }, orderBy: { name: 'asc' } });
    return models.map(PrismaWarehouseMapper.toDomain);
  }

  async findDefault(tenantId: string): Promise<Warehouse | null> {
    const model = await this.prisma.warehouse.findFirst({ where: { tenantId, isDefault: true, deletedAt: null } });
    return model ? PrismaWarehouseMapper.toDomain(model) : null;
  }

  async existsByCode(code: string, tenantId: string, excludeId?: string): Promise<boolean> {
    const where: any = { code, tenantId };
    if (excludeId) where.id = { not: excludeId };
    const count = await this.prisma.warehouse.count({ where });
    return count > 0;
  }
}
