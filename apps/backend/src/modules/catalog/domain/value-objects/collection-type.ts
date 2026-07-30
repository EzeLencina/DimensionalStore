export type CollectionTypeValue = 'MANUAL' | 'RULE_BASED' | 'TEMPORARY' | 'FEATURED';

const VALID_TYPES: readonly CollectionTypeValue[] = ['MANUAL', 'RULE_BASED', 'TEMPORARY', 'FEATURED'];

export class CollectionType {
  private readonly value: CollectionTypeValue;

  private constructor(value: CollectionTypeValue) {
    this.value = value;
    Object.freeze(this);
  }

  static create(value: string): CollectionType {
    const upper = value.toUpperCase() as CollectionTypeValue;
    if (!VALID_TYPES.includes(upper)) {
      throw new Error(`Invalid collection type: ${value}. Valid values: ${VALID_TYPES.join(', ')}`);
    }
    return new CollectionType(upper);
  }

  static manual(): CollectionType { return new CollectionType('MANUAL'); }
  static ruleBased(): CollectionType { return new CollectionType('RULE_BASED'); }
  static temporary(): CollectionType { return new CollectionType('TEMPORARY'); }
  static featured(): CollectionType { return new CollectionType('FEATURED'); }

  getValue(): CollectionTypeValue { return this.value; }
  isManual(): boolean { return this.value === 'MANUAL'; }
  toString(): string { return this.value; }
  equals(other: CollectionType): boolean { return this.value === other.value; }
}
