import { DomainEvent } from './domain-event';
import { OrganizationId } from '../value-objects';

export class OrganizationCreatedEvent extends DomainEvent {
  constructor(
    public readonly organizationId: OrganizationId,
    public readonly name: string,
    public readonly slug: string,
  ) {
    super('identity.organization.created');
  }
}
