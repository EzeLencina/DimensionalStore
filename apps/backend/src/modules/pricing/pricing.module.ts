import { Module } from '@nestjs/common';
import { LoggerModule } from '@tienda/logger/nest';
import { PrismaClient } from '@tienda/database';
import { PriceListController, VariantPriceController } from './presentation';
import { PRICING_PROVIDERS } from './providers';
import { PricingEventHandler } from './events';

@Module({
  imports: [LoggerModule],
  controllers: [PriceListController, VariantPriceController],
  providers: [
    ...PRICING_PROVIDERS,
    PricingEventHandler,
    { provide: PrismaClient, useFactory: () => new PrismaClient() },
  ],
  exports: [...PRICING_PROVIDERS.map(p => (p as any).provide || p).filter(Boolean)],
})
export class PricingModule {}
