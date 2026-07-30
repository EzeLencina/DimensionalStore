import { DomainEvent } from './domain-event';

export class TenantActivatedEvent extends DomainEvent {
  constructor(
    public readonly tenantId: string,
  ) { super('tenant.tenant.activated'); }
}
