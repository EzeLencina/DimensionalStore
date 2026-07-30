import { DomainEvent } from './domain-event';

export class KeyCreatedEvent extends DomainEvent {
  constructor(
    public readonly keyId: string,
    public readonly serviceAccountId: string,
    public readonly scopes: string[],
  ) {
    super('api_keys.key.created');
  }
}
