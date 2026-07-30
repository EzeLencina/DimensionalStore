import { DomainEvent } from './domain-event';

export class InventoryInitializedEvent extends DomainEvent {
  constructor(public readonly inventoryItemId: string, public readonly tenantId: string, public readonly sku: string, public readonly warehouseId: string, public readonly quantity: number) {
    super('inventory.item.initialized');
  }
}

export class StockReceivedEvent extends DomainEvent {
  constructor(public readonly inventoryItemId: string, public readonly tenantId: string, public readonly sku: string, public readonly quantity: number, public readonly previousOnHand: number, public readonly resultingOnHand: number) {
    super('inventory.stock.received');
  }
}

export class StockDispatchedEvent extends DomainEvent {
  constructor(public readonly inventoryItemId: string, public readonly tenantId: string, public readonly sku: string, public readonly quantity: number, public readonly previousOnHand: number, public readonly resultingOnHand: number) {
    super('inventory.stock.dispatched');
  }
}

export class StockAdjustedEvent extends DomainEvent {
  constructor(public readonly inventoryItemId: string, public readonly tenantId: string, public readonly sku: string, public readonly previousOnHand: number, public readonly resultingOnHand: number) {
    super('inventory.stock.adjusted');
  }
}

export class StockReservedEvent extends DomainEvent {
  constructor(public readonly reservationId: string, public readonly tenantId: string, public readonly sku: string, public readonly quantity: number) {
    super('inventory.stock.reserved');
  }
}

export class ReservationReleasedEvent extends DomainEvent {
  constructor(public readonly reservationId: string, public readonly tenantId: string, public readonly sku: string) {
    super('inventory.reservation.released');
  }
}

export class ReservationConsumedEvent extends DomainEvent {
  constructor(public readonly reservationId: string, public readonly tenantId: string, public readonly sku: string, public readonly quantity: number) {
    super('inventory.reservation.consumed');
  }
}

export class StockTransferredEvent extends DomainEvent {
  constructor(public readonly fromWarehouseId: string, public readonly toWarehouseId: string, public readonly tenantId: string, public readonly sku: string, public readonly quantity: number) {
    super('inventory.stock.transferred');
  }
}
