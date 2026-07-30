import { DomainEvent } from './domain-event';

export class CategoryMovedEvent extends DomainEvent {
  constructor(
    public readonly categoryId: string,
    public readonly tenantId: string,
    public readonly oldParentId: string | null,
    public readonly newParentId: string | null,
  ) {
    super('catalog.category.moved');
  }
}
