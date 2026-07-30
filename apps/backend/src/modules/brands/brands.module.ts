import { Module } from '@nestjs/common';
import { LoggerModule } from '@tienda/logger/nest';
import { PrismaClient } from '@tienda/database';
import { BrandController } from './presentation';
import { BRAND_PROVIDERS } from './providers';
import { BrandAppService } from './services';
import { BrandEventHandler } from './events';

@Module({
  imports: [LoggerModule],
  controllers: [BrandController],
  providers: [
    ...BRAND_PROVIDERS,
    BrandEventHandler,
    {
      provide: PrismaClient,
      useFactory: () => new PrismaClient(),
    },
  ],
  exports: [BrandAppService],
})
export class BrandsModule {}
