import { DomainEvent } from './domain-event';

export class CategorySeoUpdatedEvent extends DomainEvent {
  constructor(
    public readonly categoryId: string,
    public readonly tenantId: string,
  ) {
    super('catalog.category.seo-updated');
  }
}
