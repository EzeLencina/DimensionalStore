import { MovementId } from './movement-id';

export type MovementTypeValue = 'INITIAL' | 'INBOUND' | 'OUTBOUND' | 'ADJUSTMENT_IN' | 'ADJUSTMENT_OUT' | 'RESERVATION' | 'RELEASE' | 'TRANSFER_IN' | 'TRANSFER_OUT';

export class StockMovement {
  constructor(
    public readonly id: MovementId,
    public readonly tenantId: string,
    public readonly warehouseId: string,
    public readonly productVariantId: string,
    public readonly type: MovementTypeValue,
    public readonly quantity: number,
    public readonly previousOnHand: number,
    public readonly resultingOnHand: number,
    public readonly reason: string,
    public readonly createdBy: string,
    public readonly referenceType?: string | null,
    public readonly referenceId?: string | null,
    public readonly metadata?: Record<string, any> | null,
    public readonly createdAt: Date = new Date(),
  ) {}
}
