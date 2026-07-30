import { DomainEvent } from './domain-event';

export class SessionRevokedEvent extends DomainEvent {
  constructor(
    public readonly sessionId: string,
    public readonly userId: string,
    public readonly reason?: string,
  ) {
    super('session.session.revoked');
  }
}
