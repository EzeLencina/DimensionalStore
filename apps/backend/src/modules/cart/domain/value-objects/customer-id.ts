export class CustomerId {
  private readonly value: string;
  constructor(value: string) {
    if (!value || typeof value !== 'string' || value.trim().length === 0) throw new Error('CustomerId must be a non-empty string');
    this.value = value.trim();
    Object.freeze(this);
  }
  getValue(): string { return this.value; }
  equals(other: CustomerId): boolean { return this.value === other.getValue(); }
  toString(): string { return this.value; }
}
