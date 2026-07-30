import { DomainEvent } from './domain-event';

export class TrustedDeviceAddedEvent extends DomainEvent {
  constructor(
    public readonly userId: string,
    public readonly deviceId: string,
  ) {
    super('mfa.trusted_device.added');
  }
}
