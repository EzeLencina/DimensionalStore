import { DomainEvent } from './domain-event';

export class SessionCreatedEvent extends DomainEvent {
  constructor(
    public readonly sessionId: string,
    public readonly userId: string,
    public readonly deviceId: string,
    public readonly ipAddress: string,
  ) {
    super('session.session.created');
  }
}
