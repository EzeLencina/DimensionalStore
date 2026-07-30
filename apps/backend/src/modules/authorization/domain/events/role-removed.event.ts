import { DomainEvent } from './domain-event';

export class RoleRemovedEvent extends DomainEvent {
  constructor(
    public readonly userId: string,
    public readonly roleId: string,
  ) {
    super('authorization.role.removed');
  }
}
