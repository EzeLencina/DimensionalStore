import { DomainEvent } from './domain-event';
import { UserId } from '../value-objects';

export class ProfileUpdatedEvent extends DomainEvent {
  constructor(
    public readonly userId: UserId,
    public readonly updatedFields: string[],
  ) {
    super('identity.profile.updated');
  }
}
