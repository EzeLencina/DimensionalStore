import { DomainEvent } from './domain-event';

export class ChallengeCreatedEvent extends DomainEvent {
  constructor(
    public readonly challengeId: string,
    public readonly userId: string,
    public readonly method: string,
  ) {
    super('mfa.challenge.created');
  }
}
