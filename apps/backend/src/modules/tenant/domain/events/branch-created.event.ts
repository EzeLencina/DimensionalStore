import { DomainEvent } from './domain-event';

export class BranchCreatedEvent extends DomainEvent {
  constructor(
    public readonly branchId: string,
    public readonly tenantId: string,
    public readonly name: string,
  ) { super('tenant.branch.created'); }
}
