import { Injectable, Inject } from '@nestjs/common';
import { LOGGER_TOKEN } from '@tienda/logger/nest';

@Injectable()
export class InventoryEventHandler {
  constructor(@Inject(LOGGER_TOKEN) private readonly logger: any) {}

  handleStockReceived(event: { sku: string; warehouseId: string; quantity: number; tenantId: string }): void {
    this.logger.info({ event: 'inventory.event.stock_received', ...event }, 'Stock received event');
  }

  handleStockDispatched(event: { sku: string; warehouseId: string; quantity: number; tenantId: string }): void {
    this.logger.info({ event: 'inventory.event.stock_dispatched', ...event }, 'Stock dispatched event');
  }

  handleLowStock(event: { sku: string; warehouseId: string; onHand: number; minimumStock: number; tenantId: string }): void {
    this.logger.warn({ event: 'inventory.event.low_stock', ...event }, 'Low stock alert');
  }
}
