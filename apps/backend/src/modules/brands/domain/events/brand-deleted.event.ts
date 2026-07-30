import { DomainEvent } from './domain-event';

export class BrandDeletedEvent extends DomainEvent {
  constructor(
    public readonly brandId: string,
    public readonly tenantId: string,
  ) {
    super('brands.brand.deleted');
  }
}
