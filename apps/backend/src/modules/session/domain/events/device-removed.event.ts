import { DomainEvent } from './domain-event';

export class DeviceRemovedEvent extends DomainEvent {
  constructor(
    public readonly deviceId: string,
    public readonly userId: string,
  ) {
    super('session.device.removed');
  }
}
