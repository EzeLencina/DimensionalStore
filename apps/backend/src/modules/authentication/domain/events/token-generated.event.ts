import { DomainEvent } from './domain-event';

export class TokenGeneratedEvent extends DomainEvent {
  constructor(
    public readonly userId: string,
    public readonly tokenId: string,
    public readonly tokenType: string,
    public readonly sessionId?: string,
  ) {
    super('authentication.token.generated');
  }
}
