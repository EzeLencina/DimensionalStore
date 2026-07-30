import { Module } from '@nestjs/common';
import { LoggerModule } from '@tienda/logger/nest';
import { PrismaClient } from '@tienda/database';
import { WarehouseController, InventoryController } from './presentation';
import { INVENTORY_PROVIDERS } from './providers';
import { WarehouseAppService, InventoryAppService } from './services';
import { InventoryEventHandler } from './events';

@Module({
  imports: [LoggerModule],
  controllers: [WarehouseController, InventoryController],
  providers: [
    ...INVENTORY_PROVIDERS,
    InventoryEventHandler,
    { provide: PrismaClient, useFactory: () => new PrismaClient() },
  ],
  exports: [WarehouseAppService, InventoryAppService],
})
export class InventoryModule {}
