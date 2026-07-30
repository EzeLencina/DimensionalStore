const CODE_REGEX = /^[A-Z0-9][A-Z0-9_-]*[A-Z0-9]$|^[A-Z0-9]$/;
const MAX_CODE_LENGTH = 30;

export class WarehouseCode {
  private readonly value: string;
  private constructor(value: string) { this.value = value; Object.freeze(this); }

  static create(value: string): WarehouseCode {
    const normalized = value.toUpperCase().trim();
    if (!normalized) throw new Error('Warehouse code cannot be empty');
    if (normalized.length > MAX_CODE_LENGTH) throw new Error(`Code cannot exceed ${MAX_CODE_LENGTH} chars`);
    if (!CODE_REGEX.test(normalized)) throw new Error('Code must contain only letters, numbers, hyphens, underscores');
    return new WarehouseCode(normalized);
  }

  getValue(): string { return this.value; }
  toString(): string { return this.value; }
  equals(other: WarehouseCode): boolean { return this.value === other.value; }
}
