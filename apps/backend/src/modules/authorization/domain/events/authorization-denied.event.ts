import { DomainEvent } from './domain-event';

export class AuthorizationDeniedEvent extends DomainEvent {
  constructor(
    public readonly userId: string,
    public readonly resource: string,
    public readonly action: string,
    public readonly reason: string,
  ) {
    super('authorization.authorization.denied');
  }
}
