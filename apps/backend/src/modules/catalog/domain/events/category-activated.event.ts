import { DomainEvent } from './domain-event';

export class CategoryActivatedEvent extends DomainEvent {
  constructor(
    public readonly categoryId: string,
    public readonly tenantId: string,
  ) {
    super('catalog.category.activated');
  }
}
