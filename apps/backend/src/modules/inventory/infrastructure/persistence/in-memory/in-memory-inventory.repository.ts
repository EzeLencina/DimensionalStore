import { InventoryItem, InventoryItemId } from '../../../domain';
import type { InventoryRepository } from '../../../domain/repository';

export class InMemoryInventoryRepository implements InventoryRepository {
  private items: Map<string, InventoryItem> = new Map();

  async save(item: InventoryItem): Promise<InventoryItem> { this.items.set(item.getId().toString(), item); return item; }
  async findById(id: InventoryItemId, _tenantId: string): Promise<InventoryItem | null> {
    const item = this.items.get(id.getValue());
    return item && item.getTenantId() === _tenantId ? item : null;
  }
  async findByVariantAndWarehouse(productVariantId: string, warehouseId: string, tenantId: string): Promise<InventoryItem | null> {
    for (const item of this.items.values()) {
      if (item.getProductVariantId() === productVariantId && item.getWarehouseId() === warehouseId && item.getTenantId() === tenantId) return item;
    }
    return null;
  }
  async findBySkuAndWarehouse(sku: string, warehouseId: string, tenantId: string): Promise<InventoryItem | null> {
    for (const item of this.items.values()) {
      if (item.getSku() === sku && item.getWarehouseId() === warehouseId && item.getTenantId() === tenantId) return item;
    }
    return null;
  }
  async listByVariant(productVariantId: string, tenantId: string): Promise<InventoryItem[]> {
    return [...this.items.values()].filter(i => i.getProductVariantId() === productVariantId && i.getTenantId() === tenantId);
  }
  async listByWarehouse(warehouseId: string, tenantId: string): Promise<InventoryItem[]> {
    return [...this.items.values()].filter(i => i.getWarehouseId() === warehouseId && i.getTenantId() === tenantId);
  }
  async findBySkuAcrossWarehouses(sku: string, tenantId: string): Promise<InventoryItem[]> {
    return [...this.items.values()].filter(i => i.getSku() === sku && i.getTenantId() === tenantId);
  }
  async findLowStock(tenantId: string, threshold?: number): Promise<InventoryItem[]> {
    return [...this.items.values()].filter(i => i.getTenantId() === tenantId && i.getOnHand() <= (threshold ?? i.getMinimumStock()));
  }
  async existsByVariantAndWarehouse(productVariantId: string, warehouseId: string, tenantId: string): Promise<boolean> {
    const found = await this.findByVariantAndWarehouse(productVariantId, warehouseId, tenantId);
    return found !== null;
  }
  clear(): void { this.items.clear(); }
  seed(items: InventoryItem[]): void { for (const i of items) this.items.set(i.getId().toString(), i); }
}
