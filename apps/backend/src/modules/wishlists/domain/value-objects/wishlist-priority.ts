export type WishlistPriorityValue = 'LOW' | 'NORMAL' | 'HIGH';

const VALID: WishlistPriorityValue[] = ['LOW', 'NORMAL', 'HIGH'];

export class WishlistPriority {
  private readonly value: WishlistPriorityValue;
  private constructor(value: WishlistPriorityValue) { this.value = value; Object.freeze(this); }
  static create(value?: string): WishlistPriority {
    const upper = (value ?? 'NORMAL').toUpperCase() as WishlistPriorityValue;
    if (!VALID.includes(upper)) throw new Error(`Invalid wishlist priority: ${value}`);
    return new WishlistPriority(upper);
  }
  static LOW(): WishlistPriority { return new WishlistPriority('LOW'); }
  static NORMAL(): WishlistPriority { return new WishlistPriority('NORMAL'); }
  static HIGH(): WishlistPriority { return new WishlistPriority('HIGH'); }
  getValue(): WishlistPriorityValue { return this.value; }
  rank(): number { return this.value === 'HIGH' ? 3 : this.value === 'NORMAL' ? 2 : 1; }
  toString(): string { return this.value; }
}
