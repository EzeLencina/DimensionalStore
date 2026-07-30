import { StockMovement } from '../../../domain';
import type { StockMovementRepository } from '../../../domain/repository';

export class InMemoryMovementRepository implements StockMovementRepository {
  private items: StockMovement[] = [];

  async append(m: StockMovement): Promise<StockMovement> { this.items.push(m); return m; }
  async listByVariant(productVariantId: string, tenantId: string, limit = 50, offset = 0): Promise<{ data: StockMovement[]; total: number }> {
    const filtered = this.items.filter(m => m.productVariantId === productVariantId && m.tenantId === tenantId).reverse();
    return { data: filtered.slice(offset, offset + limit), total: filtered.length };
  }
  async listByWarehouse(warehouseId: string, tenantId: string, limit = 50, offset = 0): Promise<{ data: StockMovement[]; total: number }> {
    const filtered = this.items.filter(m => m.warehouseId === warehouseId && m.tenantId === tenantId).reverse();
    return { data: filtered.slice(offset, offset + limit), total: filtered.length };
  }
  async listByReference(referenceType: string, referenceId: string, tenantId: string): Promise<StockMovement[]> {
    return this.items.filter(m => m.referenceType === referenceType && m.referenceId === referenceId && m.tenantId === tenantId);
  }
  clear(): void { this.items = []; }
}
