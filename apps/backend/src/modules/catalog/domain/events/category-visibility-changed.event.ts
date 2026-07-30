import { DomainEvent } from './domain-event';
import type { CatalogVisibilityValue } from '../value-objects/catalog-visibility';

export class CategoryVisibilityChangedEvent extends DomainEvent {
  constructor(
    public readonly categoryId: string,
    public readonly tenantId: string,
    public readonly oldVisibility: CatalogVisibilityValue,
    public readonly newVisibility: CatalogVisibilityValue,
  ) {
    super('catalog.category.visibility-changed');
  }
}
