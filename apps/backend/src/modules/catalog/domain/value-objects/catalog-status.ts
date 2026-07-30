export type CatalogStatusValue = 'DRAFT' | 'ACTIVE' | 'INACTIVE' | 'ARCHIVED';

const VALID_STATUSES: readonly CatalogStatusValue[] = ['DRAFT', 'ACTIVE', 'INACTIVE', 'ARCHIVED'];

export class CatalogStatus {
  private readonly value: CatalogStatusValue;

  private constructor(value: CatalogStatusValue) {
    this.value = value;
    Object.freeze(this);
  }

  static create(value: string): CatalogStatus {
    const upper = value.toUpperCase() as CatalogStatusValue;
    if (!VALID_STATUSES.includes(upper)) {
      throw new Error(`Invalid catalog status: ${value}. Valid values: ${VALID_STATUSES.join(', ')}`);
    }
    return new CatalogStatus(upper);
  }

  static draft(): CatalogStatus {
    return new CatalogStatus('DRAFT');
  }

  static active(): CatalogStatus {
    return new CatalogStatus('ACTIVE');
  }

  static inactive(): CatalogStatus {
    return new CatalogStatus('INACTIVE');
  }

  static archived(): CatalogStatus {
    return new CatalogStatus('ARCHIVED');
  }

  getValue(): CatalogStatusValue {
    return this.value;
  }

  isActive(): boolean {
    return this.value === 'ACTIVE';
  }

  isDraft(): boolean {
    return this.value === 'DRAFT';
  }

  isArchived(): boolean {
    return this.value === 'ARCHIVED';
  }

  isInactive(): boolean {
    return this.value === 'INACTIVE';
  }

  canActivate(): boolean {
    return this.value === 'DRAFT' || this.value === 'INACTIVE';
  }

  canArchive(): boolean {
    return this.value !== 'ARCHIVED';
  }

  toString(): string {
    return this.value;
  }

  equals(other: CatalogStatus): boolean {
    return this.value === other.value;
  }
}
