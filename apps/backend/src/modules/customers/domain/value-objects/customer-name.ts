const MAX = 120;

export class CustomerName {
  private readonly value: string;

  constructor(value: string) {
    const normalized = value.trim().replace(/\s+/g, ' ');
    if (!normalized) throw new Error('Name is required');
    if (normalized.length > MAX) throw new Error(`Name too long (max ${MAX})`);
    this.value = normalized;
    Object.freeze(this);
  }

  toString(): string { return this.value; }
}
