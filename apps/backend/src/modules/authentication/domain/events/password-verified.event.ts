import { DomainEvent } from './domain-event';

export class PasswordVerifiedEvent extends DomainEvent {
  constructor(
    public readonly userId: string,
    public readonly success: boolean,
  ) {
    super('authentication.password.verified');
  }
}
