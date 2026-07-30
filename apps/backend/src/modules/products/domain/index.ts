export { Product } from './aggregates/product.aggregate';
export type { ProductPrimitives } from './aggregates/product.aggregate';

export {
  ProductId, ProductName, ProductSlug, ShortDescription,
  ProductDescription, SeoTitle, SeoDescription, WarrantyPeriod,
  ProductStatus, ProductVisibility, ProductCondition, ProductType,
} from './value-objects';
export type {
  ProductStatusValue, ProductVisibilityValue,
  ProductConditionValue, ProductTypeValue,
} from './value-objects';

export {
  DomainEvent, ProductCreatedEvent, ProductRenamedEvent,
  ProductActivatedEvent, ProductDeactivatedEvent,
  ProductArchivedEvent, ProductRestoredEvent,
  ProductVisibilityChangedEvent, ProductSeoUpdatedEvent,
  ProductDeletedEvent,
} from './events';

export { ProductException, PRODUCT_ERROR_CODES } from './exceptions';

export type { IProductRepository, ProductListParams, ProductListResult } from './repositories';

export {
  ProductIsActive, ProductIsPublic, ProductBelongsToTenant,
  ProductCanBePublished, ProductCanBeArchived,
} from './specifications';
export type { ISpecification } from './specifications';
