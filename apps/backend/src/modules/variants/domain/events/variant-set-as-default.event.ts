import { DomainEvent } from './domain-event';

export class ProductVariantSetAsDefaultEvent extends DomainEvent {
  constructor(
    public readonly variantId: string,
    public readonly tenantId: string,
    public readonly productId: string,
  ) {
    super('variants.variant.set_as_default');
  }
}
