import { DomainEvent } from './domain-event';
import type { CollectionTypeValue } from '../value-objects/collection-type';

export class CollectionTypeChangedEvent extends DomainEvent {
  constructor(
    public readonly collectionId: string,
    public readonly tenantId: string,
    public readonly oldType: CollectionTypeValue,
    public readonly newType: CollectionTypeValue,
  ) {
    super('catalog.collection.type-changed');
  }
}
