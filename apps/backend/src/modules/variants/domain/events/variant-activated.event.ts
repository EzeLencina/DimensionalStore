import { DomainEvent } from './domain-event';

export class ProductVariantActivatedEvent extends DomainEvent {
  constructor(
    public readonly variantId: string,
    public readonly tenantId: string,
  ) {
    super('variants.variant.activated');
  }
}
