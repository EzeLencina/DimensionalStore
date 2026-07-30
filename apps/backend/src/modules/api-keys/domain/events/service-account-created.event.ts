import { DomainEvent } from './domain-event';

export class ServiceAccountCreatedEvent extends DomainEvent {
  constructor(
    public readonly serviceAccountId: string,
    public readonly name: string,
    public readonly ownerId: string,
  ) {
    super('api_keys.service_account.created');
  }
}
