import { DomainEvent } from './domain-event';

export class MfaVerifiedEvent extends DomainEvent {
  constructor(
    public readonly userId: string,
    public readonly method: string,
    public readonly challengeId: string,
  ) {
    super('mfa.mfa.verified');
  }
}
