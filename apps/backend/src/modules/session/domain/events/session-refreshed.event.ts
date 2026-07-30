import { DomainEvent } from './domain-event';

export class SessionRefreshedEvent extends DomainEvent {
  constructor(
    public readonly sessionId: string,
    public readonly userId: string,
    public readonly expiresAt: Date,
  ) {
    super('session.session.refreshed');
  }
}
