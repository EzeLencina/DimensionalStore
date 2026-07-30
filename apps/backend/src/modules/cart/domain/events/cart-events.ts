import { DomainEvent } from './domain-event';

export class CartCreatedEvent extends DomainEvent {
  constructor(public readonly cartId: string, public readonly tenantId: string, public readonly ownerType: 'guest' | 'customer') {
    super('cart.cart.created');
  }
}

export class CartItemAddedEvent extends DomainEvent {
  constructor(public readonly cartId: string, public readonly tenantId: string, public readonly sku: string, public readonly quantity: number) {
    super('cart.cart.item_added');
  }
}

export class CartItemQuantityUpdatedEvent extends DomainEvent {
  constructor(public readonly cartId: string, public readonly tenantId: string, public readonly sku: string, public readonly previousQuantity: number, public readonly newQuantity: number) {
    super('cart.cart.item_quantity_updated');
  }
}

export class CartItemRemovedEvent extends DomainEvent {
  constructor(public readonly cartId: string, public readonly tenantId: string, public readonly sku: string) {
    super('cart.cart.item_removed');
  }
}

export class CartClearedEvent extends DomainEvent {
  constructor(public readonly cartId: string, public readonly tenantId: string) {
    super('cart.cart.cleared');
  }
}

export class CartConvertedEvent extends DomainEvent {
  constructor(public readonly cartId: string, public readonly tenantId: string) {
    super('cart.cart.converted');
  }
}

export class CartCancelledEvent extends DomainEvent {
  constructor(public readonly cartId: string, public readonly tenantId: string) {
    super('cart.cart.cancelled');
  }
}

export class CartExpiredEvent extends DomainEvent {
  constructor(public readonly cartId: string, public readonly tenantId: string) {
    super('cart.cart.expired');
  }
}

export class CartMergedEvent extends DomainEvent {
  constructor(public readonly sourceCartId: string, public readonly targetCartId: string, public readonly tenantId: string) {
    super('cart.cart.merged');
  }
}
