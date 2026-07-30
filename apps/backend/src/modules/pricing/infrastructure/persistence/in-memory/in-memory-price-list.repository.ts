import type { PriceListRepository } from '../../../domain/repository';
import { PriceList, PriceListId } from '../../../domain';

export class InMemoryPriceListRepository implements PriceListRepository {
  private items: Map<string, PriceList> = new Map();

  async findById(id: PriceListId, _tenantId: string): Promise<PriceList | null> {
    return this.items.get(id.getValue()) ?? null;
  }

  async findByCode(code: string, tenantId: string): Promise<PriceList | null> {
    const upper = code.toUpperCase();
    for (const pl of this.items.values()) {
      if (pl.getTenantId() === tenantId && pl.getCode() === upper) return pl;
    }
    return null;
  }

  async findDefault(tenantId: string, _currency?: string): Promise<PriceList | null> {
    for (const pl of this.items.values()) {
      if (pl.getTenantId() === tenantId && pl.getIsDefault()) return pl;
    }
    return null;
  }

  async list(tenantId: string): Promise<PriceList[]> {
    return [...this.items.values()].filter(b => b.getTenantId() === tenantId && !b.hasBeenDeleted());
  }

  async findApplicable(_tenantId: string, _date: Date, _channel?: string, _customerGroup?: string): Promise<PriceList[]> {
    return [...this.items.values()].filter(b => b.isActive());
  }

  async existsByCode(code: string, tenantId: string, _excludeId?: string): Promise<boolean> {
    const found = await this.findByCode(code, tenantId);
    if (!found) return false;
    if (_excludeId && found.getId().toString() === _excludeId) return false;
    return true;
  }

  async save(priceList: PriceList): Promise<PriceList> {
    this.items.set(priceList.getId().toString(), priceList);
    return priceList;
  }

  clear(): void { this.items.clear(); }
  seed(items: PriceList[]): void { for (const i of items) this.items.set(i.getId().toString(), i); }
}
