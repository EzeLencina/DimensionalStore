export { ProductsModule } from './products.module';

export { Product } from './domain';
export type { ProductPrimitives } from './domain';
export {
  ProductId, ProductName, ProductSlug, ShortDescription,
  ProductDescription, SeoTitle, SeoDescription, WarrantyPeriod,
  ProductStatus, ProductVisibility, ProductCondition, ProductType,
} from './domain';
export type {
  ProductStatusValue, ProductVisibilityValue,
  ProductConditionValue, ProductTypeValue,
} from './domain';
export {
  DomainEvent, ProductCreatedEvent, ProductRenamedEvent,
  ProductActivatedEvent, ProductDeactivatedEvent,
  ProductArchivedEvent, ProductRestoredEvent,
  ProductVisibilityChangedEvent, ProductSeoUpdatedEvent,
  ProductDeletedEvent,
} from './domain';
export { ProductException, PRODUCT_ERROR_CODES } from './domain';
export type { IProductRepository, ProductListParams, ProductListResult } from './domain';
export {
  ProductIsActive, ProductIsPublic, ProductBelongsToTenant,
  ProductCanBePublished, ProductCanBeArchived,
} from './domain';
export type { ISpecification } from './domain';

export type { IProductService } from './application';
export type {
  CreateProductRequestDto, UpdateProductRequestDto,
  ChangeStatusRequestDto, ChangeVisibilityRequestDto,
  ProductResponseDto, ProductListResponseDto,
} from './application';
export {
  CreateProductCommand, UpdateProductCommand,
  ChangeProductStatusCommand, ChangeProductVisibilityCommand,
  ArchiveProductCommand, RestoreProductCommand,
} from './application';
export { ProductValidators } from './application';
export { ProductMapper } from './application';

export { PrismaProductRepository, PrismaProductMapper } from './infrastructure';
export type { ProductPrismaModel } from './infrastructure';

export { ProductAppService } from './services';

export { ProductController } from './presentation';

export { ProductEventHandler } from './events';
export { ProductExceptionFilter } from './exceptions';
export { PRODUCT_PROVIDERS } from './providers';
export {
  validateProductName, validateProductSlug,
  validateProductStatus, validateProductVisibility,
} from './validators';
