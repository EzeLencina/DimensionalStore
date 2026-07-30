export { InventoryModule } from './inventory.module';
export { WarehouseAppService, InventoryAppService } from './services';
export { INVENTORY_PROVIDERS } from './providers';
export { INVENTORY_PERMISSIONS } from './constants';

export {
  Warehouse, InventoryItem,
  WarehouseId, WarehouseCode, InventoryItemId,
  StockQuantity, ReservationId, MovementId,
  StockMovement, StockReservation,
  InventoryException, INVENTORY_ERROR_CODES,
} from './domain';

export type {
  WarehouseRepository, InventoryRepository,
  StockMovementRepository, StockReservationRepository,
  WarehouseResponseDto, InventoryItemResponseDto,
  StockMovementResponseDto, StockReservationResponseDto,
  PaginatedResponseDto,
} from './types';

export {
  PrismaWarehouseRepository,
  PrismaInventoryRepository,
  PrismaMovementRepository,
  PrismaReservationRepository,
  InMemoryWarehouseRepository,
  InMemoryInventoryRepository,
  InMemoryMovementRepository,
  InMemoryReservationRepository,
} from './infrastructure';
