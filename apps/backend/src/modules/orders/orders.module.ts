import { Module } from '@nestjs/common';
import { LoggerModule } from '@tienda/logger/nest';
import { AdminOrderController, CustomerOrderController } from './presentation';
import { OrderExceptionFilter } from './presentation';
import { ORDER_PROVIDERS } from './providers';
import { OrderEventHandler } from './events';
import { APP_FILTER } from '@nestjs/core';
import { OrderAppService } from './services';

@Module({
  imports: [LoggerModule],
  controllers: [AdminOrderController, CustomerOrderController],
  providers: [
    ...ORDER_PROVIDERS,
    OrderEventHandler,
    {
      provide: APP_FILTER,
      useClass: OrderExceptionFilter,
    },
    {
      provide: 'PRISMA_CLIENT_ORDERS',
      useFactory: () => {
        const { PrismaClient } = require('@tienda/database');
        return new PrismaClient();
      },
    },
    {
      provide: 'INVENTORY_RESERVATION_SERVICE_ORDERS',
      useFactory: () => ({
        releaseReservation: async () => {},
        releaseReservationsByReference: async () => {},
      }),
    },
    {
      provide: 'EVENT_PUBLISHER',
      useFactory: () => ({
        publish: async () => {},
      }),
    },
    {
      provide: 'CLOCK_ORDERS',
      useFactory: () => ({ now: () => new Date() }),
    },
    {
      provide: 'CURRENT_ACTOR',
      useFactory: () => ({ getType: () => 'SYSTEM', getId: () => null }),
    },
  ],
  exports: [OrderAppService],
})
export class OrdersModule {}
