import { randomUUID } from 'node:crypto';

export class CustomerNoteId {
  private readonly value: string;
  constructor(value?: string) { this.value = value ?? randomUUID(); Object.freeze(this); }
  toString(): string { return this.value; }
}
