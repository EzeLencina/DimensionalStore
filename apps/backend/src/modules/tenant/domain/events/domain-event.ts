export abstract class DomainEvent {
  public readonly occurredAt: Date;
  public readonly eventName: string;

  constructor(eventName: string) {
    this.eventName = eventName;
    this.occurredAt = new Date();
  }
}
