import { DomainEvent } from './domain-event';

export class RoleAssignedEvent extends DomainEvent {
  constructor(
    public readonly userId: string,
    public readonly roleId: string,
    public readonly assignedBy: string,
  ) {
    super('authorization.role.assigned');
  }
}
