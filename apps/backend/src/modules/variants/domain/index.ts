export { ProductVariant } from './aggregates';
export type { VariantPrimitives } from './aggregates';
export {
  VariantId, SKU, Barcode, VariantName,
  VariantStatus, VariantAttributes,
} from './value-objects';
export type { VariantStatusValue, VariantAttribute } from './value-objects';
export {
  DomainEvent,
  ProductVariantCreatedEvent,
  ProductVariantSkuChangedEvent,
  ProductVariantAttributesChangedEvent,
  ProductVariantActivatedEvent,
  ProductVariantDeactivatedEvent,
  ProductVariantArchivedEvent,
  ProductVariantRestoredEvent,
  ProductVariantSetAsDefaultEvent,
  ProductVariantDeletedEvent,
} from './events';
export { VariantException, VARIANT_ERROR_CODES } from './exceptions';
export { VARIANT_REPOSITORY } from './repository';
export type { VariantRepository } from './repository';
export { matchesVariantFilter } from './specifics';
export type { VariantFilter, VariantSort, PaginatedResult } from './specifics';
