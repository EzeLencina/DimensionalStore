import { DomainEvent } from './domain-event';

export class CollectionRenamedEvent extends DomainEvent {
  constructor(
    public readonly collectionId: string,
    public readonly tenantId: string,
    public readonly oldName: string,
    public readonly newName: string,
  ) {
    super('catalog.collection.renamed');
  }
}
