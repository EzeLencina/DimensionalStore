import { DomainEvent } from './domain-event';

export class ProductVariantDeletedEvent extends DomainEvent {
  constructor(
    public readonly variantId: string,
    public readonly tenantId: string,
  ) {
    super('variants.variant.deleted');
  }
}
