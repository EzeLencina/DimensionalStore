import { Provider } from '@nestjs/common';
import { CATEGORY_REPOSITORY, COLLECTION_REPOSITORY } from '../domain/repository';
import type { CategoryRepository, CollectionRepository } from '../domain/repository';
import { PrismaCategoryRepository, PrismaCollectionRepository } from '../infrastructure';
import { CategoryAppService } from '../services/category-app.service';
import { CollectionAppService } from '../services/collection-app.service';

export const CategoryRepositoryProvider: Provider<CategoryRepository> = {
  provide: CATEGORY_REPOSITORY,
  useClass: PrismaCategoryRepository,
};

export const CollectionRepositoryProvider: Provider<CollectionRepository> = {
  provide: COLLECTION_REPOSITORY,
  useClass: PrismaCollectionRepository,
};

export const CATALOG_PROVIDERS: Provider[] = [
  CategoryRepositoryProvider,
  CollectionRepositoryProvider,
  CategoryAppService,
  CollectionAppService,
];
