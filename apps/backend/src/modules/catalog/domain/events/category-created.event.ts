import { DomainEvent } from './domain-event';

export class CategoryCreatedEvent extends DomainEvent {
  constructor(
    public readonly categoryId: string,
    public readonly tenantId: string,
    public readonly name: string,
    public readonly slug: string,
  ) {
    super('catalog.category.created');
  }
}
