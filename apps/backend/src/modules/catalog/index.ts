export { CatalogModule } from './catalog.module';

export { Category, Collection } from './domain';
export type { CategoryPrimitives, CollectionPrimitives } from './domain';
export {
  CategoryId, CategoryName, CollectionId, Slug,
  Description, ShortDescription, DisplayOrder, Url,
  SeoTitle, SeoDescription, CatalogStatus, CatalogVisibility, CollectionType,
} from './domain';
export type {
  CatalogStatusValue, CatalogVisibilityValue, CollectionTypeValue,
} from './domain';
export {
  DomainEvent,
  CategoryCreatedEvent, CategoryRenamedEvent, CategoryMovedEvent,
  CategoryActivatedEvent, CategoryDeactivatedEvent,
  CategoryArchivedEvent, CategoryRestoredEvent,
  CategoryVisibilityChangedEvent, CategorySeoUpdatedEvent, CategoryDeletedEvent,
  CollectionCreatedEvent, CollectionRenamedEvent,
  CollectionActivatedEvent, CollectionDeactivatedEvent,
  CollectionArchivedEvent, CollectionRestoredEvent,
  CollectionVisibilityChangedEvent, CollectionSeoUpdatedEvent,
  CollectionTypeChangedEvent, CollectionDeletedEvent,
} from './domain';
export { CatalogException, CATALOG_ERROR_CODES } from './domain';
export { CATEGORY_REPOSITORY, COLLECTION_REPOSITORY } from './domain';
export type { CategoryRepository, CollectionRepository } from './domain';
export type {
  CategoryFilter, CollectionFilter, CategorySort, CollectionSort, PaginatedResult,
} from './domain';

export type {
  CreateCategoryDto, UpdateCategoryDto, CategoryResponseDto, CategoryTreeDto,
  CategoryListQueryDto, PaginatedCategoryResponseDto,
  CreateCollectionDto, UpdateCollectionDto, CollectionResponseDto,
  CollectionListQueryDto, PaginatedCollectionResponseDto,
} from './application';

export {
  CreateCategoryCommand, UpdateCategoryCommand,
  ArchiveCategoryCommand, RestoreCategoryCommand,
  ChangeCategoryStatusCommand, ChangeCategoryVisibilityCommand, DeleteCategoryCommand,
  CreateCollectionCommand, UpdateCollectionCommand,
  ArchiveCollectionCommand, RestoreCollectionCommand,
  ChangeCollectionStatusCommand, ChangeCollectionVisibilityCommand, DeleteCollectionCommand,
} from './application';

export { CategoryMapper, CollectionMapper } from './application';
export { CategoryValidator, CollectionValidator } from './application';

export {
  PrismaCategoryRepository, PrismaCollectionRepository,
  PrismaCategoryMapper, PrismaCollectionMapper,
  InMemoryCategoryRepository, InMemoryCollectionRepository,
} from './infrastructure';
export type { CategoryPrismaModel, CollectionPrismaModel } from './infrastructure';

export { CategoryAppService, CollectionAppService } from './services';

export { CategoryController, CollectionController } from './presentation';
export { CatalogExceptionFilter } from './presentation';

export { CatalogEventHandler } from './events';
export { CATALOG_PROVIDERS } from './providers';
export { CATALOG_PERMISSIONS } from './constants';
