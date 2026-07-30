import { DomainEvent } from './domain-event';

export class ProductRenamedEvent extends DomainEvent {
  constructor(
    public readonly productId: string,
    public readonly tenantId: string,
    public readonly oldName: string,
    public readonly newName: string,
  ) {
    super('products.product.renamed');
  }
}
