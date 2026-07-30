import { DomainEvent } from './domain-event';

export class ProductActivatedEvent extends DomainEvent {
  constructor(
    public readonly productId: string,
    public readonly tenantId: string,
  ) {
    super('products.product.activated');
  }
}
