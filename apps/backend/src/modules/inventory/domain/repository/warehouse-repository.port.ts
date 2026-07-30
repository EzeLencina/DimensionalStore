import type { Warehouse } from '../aggregates/warehouse.aggregate';
import type { WarehouseId } from '../value-objects/warehouse-id';

export const WAREHOUSE_REPOSITORY = 'WAREHOUSE_REPOSITORY';

export interface WarehouseRepository {
  save(warehouse: Warehouse): Promise<Warehouse>;
  findById(id: WarehouseId, tenantId: string): Promise<Warehouse | null>;
  findByCode(code: string, tenantId: string): Promise<Warehouse | null>;
  list(tenantId: string): Promise<Warehouse[]>;
  findDefault(tenantId: string): Promise<Warehouse | null>;
  existsByCode(code: string, tenantId: string, excludeId?: string): Promise<boolean>;
}
