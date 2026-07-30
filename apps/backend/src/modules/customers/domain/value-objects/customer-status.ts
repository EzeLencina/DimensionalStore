export type CustomerStatusValue = 'ACTIVE' | 'INACTIVE' | 'BLOCKED' | 'ARCHIVED';

const VALID: CustomerStatusValue[] = ['ACTIVE', 'INACTIVE', 'BLOCKED', 'ARCHIVED'];
const TRANSITIONS: Record<CustomerStatusValue, CustomerStatusValue[]> = {
  ACTIVE: ['INACTIVE', 'BLOCKED', 'ARCHIVED'],
  INACTIVE: ['ACTIVE', 'BLOCKED', 'ARCHIVED'],
  BLOCKED: ['ACTIVE', 'INACTIVE', 'ARCHIVED'],
  ARCHIVED: ['ACTIVE'],
};

export class CustomerStatus {
  private readonly value: CustomerStatusValue;
  private constructor(value: CustomerStatusValue) { this.value = value; Object.freeze(this); }
  static create(value: string): CustomerStatus {
    const upper = value.toUpperCase() as CustomerStatusValue;
    if (!VALID.includes(upper)) throw new Error(`Invalid customer status: ${value}`);
    return new CustomerStatus(upper);
  }
  static ACTIVE(): CustomerStatus { return new CustomerStatus('ACTIVE'); }
  static INACTIVE(): CustomerStatus { return new CustomerStatus('INACTIVE'); }
  static BLOCKED(): CustomerStatus { return new CustomerStatus('BLOCKED'); }
  static ARCHIVED(): CustomerStatus { return new CustomerStatus('ARCHIVED'); }
  getValue(): CustomerStatusValue { return this.value; }
  canTransitionTo(target: CustomerStatusValue): boolean { return TRANSITIONS[this.value].includes(target); }
  isBlocked(): boolean { return this.value === 'BLOCKED'; }
  isArchived(): boolean { return this.value === 'ARCHIVED'; }
  toString(): string { return this.value; }
}
