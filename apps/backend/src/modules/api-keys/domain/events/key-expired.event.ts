import { DomainEvent } from './domain-event';

export class KeyExpiredEvent extends DomainEvent {
  constructor(
    public readonly keyId: string,
    public readonly serviceAccountId: string,
  ) {
    super('api_keys.key.expired');
  }
}
