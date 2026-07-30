import { DomainEvent } from './domain-event';

export class TenantCreatedEvent extends DomainEvent {
  constructor(
    public readonly tenantId: string,
    public readonly slug: string,
    public readonly name: string,
  ) { super('tenant.tenant.created'); }
}
