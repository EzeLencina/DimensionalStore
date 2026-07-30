import { Injectable, Inject } from '@nestjs/common';
import { LOGGER_TOKEN } from '@tienda/logger/nest';
import { PrismaClient } from '@tienda/database';
import { InventoryItem, InventoryItemId, InventoryException, INVENTORY_ERROR_CODES } from '../../../../domain';
import type { InventoryRepository } from '../../../../domain/repository';
import { PrismaInventoryMapper } from '../mappers/prisma-inventory.mapper';

@Injectable()
export class PrismaInventoryRepository implements InventoryRepository {
  constructor(private readonly prisma: PrismaClient, @Inject(LOGGER_TOKEN) private readonly logger: any) {}

  async save(item: InventoryItem): Promise<InventoryItem> {
    const p = item.toPrimitives();
    const existing = await this.prisma.inventoryItem.findUnique({ where: { id: p.id } });
    if (existing) {
      if (existing.version !== p.version) {
        throw new InventoryException(INVENTORY_ERROR_CODES.INVENTORY_VERSION_CONFLICT, `Version conflict: expected ${p.version}, found ${existing.version}`);
      }
      await this.prisma.inventoryItem.update({ where: { id: p.id }, data: PrismaInventoryMapper.toUpdateInput(item) as any });
    } else {
      await this.prisma.inventoryItem.create({ data: PrismaInventoryMapper.toCreateInput(item) as any });
    }
    this.logger.debug({ event: 'inventory.item.saved', sku: p.sku, warehouseId: p.warehouseId }, 'Inventory item persisted');
    return item;
  }

  async findById(id: InventoryItemId, tenantId: string): Promise<InventoryItem | null> {
    const model = await this.prisma.inventoryItem.findUnique({ where: { id: id.getValue() } });
    if (!model || model.tenantId !== tenantId) return null;
    return PrismaInventoryMapper.toDomain(model);
  }

  async findByVariantAndWarehouse(productVariantId: string, warehouseId: string, tenantId: string): Promise<InventoryItem | null> {
    const model = await this.prisma.inventoryItem.findFirst({ where: { productVariantId, warehouseId, tenantId } });
    return model ? PrismaInventoryMapper.toDomain(model) : null;
  }

  async findBySkuAndWarehouse(sku: string, warehouseId: string, tenantId: string): Promise<InventoryItem | null> {
    const model = await this.prisma.inventoryItem.findFirst({ where: { sku, warehouseId, tenantId } });
    return model ? PrismaInventoryMapper.toDomain(model) : null;
  }

  async listByVariant(productVariantId: string, tenantId: string): Promise<InventoryItem[]> {
    const models = await this.prisma.inventoryItem.findMany({ where: { productVariantId, tenantId } });
    return models.map(PrismaInventoryMapper.toDomain);
  }

  async listByWarehouse(warehouseId: string, tenantId: string): Promise<InventoryItem[]> {
    const models = await this.prisma.inventoryItem.findMany({ where: { warehouseId, tenantId } });
    return models.map(PrismaInventoryMapper.toDomain);
  }

  async findBySkuAcrossWarehouses(sku: string, tenantId: string): Promise<InventoryItem[]> {
    const models = await this.prisma.inventoryItem.findMany({ where: { sku, tenantId } });
    return models.map(PrismaInventoryMapper.toDomain);
  }

  async findLowStock(tenantId: string, threshold?: number): Promise<InventoryItem[]> {
    const models = await this.prisma.inventoryItem.findMany({
      where: { tenantId, onHand: { lte: threshold ?? 0 } },
      orderBy: { onHand: 'asc' },
    });
    return models.map(PrismaInventoryMapper.toDomain);
  }

  async existsByVariantAndWarehouse(productVariantId: string, warehouseId: string, tenantId: string): Promise<boolean> {
    const count = await this.prisma.inventoryItem.count({ where: { productVariantId, warehouseId, tenantId } });
    return count > 0;
  }
}
