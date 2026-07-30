export type BrandStatusValue = 'DRAFT' | 'ACTIVE' | 'INACTIVE' | 'ARCHIVED';

const VALID_STATUSES: readonly BrandStatusValue[] = ['DRAFT', 'ACTIVE', 'INACTIVE', 'ARCHIVED'];

export class BrandStatus {
  private readonly value: BrandStatusValue;

  private constructor(value: BrandStatusValue) {
    this.value = value;
    Object.freeze(this);
  }

  static create(value: string): BrandStatus {
    const upper = value.toUpperCase() as BrandStatusValue;
    if (!VALID_STATUSES.includes(upper)) {
      throw new Error(`Invalid brand status: ${value}`);
    }
    return new BrandStatus(upper);
  }

  static draft(): BrandStatus { return new BrandStatus('DRAFT'); }
  static active(): BrandStatus { return new BrandStatus('ACTIVE'); }
  static inactive(): BrandStatus { return new BrandStatus('INACTIVE'); }
  static archived(): BrandStatus { return new BrandStatus('ARCHIVED'); }

  getValue(): BrandStatusValue { return this.value; }
  isActive(): boolean { return this.value === 'ACTIVE'; }
  isDraft(): boolean { return this.value === 'DRAFT'; }
  isArchived(): boolean { return this.value === 'ARCHIVED'; }
  isInactive(): boolean { return this.value === 'INACTIVE'; }
  canActivate(): boolean { return this.value === 'DRAFT' || this.value === 'INACTIVE'; }
  canArchive(): boolean { return this.value !== 'ARCHIVED'; }
  isPubliclyVisible(): boolean { return this.value === 'ACTIVE'; }
  toString(): string { return this.value; }
  equals(other: BrandStatus): boolean { return this.value === other.value; }
}
