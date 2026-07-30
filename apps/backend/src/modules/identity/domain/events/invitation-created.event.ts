import { DomainEvent } from './domain-event';
import { InvitationId, OrganizationId } from '../value-objects';

export class InvitationCreatedEvent extends DomainEvent {
  constructor(
    public readonly invitationId: InvitationId,
    public readonly organizationId: OrganizationId,
    public readonly email: string,
    public readonly invitedBy: string,
  ) {
    super('identity.invitation.created');
  }
}
