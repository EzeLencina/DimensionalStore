import { DomainEvent } from './domain-event';

export class MfaRecoveryStartedEvent extends DomainEvent {
  constructor(
    public readonly userId: string,
    public readonly tokenId: string,
  ) {
    super('mfa.recovery.started');
  }
}
