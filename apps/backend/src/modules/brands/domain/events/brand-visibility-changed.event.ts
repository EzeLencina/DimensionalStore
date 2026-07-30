import { DomainEvent } from './domain-event';
import type { BrandVisibilityValue } from '../value-objects/brand-visibility';

export class BrandVisibilityChangedEvent extends DomainEvent {
  constructor(
    public readonly brandId: string,
    public readonly tenantId: string,
    public readonly oldVisibility: BrandVisibilityValue,
    public readonly newVisibility: BrandVisibilityValue,
  ) {
    super('brands.brand.visibility-changed');
  }
}
