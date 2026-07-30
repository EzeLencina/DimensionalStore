export type BrandVisibilityValue = 'PUBLIC' | 'PRIVATE' | 'HIDDEN';

const VALID_VISIBILITIES: readonly BrandVisibilityValue[] = ['PUBLIC', 'PRIVATE', 'HIDDEN'];

export class BrandVisibility {
  private readonly value: BrandVisibilityValue;

  private constructor(value: BrandVisibilityValue) {
    this.value = value;
    Object.freeze(this);
  }

  static create(value: string): BrandVisibility {
    const upper = value.toUpperCase() as BrandVisibilityValue;
    if (!VALID_VISIBILITIES.includes(upper)) {
      throw new Error(`Invalid brand visibility: ${value}`);
    }
    return new BrandVisibility(upper);
  }

  static public(): BrandVisibility { return new BrandVisibility('PUBLIC'); }
  static private(): BrandVisibility { return new BrandVisibility('PRIVATE'); }
  static hidden(): BrandVisibility { return new BrandVisibility('HIDDEN'); }

  getValue(): BrandVisibilityValue { return this.value; }
  isPublic(): boolean { return this.value === 'PUBLIC'; }
  isPrivate(): boolean { return this.value === 'PRIVATE'; }
  isHidden(): boolean { return this.value === 'HIDDEN'; }
  toString(): string { return this.value; }
  equals(other: BrandVisibility): boolean { return this.value === other.value; }
}
