import type { Prisma } from '@tienda/database';
import { InventoryItem } from '../../../../domain';

export type InventoryPrismaModel = Prisma.InventoryItemGetPayload<{}>;

export class PrismaInventoryMapper {
  static toDomain(model: InventoryPrismaModel): InventoryItem {
    return InventoryItem.fromPrimitives({
      id: model.id, tenantId: model.tenantId,
      warehouseId: model.warehouseId, productVariantId: model.productVariantId,
      sku: model.sku, onHand: model.onHand, reserved: model.reserved,
      available: model.available, minimumStock: model.minimumStock,
      version: model.version, createdAt: model.createdAt, updatedAt: model.updatedAt,
    } as any);
  }

  static toCreateInput(item: InventoryItem): Prisma.InventoryItemCreateInput {
    const p = item.toPrimitives();
    return {
      id: p.id, tenantId: p.tenantId, warehouseId: p.warehouseId,
      productVariantId: p.productVariantId, sku: p.sku,
      onHand: p.onHand, reserved: p.reserved, available: item.getAvailable(),
      minimumStock: p.minimumStock, createdAt: p.createdAt,
    };
  }

  static toUpdateInput(item: InventoryItem): Prisma.InventoryItemUpdateInput {
    const p = item.toPrimitives();
    return {
      onHand: p.onHand, reserved: p.reserved, available: item.getAvailable(),
      minimumStock: p.minimumStock, updatedAt: p.updatedAt, version: p.version,
    };
  }
}
