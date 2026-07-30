import { DomainEvent } from './domain-event';

export class UserLoggedInEvent extends DomainEvent {
  constructor(
    public readonly userId: string,
    public readonly email: string,
    public readonly sessionId: string,
    public readonly ip?: string,
    public readonly userAgent?: string,
  ) {
    super('authentication.user.logged_in');
  }
}
