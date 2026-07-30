import { DomainEvent } from './domain-event';

export class ProductCreatedEvent extends DomainEvent {
  constructor(
    public readonly productId: string,
    public readonly tenantId: string,
    public readonly name: string,
    public readonly slug: string,
  ) {
    super('products.product.created');
  }
}
