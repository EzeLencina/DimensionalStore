const SLUG_REGEX = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const MAX_SLUG_LENGTH = 200;

export class Slug {
  private readonly value: string;

  private constructor(value: string) {
    this.value = value;
    Object.freeze(this);
  }

  static create(value: string): Slug {
    const trimmed = value.trim().toLowerCase();
    if (!trimmed) {
      throw new Error('Slug cannot be empty');
    }
    if (trimmed.length > MAX_SLUG_LENGTH) {
      throw new Error(`Slug cannot exceed ${MAX_SLUG_LENGTH} characters`);
    }
    if (!SLUG_REGEX.test(trimmed)) {
      throw new Error('Slug must contain only lowercase letters, numbers, and hyphens');
    }
    return new Slug(trimmed);
  }

  static fromName(name: string): Slug {
    const slug = name
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_]+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
    return Slug.create(slug || 'untitled');
  }

  getValue(): string { return this.value; }
  toString(): string { return this.value; }
  equals(other: Slug): boolean { return this.value === other.value; }
}
