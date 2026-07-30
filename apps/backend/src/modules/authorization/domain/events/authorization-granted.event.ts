import { DomainEvent } from './domain-event';

export class AuthorizationGrantedEvent extends DomainEvent {
  constructor(
    public readonly userId: string,
    public readonly resource: string,
    public readonly action: string,
  ) {
    super('authorization.authorization.granted');
  }
}
