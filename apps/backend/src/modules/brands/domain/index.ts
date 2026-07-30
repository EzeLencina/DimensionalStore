export { Brand } from './aggregates';
export type { BrandPrimitives } from './aggregates';
export {
  BrandId, BrandName, Slug,
  Description, Url, SeoTitle, SeoDescription,
  BrandStatus, BrandVisibility,
} from './value-objects';
export type { BrandStatusValue, BrandVisibilityValue } from './value-objects';
export {
  DomainEvent,
  BrandCreatedEvent, BrandRenamedEvent,
  BrandActivatedEvent, BrandDeactivatedEvent,
  BrandArchivedEvent, BrandRestoredEvent,
  BrandVisibilityChangedEvent, BrandSeoUpdatedEvent, BrandDeletedEvent,
} from './events';
export { BrandException, BRAND_ERROR_CODES } from './exceptions';
export { BRAND_REPOSITORY } from './repository';
export type { BrandRepository } from './repository';
export { matchesBrandFilter } from './specifics';
export type { BrandFilter, BrandSort, PaginatedResult } from './specifics';
