import { DomainEvent } from './domain-event';

export class MachineAuthenticatedEvent extends DomainEvent {
  constructor(
    public readonly serviceAccountId: string,
    public readonly keyId: string,
    public readonly scopes: string[],
    public readonly ipAddress?: string,
  ) {
    super('api_keys.machine.authenticated');
  }
}
