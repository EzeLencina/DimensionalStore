import { DomainEvent } from './domain-event';

export class KeyUsedEvent extends DomainEvent {
  constructor(
    public readonly keyId: string,
    public readonly serviceAccountId: string,
    public readonly ipAddress?: string,
    public readonly scopes?: string[],
  ) {
    super('api_keys.key.used');
  }
}
