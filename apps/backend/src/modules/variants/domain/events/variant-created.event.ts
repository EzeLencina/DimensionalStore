import { DomainEvent } from './domain-event';

export class ProductVariantCreatedEvent extends DomainEvent {
  constructor(
    public readonly variantId: string,
    public readonly tenantId: string,
    public readonly productId: string,
    public readonly sku: string,
  ) {
    super('variants.variant.created');
  }
}
