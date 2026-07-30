import { DomainEvent } from './domain-event';

export class CollectionDeactivatedEvent extends DomainEvent {
  constructor(
    public readonly collectionId: string,
    public readonly tenantId: string,
  ) {
    super('catalog.collection.deactivated');
  }
}
