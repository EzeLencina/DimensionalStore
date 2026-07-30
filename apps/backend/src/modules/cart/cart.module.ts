import { Module } from '@nestjs/common';
import { LoggerModule } from '@tienda/logger/nest';
import { PrismaClient } from '@tienda/database';
import { CartController } from './presentation';
import { CART_PROVIDERS } from './providers';
import { CartEventHandler } from './events';
import { CartAppService } from './services';

@Module({
  imports: [LoggerModule],
  controllers: [CartController],
  providers: [
    ...CART_PROVIDERS,
    CartEventHandler,
    { provide: PrismaClient, useFactory: () => new PrismaClient() },
    {
      provide: 'PRODUCT_VARIANT_READER',
      useFactory: () => ({
        isActive: async () => true,
        getSku: async () => 'SKU-TEST',
      }),
    },
    {
      provide: 'PRICING_RESOLVER',
      useFactory: () => ({
        resolveEffectivePrice: async () => ({ effectiveAmount: 10000, currency: 'ARS' }),
      }),
    },
    {
      provide: 'INVENTORY_AVAILABILITY_READER',
      useFactory: () => ({
        getAvailableStock: async () => 100,
      }),
    },
    {
      provide: 'CLOCK',
      useFactory: () => ({
        now: () => new Date(),
      }),
    },
  ],
  exports: [CartAppService],
})
export class CartModule {}
