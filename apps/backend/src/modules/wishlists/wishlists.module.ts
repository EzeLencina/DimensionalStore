import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { LoggerModule } from '@tienda/logger/nest';
import { PrismaClient } from '@tienda/database';
import { AccountWishlistController, GuestWishlistController } from './presentation';
import { WishlistExceptionFilter } from './presentation/interceptors';
import { WISHLIST_PROVIDERS } from './providers';
import { WishlistEventHandler } from './events';
import { WishlistAppService } from './services';

@Module({
  imports: [LoggerModule],
  controllers: [AccountWishlistController, GuestWishlistController],
  providers: [
    ...WISHLIST_PROVIDERS,
    WishlistEventHandler,
    { provide: APP_FILTER, useClass: WishlistExceptionFilter },
    { provide: 'PRISMA_CLIENT_WISHLISTS', useFactory: () => new PrismaClient() },
    { provide: 'PRODUCT_READER', useFactory: () => ({ getProduct: async () => null }) },
    { provide: 'PRODUCT_VARIANT_READER', useFactory: () => ({ getVariant: async () => null, getVariantsByProduct: async () => [] }) },
    { provide: 'PRICING_RESOLVER', useFactory: () => ({ resolveEffectivePrice: async () => ({ amount: 0, currency: 'ARS' }) }) },
    { provide: 'INVENTORY_AVAILABILITY_READER', useFactory: () => ({ getAvailableStock: async () => 0 }) },
    { provide: 'CART_SERVICE', useFactory: () => ({ addItem: async () => ({ cartId: 'cart-1' }) }) },
    { provide: 'CUSTOMER_READER', useFactory: () => ({ exists: async () => true, isActive: async () => true }) },
    { provide: 'CLOCK_WISHLISTS', useFactory: () => ({ now: () => new Date() }) },
    { provide: 'CURRENT_ACTOR_WISHLISTS', useFactory: () => ({ getType: () => 'SYSTEM', getId: () => null }) },
  ],
  exports: [WishlistAppService],
})
export class WishlistsModule {}
