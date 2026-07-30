import type { PriceList } from '../aggregates/price-list.aggregate';
import type { PriceListId } from '../value-objects/pricing-ids';
import type { VariantPrice } from '../aggregates/variant-price.aggregate';
import type { VariantPriceId } from '../value-objects/pricing-ids';

export const PRICE_LIST_REPOSITORY = 'PRICE_LIST_REPOSITORY';
export const VARIANT_PRICE_REPOSITORY = 'VARIANT_PRICE_REPOSITORY';
export const PRICE_HISTORY_REPOSITORY = 'PRICE_HISTORY_REPOSITORY';

export interface PriceListRepository {
  save(priceList: PriceList): Promise<PriceList>;
  findById(id: PriceListId, tenantId: string): Promise<PriceList | null>;
  findByCode(code: string, tenantId: string): Promise<PriceList | null>;
  findDefault(tenantId: string, currency?: string): Promise<PriceList | null>;
  list(tenantId: string): Promise<PriceList[]>;
  findApplicable(tenantId: string, date: Date, channel?: string, customerGroup?: string): Promise<PriceList[]>;
  existsByCode(code: string, tenantId: string, excludeId?: string): Promise<boolean>;
}

export interface VariantPriceRepository {
  save(variantPrice: VariantPrice): Promise<VariantPrice>;
  findById(id: VariantPriceId, tenantId: string): Promise<VariantPrice | null>;
  findByVariantAndList(productVariantId: string, priceListId: string, tenantId: string, minQty?: number): Promise<VariantPrice | null>;
  findApplicablePrices(productVariantId: string, tenantId: string): Promise<VariantPrice[]>;
  listByVariant(productVariantId: string, tenantId: string): Promise<VariantPrice[]>;
  listByPriceList(priceListId: string, tenantId: string): Promise<VariantPrice[]>;
  existsByVariantAndList(productVariantId: string, priceListId: string, tenantId: string, minQty?: number): Promise<boolean>;
}

export type PriceHistoryRecord = {
  id: string; tenantId: string; variantPriceId: string;
  productVariantId?: string | null;
  changeType: string; previousValues: Record<string, any>;
  newValues: Record<string, any>; changedBy: string;
  reason?: string | null; createdAt: Date;
};

export interface PriceHistoryRepository {
  append(record: Omit<PriceHistoryRecord, 'id' | 'createdAt'>): Promise<PriceHistoryRecord>;
  listByVariantPrice(variantPriceId: string, tenantId: string): Promise<PriceHistoryRecord[]>;
  listByVariant(productVariantId: string, tenantId: string): Promise<PriceHistoryRecord[]>;
}
