export { BrandsModule } from './brands.module';
export { BrandController } from './presentation';
export { BrandAppService } from './services';
export { BRAND_PROVIDERS } from './providers';
export {
  Brand,
  BrandId,
  BrandName,
  Slug,
  Description,
  Url,
  SeoTitle,
  SeoDescription,
  BrandStatus,
  BrandVisibility,
  DomainEvent,
  BrandCreatedEvent,
  BrandRenamedEvent,
  BrandActivatedEvent,
  BrandDeactivatedEvent,
  BrandArchivedEvent,
  BrandRestoredEvent,
  BrandVisibilityChangedEvent,
  BrandSeoUpdatedEvent,
  BrandDeletedEvent,
  BrandException,
  BRAND_ERROR_CODES,
} from './domain';

export type {
  BrandPrimitives,
  BrandRepository,
  BrandFilter,
  BrandSort,
  PaginatedResult,
  CreateBrandCommand,
  UpdateBrandCommand,
  BrandResponseDto,
  BrandListQueryDto,
  PaginatedBrandResponseDto,
} from './types';

export {
  PrismaBrandRepository,
  InMemoryBrandRepository,
  PrismaBrandMapper,
} from './infrastructure';

export type { BrandPrismaModel } from './infrastructure';
export { BrandEventHandler } from './events';
