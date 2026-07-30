export type VariantStatusValue = 'ACTIVE' | 'INACTIVE' | 'ARCHIVED';

const VALID_STATUSES: readonly VariantStatusValue[] = ['ACTIVE', 'INACTIVE', 'ARCHIVED'];

export class VariantStatus {
  private readonly value: VariantStatusValue;

  private constructor(value: VariantStatusValue) {
    this.value = value;
    Object.freeze(this);
  }

  static create(value: string): VariantStatus {
    const upper = value.toUpperCase() as VariantStatusValue;
    if (!VALID_STATUSES.includes(upper)) {
      throw new Error(`Invalid variant status: ${value}`);
    }
    return new VariantStatus(upper);
  }

  static active(): VariantStatus { return new VariantStatus('ACTIVE'); }
  static inactive(): VariantStatus { return new VariantStatus('INACTIVE'); }
  static archived(): VariantStatus { return new VariantStatus('ARCHIVED'); }

  getValue(): VariantStatusValue { return this.value; }
  isActive(): boolean { return this.value === 'ACTIVE'; }
  isInactive(): boolean { return this.value === 'INACTIVE'; }
  isArchived(): boolean { return this.value === 'ARCHIVED'; }

  canActivate(): boolean { return this.value === 'INACTIVE'; }
  canDeactivate(): boolean { return this.value === 'ACTIVE'; }
  canArchive(): boolean { return this.value !== 'ARCHIVED'; }

  toString(): string { return this.value; }
  equals(other: VariantStatus): boolean { return this.value === other.value; }
}
