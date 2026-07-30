import { randomUUID } from 'node:crypto';

export class DeviceId {
  private readonly value: string;

  constructor(value?: string) {
    this.value = value ?? randomUUID();
    Object.freeze(this);
  }

  getValue(): string { return this.value; }
  equals(other: DeviceId): boolean { return this.value === other.getValue(); }
  toString(): string { return this.value; }
}
