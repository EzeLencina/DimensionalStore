import { DomainEvent } from './domain-event';

export class BrandSeoUpdatedEvent extends DomainEvent {
  constructor(
    public readonly brandId: string,
    public readonly tenantId: string,
  ) {
    super('brands.brand.seo-updated');
  }
}
