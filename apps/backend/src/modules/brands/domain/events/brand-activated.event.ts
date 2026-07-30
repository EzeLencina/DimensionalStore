import { DomainEvent } from './domain-event';

export class BrandActivatedEvent extends DomainEvent {
  constructor(
    public readonly brandId: string,
    public readonly tenantId: string,
  ) {
    super('brands.brand.activated');
  }
}
