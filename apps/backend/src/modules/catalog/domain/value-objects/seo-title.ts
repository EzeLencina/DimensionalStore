const MAX_SEO_TITLE_LENGTH = 70;

export class SeoTitle {
  private readonly value: string;

  private constructor(value: string) {
    this.value = value;
    Object.freeze(this);
  }

  static create(value: string): SeoTitle {
    const trimmed = value.trim();
    if (trimmed.length > MAX_SEO_TITLE_LENGTH) {
      throw new Error(`SEO title cannot exceed ${MAX_SEO_TITLE_LENGTH} characters`);
    }
    return new SeoTitle(trimmed);
  }

  static empty(): SeoTitle {
    return new SeoTitle('');
  }

  getValue(): string { return this.value; }
  isEmpty(): boolean { return this.value.length === 0; }
  toString(): string { return this.value; }
  equals(other: SeoTitle): boolean { return this.value === other.value; }
}
