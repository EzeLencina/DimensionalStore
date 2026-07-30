import { DomainEvent } from './domain-event';

export class BrandCreatedEvent extends DomainEvent {
  constructor(
    public readonly brandId: string,
    public readonly tenantId: string,
    public readonly name: string,
    public readonly slug: string,
  ) {
    super('brands.brand.created');
  }
}
