export { VariantsModule } from './variants.module';
export { VariantController } from './presentation';
export { VariantAppService } from './services';
export { VARIANT_PROVIDERS } from './providers';

export {
  ProductVariant,
  VariantId,
  SKU,
  Barcode,
  VariantName,
  VariantStatus,
  VariantAttributes,
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
  VariantException,
  VARIANT_ERROR_CODES,
} from './domain';

export type {
  VariantPrimitives,
  VariantRepository,
  VariantFilter,
  VariantSort,
  PaginatedResult,
  CreateVariantCommand,
  UpdateVariantCommand,
  ChangeVariantSkuCommand,
  ChangeVariantStatusCommand,
  SetDefaultVariantCommand,
  VariantResponseDto,
  VariantListQueryDto,
  PaginatedVariantResponseDto,
} from './types';

export {
  PrismaVariantRepository,
  InMemoryVariantRepository,
  PrismaVariantMapper,
} from './infrastructure';

export type { VariantPrismaModel } from './infrastructure';
export { VariantEventHandler } from './events';
