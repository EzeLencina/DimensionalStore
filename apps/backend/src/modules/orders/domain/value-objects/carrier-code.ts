export class CarrierCode {
  private readonly value: string;
  constructor(value: string) {
    if (!value?.trim()) throw new Error('Carrier code is required');
    const normalized = value.trim().toUpperCase();
    if (normalized.length > 20) throw new Error('Carrier code too long (max 20)');
    this.value = normalized;
    Object.freeze(this);
  }
  getValue(): string { return this.value; }
  equals(other: CarrierCode): boolean { return this.value === other.getValue(); }
  toString(): string { return this.value; }
}
