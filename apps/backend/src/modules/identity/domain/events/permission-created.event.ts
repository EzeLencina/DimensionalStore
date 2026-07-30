import { DomainEvent } from './domain-event';
import { PermissionId } from '../value-objects';

export class PermissionCreatedEvent extends DomainEvent {
  constructor(
    public readonly permissionId: PermissionId,
    public readonly resource: string,
    public readonly action: string,
  ) {
    super('identity.permission.created');
  }
}
