import { DomainEvent } from './domain-event';

export class BrandDeactivatedEvent extends DomainEvent {
  constructor(
    public readonly brandId: string,
    public readonly tenantId: string,
  ) {
    super('brands.brand.deactivated');
  }
}
