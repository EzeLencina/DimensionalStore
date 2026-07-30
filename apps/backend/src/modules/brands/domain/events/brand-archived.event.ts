import { DomainEvent } from './domain-event';

export class BrandArchivedEvent extends DomainEvent {
  constructor(
    public readonly brandId: string,
    public readonly tenantId: string,
  ) {
    super('brands.brand.archived');
  }
}
