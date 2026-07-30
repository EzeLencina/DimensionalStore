import { DomainEvent } from './domain-event';
import { AuthorizationResult } from '../types';

export class PolicyEvaluatedEvent extends DomainEvent {
  constructor(
    public readonly userId: string,
    public readonly resource: string,
    public readonly action: string,
    public readonly result: AuthorizationResult,
  ) {
    super('authorization.policy.evaluated');
  }
}
