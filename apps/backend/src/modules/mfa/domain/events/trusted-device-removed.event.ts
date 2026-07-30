import { DomainEvent } from './domain-event';

export class TrustedDeviceRemovedEvent extends DomainEvent {
  constructor(
    public readonly userId: string,
    public readonly deviceId: string,
  ) {
    super('mfa.trusted_device.removed');
  }
}
