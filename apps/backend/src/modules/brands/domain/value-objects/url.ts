const URL_REGEX = /^(https?:\/\/)?[\w\-]+(\.[\w\-]+)+[/#?]?.*$/;
const MAX_URL_LENGTH = 2048;

export class Url {
  private readonly value: string;

  private constructor(value: string) {
    this.value = value;
    Object.freeze(this);
  }

  static create(value: string): Url {
    const trimmed = value.trim();
    if (!trimmed) {
      throw new Error('URL cannot be empty');
    }
    if (trimmed.length > MAX_URL_LENGTH) {
      throw new Error(`URL cannot exceed ${MAX_URL_LENGTH} characters`);
    }
    if (!URL_REGEX.test(trimmed)) {
      throw new Error('Invalid URL format');
    }
    return new Url(trimmed);
  }

  static empty(): Url {
    return new Url('');
  }

  getValue(): string { return this.value; }
  isEmpty(): boolean { return this.value.length === 0; }
  toString(): string { return this.value; }
  equals(other: Url): boolean { return this.value === other.value; }
}
