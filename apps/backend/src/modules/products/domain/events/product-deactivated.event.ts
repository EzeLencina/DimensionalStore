import { DomainEvent } from './domain-event';

export class ProductDeactivatedEvent extends DomainEvent {
  constructor(
    public readonly productId: string,
    public readonly tenantId: string,
  ) {
    super('products.product.deactivated');
  }
}
