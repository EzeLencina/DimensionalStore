import { DomainEvent } from './domain-event';

export class CategoryDeactivatedEvent extends DomainEvent {
  constructor(
    public readonly categoryId: string,
    public readonly tenantId: string,
  ) {
    super('catalog.category.deactivated');
  }
}
