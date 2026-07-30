import { DomainEvent } from './domain-event';

export class ProductVariantSkuChangedEvent extends DomainEvent {
  constructor(
    public readonly variantId: string,
    public readonly tenantId: string,
    public readonly oldSku: string,
    public readonly newSku: string,
  ) {
    super('variants.variant.sku_changed');
  }
}
