import { Module } from '@nestjs/common';
import { LoggerModule } from '@tienda/logger/nest';
import { CheckoutController } from './presentation';
import { CHECKOUT_PROVIDERS } from './providers';
import { CheckoutEventHandler } from './events';
import { CheckoutAppService } from './services';

@Module({
  imports: [LoggerModule],
  controllers: [CheckoutController],
  providers: [
    ...CHECKOUT_PROVIDERS,
    CheckoutEventHandler,
    {
      provide: 'PRISMA_CLIENT',
      useFactory: () => {
        const { PrismaClient } = require('@tienda/database');
        return new PrismaClient();
      },
    },
    {
      provide: 'CART_READER',
      useFactory: () => ({
        getCart: async () => null,
      }),
    },
    {
      provide: 'PRICING_RESOLVER',
      useFactory: () => ({
        resolveEffectivePrice: async () => ({ amount: 10000, currency: 'ARS' }),
      }),
    },
    {
      provide: 'INVENTORY_RESERVATION_SERVICE',
      useFactory: () => ({
        reserve: async () => {},
        releaseReservation: async () => {},
      }),
    },
    {
      provide: 'PRODUCT_VARIANT_READER',
      useFactory: () => ({
        getVariantName: async () => ({ sku: 'SKU', productName: 'Product', variantName: null }),
      }),
    },
    {
      provide: 'CUSTOMER_READER',
      useFactory: () => ({
        exists: async () => true,
        isActive: async () => true,
        getEmail: async () => 'test@test.com',
      }),
    },
    {
      provide: 'SHIPPING_METHOD_READER',
      useFactory: () => ({
        isValid: async () => true,
        getAmount: async () => 0,
      }),
    },
    {
      provide: 'PAYMENT_METHOD_READER',
      useFactory: () => ({
        isValid: async () => true,
      }),
    },
    {
      provide: 'ORDER_NUMBER_GENERATOR',
      useFactory: () => ({
        generate: async () => 'ORD-2026-000001',
      }),
    },
    {
      provide: 'CLOCK',
      useFactory: () => ({ now: () => new Date() }),
    },
  ],
  exports: [CheckoutAppService],
})
export class CheckoutModule {}
