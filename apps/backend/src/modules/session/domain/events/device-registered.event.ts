import { DomainEvent } from './domain-event';

export class DeviceRegisteredEvent extends DomainEvent {
  constructor(
    public readonly deviceId: string,
    public readonly userId: string,
    public readonly deviceType: string,
  ) {
    super('session.device.registered');
  }
}
