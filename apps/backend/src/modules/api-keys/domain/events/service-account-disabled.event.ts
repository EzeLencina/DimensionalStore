import { DomainEvent } from './domain-event';

export class ServiceAccountDisabledEvent extends DomainEvent {
  constructor(
    public readonly serviceAccountId: string,
    public readonly reason?: string,
  ) {
    super('api_keys.service_account.disabled');
  }
}
