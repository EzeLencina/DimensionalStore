import { Provider } from '@nestjs/common';
import { WAREHOUSE_REPOSITORY, INVENTORY_REPOSITORY, STOCK_MOVEMENT_REPOSITORY, STOCK_RESERVATION_REPOSITORY } from '../domain/repository';
import { PrismaWarehouseRepository, PrismaInventoryRepository, PrismaMovementRepository, PrismaReservationRepository } from '../infrastructure';
import { WarehouseAppService, InventoryAppService } from '../services';

export const INVENTORY_PROVIDERS: Provider[] = [
  { provide: WAREHOUSE_REPOSITORY, useClass: PrismaWarehouseRepository },
  { provide: INVENTORY_REPOSITORY, useClass: PrismaInventoryRepository },
  { provide: STOCK_MOVEMENT_REPOSITORY, useClass: PrismaMovementRepository },
  { provide: STOCK_RESERVATION_REPOSITORY, useClass: PrismaReservationRepository },
  WarehouseAppService,
  InventoryAppService,
];
