import { DomainEvent } from './domain-event';

export class MfaDisabledEvent extends DomainEvent {
  constructor(
    public readonly userId: string,
    public readonly method: string,
  ) {
    super('mfa.mfa.disabled');
  }
}
