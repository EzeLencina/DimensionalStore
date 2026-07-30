const MAX_LENGTH = 120;

export class WishlistName {
  private readonly value: string;
  constructor(value: string) {
    const normalized = value.trim().replace(/\s+/g, ' ');
    if (!normalized) throw new Error('Wishlist name is required');
    if (normalized.length > MAX_LENGTH) throw new Error(`Wishlist name too long (max ${MAX_LENGTH})`);
    this.value = normalized;
    Object.freeze(this);
  }
  toString(): string { return this.value; }
}
