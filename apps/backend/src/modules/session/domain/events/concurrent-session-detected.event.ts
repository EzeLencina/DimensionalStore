import { DomainEvent } from './domain-event';

export class ConcurrentSessionDetectedEvent extends DomainEvent {
  constructor(
    public readonly userId: string,
    public readonly currentSessionCount: number,
    public readonly maxSessions: number,
  ) {
    super('session.session.concurrent_detected');
  }
}
