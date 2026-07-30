import { DomainEvent } from './domain-event';
import { RoleId, OrganizationId } from '../value-objects';

export class RoleCreatedEvent extends DomainEvent {
  constructor(
    public readonly roleId: RoleId,
    public readonly organizationId: OrganizationId,
    public readonly name: string,
  ) {
    super('identity.role.created');
  }
}
