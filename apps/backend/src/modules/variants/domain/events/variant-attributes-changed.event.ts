import { DomainEvent } from './domain-event';

export class ProductVariantAttributesChangedEvent extends DomainEvent {
  constructor(
    public readonly variantId: string,
    public readonly tenantId: string,
  ) {
    super('variants.variant.attributes_changed');
  }
}
