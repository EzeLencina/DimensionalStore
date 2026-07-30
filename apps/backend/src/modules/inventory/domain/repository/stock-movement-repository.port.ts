import type { StockMovement } from '../value-objects/stock-movement.vo';

export const STOCK_MOVEMENT_REPOSITORY = 'STOCK_MOVEMENT_REPOSITORY';

export interface StockMovementRepository {
  append(movement: StockMovement): Promise<StockMovement>;
  listByVariant(productVariantId: string, tenantId: string, limit?: number, offset?: number): Promise<{ data: StockMovement[]; total: number }>;
  listByWarehouse(warehouseId: string, tenantId: string, limit?: number, offset?: number): Promise<{ data: StockMovement[]; total: number }>;
  listByReference(referenceType: string, referenceId: string, tenantId: string): Promise<StockMovement[]>;
}
