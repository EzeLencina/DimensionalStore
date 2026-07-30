import { DomainEvent } from './domain-event';

export class CollectionActivatedEvent extends DomainEvent {
  constructor(
    public readonly collectionId: string,
    public readonly tenantId: string,
  ) {
    super('catalog.collection.activated');
  }
}
