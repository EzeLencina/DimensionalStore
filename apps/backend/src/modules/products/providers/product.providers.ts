import { Provider } from '@nestjs/common';
import type { IProductService } from '../application/interfaces';
import type { IProductRepository } from '../domain';
import { ProductAppService } from '../services';
import { PrismaProductRepository } from '../infrastructure';

export const ProductServiceProvider: Provider<IProductService> = {
  provide: 'IProductService',
  useClass: ProductAppService,
};

export const ProductRepositoryProvider: Provider<IProductRepository> = {
  provide: 'IProductRepository',
  useClass: PrismaProductRepository,
};

export const PRODUCT_PROVIDERS: Provider[] = [
  ProductServiceProvider,
  ProductRepositoryProvider,
];
