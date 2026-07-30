import { DomainEvent } from './domain-event';

export class MfaEnabledEvent extends DomainEvent {
  constructor(
    public readonly userId: string,
    public readonly method: string,
  ) {
    super('mfa.mfa.enabled');
  }
}
