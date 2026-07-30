import { DomainEvent } from './domain-event';

export class KeyRevokedEvent extends DomainEvent {
  constructor(
    public readonly keyId: string,
    public readonly serviceAccountId: string,
    public readonly reason?: string,
  ) {
    super('api_keys.key.revoked');
  }
}
