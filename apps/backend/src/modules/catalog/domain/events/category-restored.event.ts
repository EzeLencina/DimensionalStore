import { DomainEvent } from './domain-event';

export class CategoryRestoredEvent extends DomainEvent {
  constructor(
    public readonly categoryId: string,
    public readonly tenantId: string,
  ) {
    super('catalog.category.restored');
  }
}
