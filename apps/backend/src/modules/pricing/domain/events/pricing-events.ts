import { DomainEvent } from './domain-event';

export class PriceListCreatedEvent extends DomainEvent {
  constructor(public readonly priceListId: string, public readonly tenantId: string, public readonly code: string) {
    super('pricing.price_list.created');
  }
}

export class VariantPriceSetEvent extends DomainEvent {
  constructor(public readonly variantPriceId: string, public readonly tenantId: string, public readonly sku: string) {
    super('pricing.variant_price.set');
  }
}

export class PromotionScheduledEvent extends DomainEvent {
  constructor(public readonly variantPriceId: string, public readonly tenantId: string, public readonly promotionalAmount: number) {
    super('pricing.promotion.scheduled');
  }
}

export class PromotionCancelledEvent extends DomainEvent {
  constructor(public readonly variantPriceId: string, public readonly tenantId: string) {
    super('pricing.promotion.cancelled');
  }
}
