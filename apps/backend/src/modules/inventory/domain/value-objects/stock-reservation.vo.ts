import { ReservationId } from './reservation-id';

export type ReservationStatusValue = 'ACTIVE' | 'RELEASED' | 'CONSUMED' | 'EXPIRED' | 'CANCELLED';

const VALID_STATUSES: readonly ReservationStatusValue[] = ['ACTIVE', 'RELEASED', 'CONSUMED', 'EXPIRED', 'CANCELLED'];

export class StockReservation {
  constructor(
    public readonly id: ReservationId,
    public readonly tenantId: string,
    public readonly warehouseId: string,
    public readonly productVariantId: string,
    public readonly quantity: number,
    public readonly referenceType: string,
    public readonly referenceId: string,
    public readonly status: ReservationStatusValue = 'ACTIVE',
    public readonly expiresAt: Date | null = null,
    public readonly createdAt: Date = new Date(),
    public readonly updatedAt: Date = new Date(),
  ) {}

  isActive(): boolean { return this.status === 'ACTIVE'; }
  isExpired(): boolean { return this.status === 'EXPIRED'; }
  isConsumed(): boolean { return this.status === 'CONSUMED'; }

  hasExpired(): boolean {
    if (!this.expiresAt) return false;
    return new Date() > this.expiresAt;
  }

  static create(params: {
    tenantId: string; warehouseId: string; productVariantId: string;
    quantity: number; referenceType: string; referenceId: string;
    expiresAt?: Date | null;
  }): StockReservation {
    return new StockReservation(
      new ReservationId(), params.tenantId, params.warehouseId,
      params.productVariantId, params.quantity, params.referenceType,
      params.referenceId, 'ACTIVE', params.expiresAt ?? null,
    );
  }

  release(): StockReservation {
    return new StockReservation(this.id, this.tenantId, this.warehouseId, this.productVariantId, this.quantity, this.referenceType, this.referenceId, 'RELEASED', this.expiresAt, this.createdAt, new Date());
  }

  consume(): StockReservation {
    return new StockReservation(this.id, this.tenantId, this.warehouseId, this.productVariantId, this.quantity, this.referenceType, this.referenceId, 'CONSUMED', this.expiresAt, this.createdAt, new Date());
  }

  expire(): StockReservation {
    return new StockReservation(this.id, this.tenantId, this.warehouseId, this.productVariantId, this.quantity, this.referenceType, this.referenceId, 'EXPIRED', this.expiresAt, this.createdAt, new Date());
  }

  cancel(): StockReservation {
    return new StockReservation(this.id, this.tenantId, this.warehouseId, this.productVariantId, this.quantity, this.referenceType, this.referenceId, 'CANCELLED', this.expiresAt, this.createdAt, new Date());
  }
}
