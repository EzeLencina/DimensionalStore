import { DomainEvent } from './domain-event';

export class KeyRotatedEvent extends DomainEvent {
  constructor(
    public readonly keyId: string,
    public readonly oldKeyId: string,
    public readonly serviceAccountId: string,
    public readonly oldVersion: number,
    public readonly newVersion: number,
    public readonly gracePeriodEndsAt: Date,
  ) {
    super('api_keys.key.rotated');
  }
}
