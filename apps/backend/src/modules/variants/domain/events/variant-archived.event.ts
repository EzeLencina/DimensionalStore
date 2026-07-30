import { DomainEvent } from './domain-event';

export class ProductVariantArchivedEvent extends DomainEvent {
  constructor(
    public readonly variantId: string,
    public readonly tenantId: string,
  ) {
    super('variants.variant.archived');
  }
}
