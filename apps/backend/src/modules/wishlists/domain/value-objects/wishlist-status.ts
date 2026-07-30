export type WishlistStatusValue = 'ACTIVE' | 'ARCHIVED' | 'EXPIRED' | 'DELETED';

const VALID: WishlistStatusValue[] = ['ACTIVE', 'ARCHIVED', 'EXPIRED', 'DELETED'];
const TRANSITIONS: Record<WishlistStatusValue, WishlistStatusValue[]> = {
  ACTIVE: ['ARCHIVED', 'EXPIRED', 'DELETED'],
  ARCHIVED: ['ACTIVE', 'DELETED'],
  EXPIRED: ['ARCHIVED', 'DELETED'],
  DELETED: [],
};

export class WishlistStatus {
  private readonly value: WishlistStatusValue;
  private constructor(value: WishlistStatusValue) { this.value = value; Object.freeze(this); }
  static create(value: string): WishlistStatus { const upper = value.toUpperCase() as WishlistStatusValue; if (!VALID.includes(upper)) throw new Error(`Invalid wishlist status: ${value}`); return new WishlistStatus(upper); }
  static ACTIVE(): WishlistStatus { return new WishlistStatus('ACTIVE'); }
  static ARCHIVED(): WishlistStatus { return new WishlistStatus('ARCHIVED'); }
  static EXPIRED(): WishlistStatus { return new WishlistStatus('EXPIRED'); }
  static DELETED(): WishlistStatus { return new WishlistStatus('DELETED'); }
  getValue(): WishlistStatusValue { return this.value; }
  canTransitionTo(target: WishlistStatusValue): boolean { return TRANSITIONS[this.value].includes(target); }
  isMutable(): boolean { return this.value === 'ACTIVE'; }
  toString(): string { return this.value; }
}
