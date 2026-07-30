import { StockReservation, ReservationId } from '../../../domain';
import type { StockReservationRepository } from '../../../domain/repository';

export class InMemoryReservationRepository implements StockReservationRepository {
  private items: Map<string, StockReservation> = new Map();

  async save(r: StockReservation): Promise<StockReservation> { this.items.set(r.id.toString(), r); return r; }
  async findById(id: ReservationId, tenantId: string): Promise<StockReservation | null> {
    const r = this.items.get(id.getValue());
    return r && r.tenantId === tenantId ? r : null;
  }
  async findByReference(referenceType: string, referenceId: string, productVariantId: string, tenantId: string): Promise<StockReservation | null> {
    for (const r of this.items.values()) {
      if (r.referenceType === referenceType && r.referenceId === referenceId && r.productVariantId === productVariantId && r.tenantId === tenantId) return r;
    }
    return null;
  }
  async listActiveExpired(tenantId: string): Promise<StockReservation[]> {
    const now = new Date();
    return [...this.items.values()].filter(r => r.tenantId === tenantId && r.status === 'ACTIVE' && r.expiresAt !== null && r.expiresAt <= now);
  }
  async listByVariant(productVariantId: string, tenantId: string): Promise<StockReservation[]> {
    return [...this.items.values()].filter(r => r.productVariantId === productVariantId && r.tenantId === tenantId);
  }
  clear(): void { this.items.clear(); }
}
