import { DomainEvent } from './domain-event';

export class CollectionArchivedEvent extends DomainEvent {
  constructor(
    public readonly collectionId: string,
    public readonly tenantId: string,
  ) {
    super('catalog.collection.archived');
  }
}
