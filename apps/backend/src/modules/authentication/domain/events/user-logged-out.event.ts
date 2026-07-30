import { DomainEvent } from './domain-event';

export class UserLoggedOutEvent extends DomainEvent {
  constructor(
    public readonly userId: string,
    public readonly sessionId: string,
  ) {
    super('authentication.user.logged_out');
  }
}
