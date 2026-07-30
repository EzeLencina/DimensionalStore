import { DomainEvent } from './domain-event';

export class TokenRevokedEvent extends DomainEvent {
  constructor(
    public readonly userId: string,
    public readonly tokenId: string,
    public readonly tokenType: string,
  ) {
    super('authentication.token.revoked');
  }
}
