const MAX_SEO_DESCRIPTION_LENGTH = 160;

export class SeoDescription {
  private readonly value: string;

  private constructor(value: string) {
    this.value = value;
    Object.freeze(this);
  }

  static create(value: string): SeoDescription {
    const trimmed = value.trim();
    if (trimmed.length > MAX_SEO_DESCRIPTION_LENGTH) {
      throw new Error(`SEO description cannot exceed ${MAX_SEO_DESCRIPTION_LENGTH} characters`);
    }
    return new SeoDescription(trimmed);
  }

  static empty(): SeoDescription {
    return new SeoDescription('');
  }

  getValue(): string { return this.value; }
  isEmpty(): boolean { return this.value.length === 0; }
  toString(): string { return this.value; }
  equals(other: SeoDescription): boolean { return this.value === other.value; }
}
