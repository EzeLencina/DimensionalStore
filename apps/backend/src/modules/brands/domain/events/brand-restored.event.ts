import { DomainEvent } from './domain-event';

export class BrandRestoredEvent extends DomainEvent {
  constructor(
    public readonly brandId: string,
    public readonly tenantId: string,
  ) {
    super('brands.brand.restored');
  }
}
