import { Injectable, Inject } from '@nestjs/common';
import { LOGGER_TOKEN } from '@tienda/logger/nest';
import { PrismaClient } from '@tienda/database';
import type { PriceHistoryRepository, PriceHistoryRecord } from '../../../../domain/repository';

@Injectable()
export class PrismaPriceHistoryRepository implements PriceHistoryRepository {
  constructor(
    private readonly prisma: PrismaClient,
    @Inject(LOGGER_TOKEN) private readonly logger: any,
  ) {}

  async append(record: Omit<PriceHistoryRecord, 'id' | 'createdAt'>): Promise<PriceHistoryRecord> {
    const created = await this.prisma.priceHistory.create({
      data: {
        tenantId: record.tenantId, variantPriceId: record.variantPriceId,
        productVariantId: record.productVariantId,
        changeType: record.changeType,
        previousValues: record.previousValues,
        newValues: record.newValues,
        changedBy: record.changedBy, reason: record.reason,
      },
    });
    this.logger.debug({ event: 'pricing.repository.price-history.appended', variantPriceId: record.variantPriceId }, 'Price history appended');
    return created as PriceHistoryRecord;
  }

  async listByVariantPrice(variantPriceId: string, tenantId: string): Promise<PriceHistoryRecord[]> {
    return this.prisma.priceHistory.findMany({
      where: { variantPriceId, tenantId },
      orderBy: { createdAt: 'desc' },
    }) as Promise<PriceHistoryRecord[]>;
  }

  async listByVariant(productVariantId: string, tenantId: string): Promise<PriceHistoryRecord[]> {
    return this.prisma.priceHistory.findMany({
      where: { productVariantId, tenantId },
      orderBy: { createdAt: 'desc' },
    }) as Promise<PriceHistoryRecord[]>;
  }
}
