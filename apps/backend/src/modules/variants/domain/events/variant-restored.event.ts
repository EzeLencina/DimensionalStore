import { DomainEvent } from './domain-event';

export class ProductVariantRestoredEvent extends DomainEvent {
  constructor(
    public readonly variantId: string,
    public readonly tenantId: string,
  ) {
    super('variants.variant.restored');
  }
}
