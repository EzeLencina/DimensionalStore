import { DomainEvent } from './domain-event';

export class SessionExpiredEvent extends DomainEvent {
  constructor(
    public readonly sessionId: string,
    public readonly userId: string,
  ) {
    super('session.session.expired');
  }
}
