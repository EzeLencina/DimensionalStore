import { DomainEvent } from './domain-event';

export class CollectionSeoUpdatedEvent extends DomainEvent {
  constructor(
    public readonly collectionId: string,
    public readonly tenantId: string,
  ) {
    super('catalog.collection.seo-updated');
  }
}
