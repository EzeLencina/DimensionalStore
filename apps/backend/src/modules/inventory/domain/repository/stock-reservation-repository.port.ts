import type { StockReservation } from '../value-objects/stock-reservation.vo';
import type { ReservationId } from '../value-objects/reservation-id';

export const STOCK_RESERVATION_REPOSITORY = 'STOCK_RESERVATION_REPOSITORY';

export interface StockReservationRepository {
  save(reservation: StockReservation): Promise<StockReservation>;
  findById(id: ReservationId, tenantId: string): Promise<StockReservation | null>;
  findByReference(referenceType: string, referenceId: string, productVariantId: string, tenantId: string): Promise<StockReservation | null>;
  listActiveExpired(tenantId: string): Promise<StockReservation[]>;
  listByVariant(productVariantId: string, tenantId: string): Promise<StockReservation[]>;
}
