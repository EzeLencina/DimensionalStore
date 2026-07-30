import { DomainEvent } from './domain-event';
import { BranchId, OrganizationId } from '../value-objects';

export class BranchCreatedEvent extends DomainEvent {
  constructor(
    public readonly branchId: BranchId,
    public readonly organizationId: OrganizationId,
    public readonly name: string,
  ) {
    super('identity.branch.created');
  }
}
