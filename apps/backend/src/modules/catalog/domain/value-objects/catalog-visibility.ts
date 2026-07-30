export type CatalogVisibilityValue = 'PUBLIC' | 'PRIVATE' | 'HIDDEN';

const VALID_VISIBILITIES: readonly CatalogVisibilityValue[] = ['PUBLIC', 'PRIVATE', 'HIDDEN'];

export class CatalogVisibility {
  private readonly value: CatalogVisibilityValue;

  private constructor(value: CatalogVisibilityValue) {
    this.value = value;
    Object.freeze(this);
  }

  static create(value: string): CatalogVisibility {
    const upper = value.toUpperCase() as CatalogVisibilityValue;
    if (!VALID_VISIBILITIES.includes(upper)) {
      throw new Error(`Invalid catalog visibility: ${value}. Valid values: ${VALID_VISIBILITIES.join(', ')}`);
    }
    return new CatalogVisibility(upper);
  }

  static public(): CatalogVisibility {
    return new CatalogVisibility('PUBLIC');
  }

  static private(): CatalogVisibility {
    return new CatalogVisibility('PRIVATE');
  }

  static hidden(): CatalogVisibility {
    return new CatalogVisibility('HIDDEN');
  }

  getValue(): CatalogVisibilityValue {
    return this.value;
  }

  isPublic(): boolean {
    return this.value === 'PUBLIC';
  }

  isPrivate(): boolean {
    return this.value === 'PRIVATE';
  }

  isHidden(): boolean {
    return this.value === 'HIDDEN';
  }

  toString(): string {
    return this.value;
  }

  equals(other: CatalogVisibility): boolean {
    return this.value === other.value;
  }
}
