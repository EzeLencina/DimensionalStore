export { Warehouse, InventoryItem } from './aggregates';
export type { WarehousePrimitives, InventoryPrimitives } from './aggregates';
export {
  WarehouseId, WarehouseCode, InventoryItemId,
  StockQuantity, ReservationId, MovementId,
  StockMovement, StockReservation,
} from './value-objects';
export type { MovementTypeValue, ReservationStatusValue } from './value-objects';
export {
  InventoryInitializedEvent, StockReceivedEvent, StockDispatchedEvent,
  StockAdjustedEvent, StockReservedEvent, ReservationReleasedEvent,
  ReservationConsumedEvent, StockTransferredEvent, DomainEvent,
} from './events';
export { InventoryException, INVENTORY_ERROR_CODES } from './exceptions';
export {
  WAREHOUSE_REPOSITORY, INVENTORY_REPOSITORY,
  STOCK_MOVEMENT_REPOSITORY, STOCK_RESERVATION_REPOSITORY,
} from './repository';
export type {
  WarehouseRepository, InventoryRepository,
  StockMovementRepository, StockReservationRepository,
} from './repository';
export type { InventoryFilter, PaginatedResult } from './specifics';
