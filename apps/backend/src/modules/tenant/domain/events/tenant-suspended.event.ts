import { DomainEvent } from './domain-event';

export class TenantSuspendedEvent extends DomainEvent {
  constructor(
    public readonly tenantId: string,
    public readonly reason?: string,
  ) { super('tenant.tenant.suspended'); }
}
