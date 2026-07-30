import { DomainEvent } from './domain-event';
import { UserId } from '../value-objects';

export class UserCreatedEvent extends DomainEvent {
  constructor(
    public readonly userId: UserId,
    public readonly email: string,
    public readonly userType: string,
  ) {
    super('identity.user.created');
  }
}
