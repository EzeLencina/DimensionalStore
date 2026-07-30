import { DomainEvent } from './domain-event';

export class ProductSeoUpdatedEvent extends DomainEvent {
  constructor(
    public readonly productId: string,
    public readonly tenantId: string,
  ) {
    super('products.product.seo_updated');
  }
}
