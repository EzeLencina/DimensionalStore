import { DomainEvent } from './domain-event';
import type { ProductVisibilityValue } from '../value-objects';

export class ProductVisibilityChangedEvent extends DomainEvent {
  constructor(
    public readonly productId: string,
    public readonly tenantId: string,
    public readonly visibility: ProductVisibilityValue,
  ) {
    super('products.product.visibility_changed');
  }
}
