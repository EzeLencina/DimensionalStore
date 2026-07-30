export class BrandId {
  private readonly value: string;

  constructor(value?: string) {
    if (value !== undefined && (typeof value !== 'string' || value.trim().length === 0)) {
      throw new Error('BrandId must be a non-empty string');
    }
    this.value = value ?? crypto.randomUUID();
    Object.freeze(this);
  }

  getValue(): string { return this.value; }
  equals(other: BrandId): boolean { return this.value === other.getValue(); }
  toString(): string { return this.value; }
}
