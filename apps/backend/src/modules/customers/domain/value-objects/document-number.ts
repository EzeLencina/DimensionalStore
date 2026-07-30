export class DocumentNumber {
  private readonly value: string;
  constructor(value: string) {
    const normalized = value.trim().replace(/\s+/g, '');
    if (!normalized) throw new Error('Document number is required');
    if (normalized.length > 32) throw new Error('Document number too long (max 32)');
    this.value = normalized;
    Object.freeze(this);
  }
  toString(): string { return this.value; }
}
