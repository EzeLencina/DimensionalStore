const MAX_COLLECTION_NAME_LENGTH = 150;

export class CollectionName {
  private readonly value: string;

  private constructor(value: string) {
    this.value = value;
    Object.freeze(this);
  }

  static create(value: string): CollectionName {
    const trimmed = value.trim().replace(/\s+/g, ' ');
    if (!trimmed || trimmed.length === 0) {
      throw new Error('Collection name cannot be empty');
    }
    if (trimmed.length > MAX_COLLECTION_NAME_LENGTH) {
      throw new Error(`Collection name cannot exceed ${MAX_COLLECTION_NAME_LENGTH} characters`);
    }
    return new CollectionName(trimmed);
  }

  getValue(): string { return this.value; }
  toString(): string { return this.value; }
  equals(other: CollectionName): boolean { return this.value === other.value; }
}
