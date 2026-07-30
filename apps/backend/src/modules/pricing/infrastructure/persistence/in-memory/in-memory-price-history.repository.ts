import type { PriceHistoryRepository, PriceHistoryRecord } from '../../../domain/repository';

export class InMemoryPriceHistoryRepository implements PriceHistoryRepository {
  private items: PriceHistoryRecord[] = [];
  private counter = 0;

  async append(record: Omit<PriceHistoryRecord, 'id' | 'createdAt'>): Promise<PriceHistoryRecord> {
    const created: PriceHistoryRecord = {
      ...record, id: `ph_${++this.counter}`, createdAt: new Date(),
    } as PriceHistoryRecord;
    this.items.push(created);
    return created;
  }

  async listByVariantPrice(variantPriceId: string, _tenantId: string): Promise<PriceHistoryRecord[]> {
    return this.items.filter(h => h.variantPriceId === variantPriceId).reverse();
  }

  async listByVariant(productVariantId: string, _tenantId: string): Promise<PriceHistoryRecord[]> {
    return this.items.filter(h => h.productVariantId === productVariantId).reverse();
  }

  clear(): void { this.items = []; this.counter = 0; }
}
