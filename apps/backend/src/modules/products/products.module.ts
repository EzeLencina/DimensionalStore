import { Module } from '@nestjs/common';
import { PRODUCT_PROVIDERS } from './providers';
import { ProductAppService } from './services';
import { ProductEventHandler } from './events';
import { ProductExceptionFilter } from './exceptions';
import { ProductController } from './presentation/controllers';

@Module({
  controllers: [ProductController],
  providers: [
    ...PRODUCT_PROVIDERS,
    ProductAppService,
    ProductEventHandler,
    ProductExceptionFilter,
  ],
  exports: [
    ProductAppService,
    'IProductService',
  ],
})
export class ProductsModule {}
