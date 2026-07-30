import { DomainEvent } from './domain-event';

export class PermissionRevokedEvent extends DomainEvent {
  constructor(
    public readonly roleId: string,
    public readonly resource: string,
    public readonly action: string,
  ) {
    super('authorization.permission.revoked');
  }
}
