export class ReviewId { constructor(private readonly value: string = crypto.randomUUID()) {} toString(): string { return this.value; } }
export class ReviewResponseId { constructor(private readonly value: string = crypto.randomUUID()) {} toString(): string { return this.value; } }
export class ReviewVoteId { constructor(private readonly value: string = crypto.randomUUID()) {} toString(): string { return this.value; } }
export class ProductId { constructor(private readonly value: string) { if (!value?.trim()) throw new Error('ProductId is required'); } toString(): string { return this.value; } }
export class ProductVariantId { constructor(private readonly value: string) { if (!value?.trim()) throw new Error('ProductVariantId is required'); } toString(): string { return this.value; } }
export class CustomerId { constructor(private readonly value: string) { if (!value?.trim()) throw new Error('CustomerId is required'); } toString(): string { return this.value; } }
export class OrderId { constructor(private readonly value: string) { if (!value?.trim()) throw new Error('OrderId is required'); } toString(): string { return this.value; } }
export class OrderItemId { constructor(private readonly value: string) { if (!value?.trim()) throw new Error('OrderItemId is required'); } toString(): string { return this.value; } }
export class TenantId { constructor(private readonly value: string) { if (!value?.trim()) throw new Error('TenantId is required'); } toString(): string { return this.value; } }

export class Rating {
  constructor(private readonly value: number) {
    if (!Number.isInteger(value) || value < 1 || value > 5) throw new Error('Invalid rating');
  }
  toNumber(): number { return this.value; }
}

export class ReviewTitle {
  constructor(private readonly value: string | null) {
    if (value !== null && value.trim().length === 0) throw new Error('Invalid title');
  }
  toString(): string | null { return this.value?.trim() ? this.value.trim() : null; }
}

export class ReviewContent {
  constructor(private readonly value: string) {
    if (!value?.trim()) throw new Error('Invalid content');
  }
  toString(): string { return this.value.trim(); }
}

export class ModerationReason {
  constructor(private readonly value: string) { if (!value?.trim()) throw new Error('Moderation reason is required'); }
  toString(): string { return this.value.trim(); }
}

export class GuestFingerprintHash {
  constructor(private readonly value: string) { if (!value?.trim()) throw new Error('Guest fingerprint hash is required'); }
  toString(): string { return this.value; }
}

export class ReviewStatus {
  private constructor(private readonly value: string) {}
  static PENDING = () => new ReviewStatus('PENDING');
  static APPROVED = () => new ReviewStatus('APPROVED');
  static REJECTED = () => new ReviewStatus('REJECTED');
  static HIDDEN = () => new ReviewStatus('HIDDEN');
  static ARCHIVED = () => new ReviewStatus('ARCHIVED');
  static from(value: string): ReviewStatus { return new ReviewStatus(value); }
  toString(): string { return this.value; }
  isMutable(): boolean { return this.value !== 'ARCHIVED'; }
  isPublic(): boolean { return this.value === 'APPROVED'; }
  canTransitionTo(next: string): boolean {
    const allowed: Record<string, string[]> = {
      PENDING: ['APPROVED', 'REJECTED', 'HIDDEN', 'ARCHIVED'],
      APPROVED: ['HIDDEN', 'ARCHIVED', 'PENDING'],
      REJECTED: ['PENDING', 'ARCHIVED'],
      HIDDEN: ['APPROVED', 'ARCHIVED'],
      ARCHIVED: ['PENDING'],
    };
    return allowed[this.value]?.includes(next) ?? false;
  }
}

export type ReviewVoteValue = 'HELPFUL' | 'NOT_HELPFUL';
