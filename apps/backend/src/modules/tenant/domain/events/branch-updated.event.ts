import { DomainEvent } from './domain-event';

export class BranchUpdatedEvent extends DomainEvent {
  constructor(
    public readonly branchId: string,
    public readonly tenantId: string,
    public readonly changes: string[],
  ) { super('tenant.branch.updated'); }
}
