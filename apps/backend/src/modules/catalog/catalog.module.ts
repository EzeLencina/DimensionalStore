import { Module } from '@nestjs/common';
import { CATALOG_PROVIDERS } from './providers';
import { CategoryAppService, CollectionAppService } from './services';
import { CatalogEventHandler } from './events';
import { CatalogExceptionFilter } from './presentation';
import { CategoryController, CollectionController } from './presentation';

@Module({
  controllers: [CategoryController, CollectionController],
  providers: [
    ...CATALOG_PROVIDERS,
    CatalogEventHandler,
    CatalogExceptionFilter,
  ],
  exports: [
    CategoryAppService,
    CollectionAppService,
  ],
})
export class CatalogModule {}
