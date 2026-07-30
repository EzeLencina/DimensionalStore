import { DomainEvent } from './domain-event';

export class BrandRenamedEvent extends DomainEvent {
  constructor(
    public readonly brandId: string,
    public readonly tenantId: string,
    public readonly oldName: string,
    public readonly newName: string,
  ) {
    super('brands.brand.renamed');
  }
}
