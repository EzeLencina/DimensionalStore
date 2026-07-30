import { VariantPriceId, Money } from '../value-objects';
import { PricingException, PRICING_ERROR_CODES } from '../exceptions';

export type VariantPricePrimitives = {
  id: string; tenantId: string; priceListId: string;
  productVariantId: string; sku: string;
  costAmount: number | null; listAmount: number;
  saleAmount: number | null; promotionalAmount: number | null;
  promotionalStartsAt: Date | null; promotionalEndsAt: Date | null;
  minimumQuantity: number; deletedAt: Date | null;
  version: number; createdAt: Date; updatedAt: Date;
};

type VariantPriceCreateParams = {
  tenantId: string; priceListId: string; productVariantId: string; sku: string;
  listAmount: number; costAmount?: number | null; saleAmount?: number | null;
  minimumQuantity?: number;
};

export class VariantPrice {
  private id!: VariantPriceId; private tenantId!: string; private priceListId!: string;
  private productVariantId!: string; private sku!: string;
  private costAmount!: Money | null; private listAmount!: Money;
  private saleAmount!: Money | null; private promotionalAmount!: Money | null;
  private promotionalStartsAt!: Date | null; private promotionalEndsAt!: Date | null;
  private minimumQuantity!: number; private deletedAt!: Date | null;
  private version!: number; private createdAt!: Date; private updatedAt!: Date;

  private constructor() {}

  static create(params: VariantPriceCreateParams): VariantPrice {
    const vp = new VariantPrice();
    vp.id = new VariantPriceId(); vp.tenantId = params.tenantId;
    vp.priceListId = params.priceListId; vp.productVariantId = params.productVariantId;
    vp.sku = params.sku;
    vp.listAmount = Money.fromCents(params.listAmount);
    vp.costAmount = params.costAmount != null ? Money.fromCents(params.costAmount) : null;
    vp.saleAmount = params.saleAmount != null ? Money.fromCents(params.saleAmount) : null;
    vp.promotionalAmount = null; vp.promotionalStartsAt = null; vp.promotionalEndsAt = null;
    vp.minimumQuantity = params.minimumQuantity ?? 1;
    vp.deletedAt = null; vp.version = 1;
    vp.createdAt = new Date(); vp.updatedAt = new Date();
    return vp;
  }

  static fromPrimitives(p: VariantPricePrimitives): VariantPrice {
    const vp = new VariantPrice();
    vp.id = new VariantPriceId(p.id); vp.tenantId = p.tenantId;
    vp.priceListId = p.priceListId; vp.productVariantId = p.productVariantId;
    vp.sku = p.sku;
    vp.listAmount = Money.fromCents(p.listAmount);
    vp.costAmount = p.costAmount != null ? Money.fromCents(p.costAmount) : null;
    vp.saleAmount = p.saleAmount != null ? Money.fromCents(p.saleAmount) : null;
    vp.promotionalAmount = p.promotionalAmount != null ? Money.fromCents(p.promotionalAmount) : null;
    vp.promotionalStartsAt = p.promotionalStartsAt; vp.promotionalEndsAt = p.promotionalEndsAt;
    vp.minimumQuantity = p.minimumQuantity; vp.deletedAt = p.deletedAt;
    vp.version = p.version; vp.createdAt = p.createdAt; vp.updatedAt = p.updatedAt;
    return vp;
  }

  toPrimitives(): VariantPricePrimitives {
    return {
      id: this.id.toString(), tenantId: this.tenantId, priceListId: this.priceListId,
      productVariantId: this.productVariantId, sku: this.sku,
      costAmount: this.costAmount?.toCents() ?? null,
      listAmount: this.listAmount.toCents(),
      saleAmount: this.saleAmount?.toCents() ?? null,
      promotionalAmount: this.promotionalAmount?.toCents() ?? null,
      promotionalStartsAt: this.promotionalStartsAt, promotionalEndsAt: this.promotionalEndsAt,
      minimumQuantity: this.minimumQuantity, deletedAt: this.deletedAt,
      version: this.version, createdAt: this.createdAt, updatedAt: this.updatedAt,
    };
  }

  getId(): VariantPriceId { return this.id; }
  getTenantId(): string { return this.tenantId; }
  getPriceListId(): string { return this.priceListId; }
  getProductVariantId(): string { return this.productVariantId; }
  getSku(): string { return this.sku; }
  getListAmount(): Money { return this.listAmount; }
  getSaleAmount(): Money | null { return this.saleAmount; }
  getPromotionalAmount(): Money | null { return this.promotionalAmount; }
  getPromotionalStartsAt(): Date | null { return this.promotionalStartsAt; }
  getPromotionalEndsAt(): Date | null { return this.promotionalEndsAt; }
  getMinimumQuantity(): number { return this.minimumQuantity; }
  getVersion(): number { return this.version; }

  hasActivePromotion(date: Date): boolean {
    if (!this.promotionalAmount) return false;
    if (!this.promotionalStartsAt || !this.promotionalEndsAt) return false;
    return date >= this.promotionalStartsAt && date <= this.promotionalEndsAt;
  }

  getEffectivePrice(date: Date): Money {
    if (this.hasActivePromotion(date)) return this.promotionalAmount!;
    if (this.saleAmount) return this.saleAmount;
    return this.listAmount;
  }

  updatePricing(costAmount: number | null, listAmount: number, saleAmount: number | null): void {
    this.costAmount = costAmount != null ? Money.fromCents(costAmount) : null;
    this.listAmount = Money.fromCents(listAmount);
    this.saleAmount = saleAmount != null ? Money.fromCents(saleAmount) : null;
    this.touch();
  }

  schedulePromotion(amount: number, startsAt: Date, endsAt: Date): void {
    const promo = Money.fromCents(amount);
    if (promo.isGreaterThan(this.listAmount)) throw new PricingException(PRICING_ERROR_CODES.PROMOTION_PRICE_TOO_HIGH, 'Promotional price cannot exceed list price');
    if (startsAt >= endsAt) throw new PricingException(PRICING_ERROR_CODES.INVALID_PROMOTION_DATE_RANGE, 'startsAt must be before endsAt');
    this.promotionalAmount = promo;
    this.promotionalStartsAt = startsAt;
    this.promotionalEndsAt = endsAt;
    this.touch();
  }

  cancelPromotion(): void {
    this.promotionalAmount = null;
    this.promotionalStartsAt = null;
    this.promotionalEndsAt = null;
    this.touch();
  }

  softDelete(): void { if (this.deletedAt !== null) return; this.deletedAt = new Date(); this.touch(); }

  private touch(): void { this.updatedAt = new Date(); this.version++; }
}
