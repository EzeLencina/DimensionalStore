import { DomainEvent } from './domain-event';

export class CategoryRenamedEvent extends DomainEvent {
  constructor(
    public readonly categoryId: string,
    public readonly tenantId: string,
    public readonly oldName: string,
    public readonly newName: string,
  ) {
    super('catalog.category.renamed');
  }
}
