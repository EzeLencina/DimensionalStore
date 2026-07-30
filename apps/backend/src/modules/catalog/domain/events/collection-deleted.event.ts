import { DomainEvent } from './domain-event';

export class CollectionDeletedEvent extends DomainEvent {
  constructor(
    public readonly collectionId: string,
    public readonly tenantId: string,
  ) {
    super('catalog.collection.deleted');
  }
}
