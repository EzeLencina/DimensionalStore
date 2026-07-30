import { DomainEvent } from './domain-event';

export class CollectionCreatedEvent extends DomainEvent {
  constructor(
    public readonly collectionId: string,
    public readonly tenantId: string,
    public readonly name: string,
    public readonly slug: string,
    public readonly type: string,
  ) {
    super('catalog.collection.created');
  }
}
