import { DomainEvent } from './domain-event';

export class ProductArchivedEvent extends DomainEvent {
  constructor(
    public readonly productId: string,
    public readonly tenantId: string,
  ) {
    super('products.product.archived');
  }
}
