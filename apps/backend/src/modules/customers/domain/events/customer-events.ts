import { DomainEvent } from './domain-event';

export class CustomerCreatedEvent extends DomainEvent { constructor(public readonly customerId: string, public readonly tenantId: string) { super('customers.customer.created'); } }
export class CustomerProfileUpdatedEvent extends DomainEvent { constructor(public readonly customerId: string, public readonly tenantId: string) { super('customers.customer.profile_updated'); } }
export class CustomerEmailChangedEvent extends DomainEvent { constructor(public readonly customerId: string, public readonly tenantId: string) { super('customers.customer.email_changed'); } }
export class CustomerLinkedToUserEvent extends DomainEvent { constructor(public readonly customerId: string, public readonly tenantId: string) { super('customers.customer.linked_to_user'); } }
export class GuestCustomerConvertedEvent extends DomainEvent { constructor(public readonly customerId: string, public readonly tenantId: string) { super('customers.customer.guest_converted'); } }
export class CustomerActivatedEvent extends DomainEvent { constructor(public readonly customerId: string, public readonly tenantId: string) { super('customers.customer.activated'); } }
export class CustomerBlockedEvent extends DomainEvent { constructor(public readonly customerId: string, public readonly tenantId: string) { super('customers.customer.blocked'); } }
export class CustomerArchivedEvent extends DomainEvent { constructor(public readonly customerId: string, public readonly tenantId: string) { super('customers.customer.archived'); } }
export class CustomerAddressAddedEvent extends DomainEvent { constructor(public readonly customerId: string, public readonly addressId: string, public readonly tenantId: string) { super('customers.customer.address_added'); } }
export class CustomerDefaultAddressChangedEvent extends DomainEvent { constructor(public readonly customerId: string, public readonly addressId: string, public readonly tenantId: string) { super('customers.customer.default_address_changed'); } }
export class CustomerTagAssignedEvent extends DomainEvent { constructor(public readonly customerId: string, public readonly tagId: string, public readonly tenantId: string) { super('customers.customer.tag_assigned'); } }
export class CustomerMetricsUpdatedEvent extends DomainEvent { constructor(public readonly customerId: string, public readonly tenantId: string) { super('customers.customer.metrics_updated'); } }
