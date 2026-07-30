import { Warehouse, WarehouseId } from '../../../domain';
import type { WarehouseRepository } from '../../../domain/repository';

export class InMemoryWarehouseRepository implements WarehouseRepository {
  private items: Map<string, Warehouse> = new Map();

  async save(w: Warehouse): Promise<Warehouse> { this.items.set(w.getId().toString(), w); return w; }
  async findById(id: WarehouseId, tenantId: string): Promise<Warehouse | null> {
    const w = this.items.get(id.getValue());
    return w && w.getTenantId() === tenantId ? w : null;
  }
  async findByCode(code: string, tenantId: string): Promise<Warehouse | null> {
    for (const w of this.items.values()) { if (w.getTenantId() === tenantId && w.getCode().toString() === code) return w; }
    return null;
  }
  async list(tenantId: string): Promise<Warehouse[]> {
    return [...this.items.values()].filter(w => w.getTenantId() === tenantId);
  }
  async findDefault(tenantId: string): Promise<Warehouse | null> {
    for (const w of this.items.values()) { if (w.getTenantId() === tenantId && w.getIsDefault() && !w.hasBeenDeleted()) return w; }
    return null;
  }
  async existsByCode(code: string, tenantId: string, excludeId?: string): Promise<boolean> {
    const found = await this.findByCode(code, tenantId);
    if (!found) return false;
    return excludeId ? found.getId().toString() !== excludeId : true;
  }
  clear(): void { this.items.clear(); }
  seed(warehouses: Warehouse[]): void { for (const w of warehouses) this.items.set(w.getId().toString(), w); }
}
