import type { VariantPriceRepository } from '../../../domain/repository';
import { VariantPrice, VariantPriceId } from '../../../domain';

export class InMemoryVariantPriceRepository implements VariantPriceRepository {
  private items: Map<string, VariantPrice> = new Map();

  async findById(id: VariantPriceId, _tenantId: string): Promise<VariantPrice | null> {
    return this.items.get(id.getValue()) ?? null;
  }

  async findByVariantAndList(productVariantId: string, priceListId: string, _tenantId: string, _minQty?: number): Promise<VariantPrice | null> {
    for (const vp of this.items.values()) {
      if (vp.getProductVariantId() === productVariantId && vp.getPriceListId() === priceListId) return vp;
    }
    return null;
  }

  async findApplicablePrices(productVariantId: string, _tenantId: string): Promise<VariantPrice[]> {
    return [...this.items.values()].filter(v => v.getProductVariantId() === productVariantId);
  }

  async listByVariant(productVariantId: string, _tenantId: string): Promise<VariantPrice[]> {
    return [...this.items.values()].filter(v => v.getProductVariantId() === productVariantId);
  }

  async listByPriceList(priceListId: string, _tenantId: string): Promise<VariantPrice[]> {
    return [...this.items.values()].filter(v => v.getPriceListId() === priceListId);
  }

  async existsByVariantAndList(productVariantId: string, priceListId: string, _tenantId: string, _minQty?: number): Promise<boolean> {
    const found = await this.findByVariantAndList(productVariantId, priceListId, _tenantId);
    return found !== null;
  }

  async save(variantPrice: VariantPrice): Promise<VariantPrice> {
    this.items.set(variantPrice.getId().toString(), variantPrice);
    return variantPrice;
  }

  clear(): void { this.items.clear(); }
  seed(items: VariantPrice[]): void { for (const i of items) this.items.set(i.getId().toString(), i); }
}
