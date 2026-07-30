import { DomainEvent } from './domain-event';

export class AuthenticationFailedEvent extends DomainEvent {
  constructor(
    public readonly email: string,
    public readonly reason: string,
    public readonly ip?: string,
  ) {
    super('authentication.authentication.failed');
  }
}
