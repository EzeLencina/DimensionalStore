import { DomainEvent } from './domain-event';

export class TenantUpdatedEvent extends DomainEvent {
  constructor(
    public readonly tenantId: string,
    public readonly changes: string[],
  ) { super('tenant.tenant.updated'); }
}
