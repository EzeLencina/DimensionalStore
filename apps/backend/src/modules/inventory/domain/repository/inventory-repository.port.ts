import type { InventoryItem } from '../aggregates/inventory-item.aggregate';
import type { InventoryItemId } from '../value-objects/inventory-item-id';

export const INVENTORY_REPOSITORY = 'INVENTORY_REPOSITORY';

export interface InventoryRepository {
  save(item: InventoryItem): Promise<InventoryItem>;
  findById(id: InventoryItemId, tenantId: string): Promise<InventoryItem | null>;
  findByVariantAndWarehouse(productVariantId: string, warehouseId: string, tenantId: string): Promise<InventoryItem | null>;
  findBySkuAndWarehouse(sku: string, warehouseId: string, tenantId: string): Promise<InventoryItem | null>;
  listByVariant(productVariantId: string, tenantId: string): Promise<InventoryItem[]>;
  listByWarehouse(warehouseId: string, tenantId: string): Promise<InventoryItem[]>;
  findBySkuAcrossWarehouses(sku: string, tenantId: string): Promise<InventoryItem[]>;
  findLowStock(tenantId: string, threshold?: number): Promise<InventoryItem[]>;
  existsByVariantAndWarehouse(productVariantId: string, warehouseId: string, tenantId: string): Promise<boolean>;
}
