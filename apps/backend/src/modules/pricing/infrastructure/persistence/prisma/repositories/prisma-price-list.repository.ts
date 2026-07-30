import { Injectable, Inject } from '@nestjs/common';
import { LOGGER_TOKEN } from '@tienda/logger/nest';
import { PrismaClient } from '@tienda/database';
import { PriceList, PriceListId, PricingException, PRICING_ERROR_CODES } from '../../../../domain';
import type { PriceListRepository } from '../../../../domain/repository';
import { PrismaPriceListMapper } from '../mappers/prisma-price-list.mapper';

@Injectable()
export class PrismaPriceListRepository implements PriceListRepository {
  constructor(
    private readonly prisma: PrismaClient,
    @Inject(LOGGER_TOKEN) private readonly logger: any,
  ) {}

  async findById(id: PriceListId, tenantId: string): Promise<PriceList | null> {
    const model = await this.prisma.priceList.findFirst({
      where: { id: id.getValue(), tenantId },
    });
    return model ? PrismaPriceListMapper.toDomain(model) : null;
  }

  async findByCode(code: string, tenantId: string): Promise<PriceList | null> {
    const model = await this.prisma.priceList.findFirst({
      where: { code: code.toUpperCase(), tenantId },
    });
    return model ? PrismaPriceListMapper.toDomain(model) : null;
  }

  async findDefault(tenantId: string, currency?: string): Promise<PriceList | null> {
    const where: any = { tenantId, isDefault: true, deletedAt: null };
    if (currency) where.currency = currency;
    const model = await this.prisma.priceList.findFirst({ where });
    return model ? PrismaPriceListMapper.toDomain(model) : null;
  }

  async list(tenantId: string): Promise<PriceList[]> {
    const models = await this.prisma.priceList.findMany({
      where: { tenantId, deletedAt: null },
      orderBy: { priority: 'desc' },
    });
    return models.map(PrismaPriceListMapper.toDomain);
  }

  async findApplicable(tenantId: string, date: Date, channel?: string, customerGroup?: string): Promise<PriceList[]> {
    const where: any = { tenantId, status: 'ACTIVE', deletedAt: null };
    if (channel) where.channel = channel;
    if (customerGroup) where.customerGroup = customerGroup;
    const models = await this.prisma.priceList.findMany({
      where: {
        ...where,
        OR: [
          { startsAt: null },
          { startsAt: { lte: date } },
        ],
        AND: [
          { OR: [{ endsAt: null }, { endsAt: { gte: date } }] },
        ],
      },
      orderBy: { priority: 'desc' },
    });
    return models.map(PrismaPriceListMapper.toDomain);
  }

  async existsByCode(code: string, tenantId: string, excludeId?: string): Promise<boolean> {
    const where: any = { code: code.toUpperCase(), tenantId };
    if (excludeId) where.id = { not: excludeId };
    const count = await this.prisma.priceList.count({ where });
    return count > 0;
  }

  async save(priceList: PriceList): Promise<PriceList> {
    const p = priceList.toPrimitives();
    const existing = await this.prisma.priceList.findUnique({ where: { id: p.id } });

    if (existing) {
      if (existing.version !== p.version) {
        throw new PricingException(PRICING_ERROR_CODES.PRICING_VERSION_CONFLICT, 'Version conflict');
      }
      await this.prisma.priceList.update({
        where: { id: p.id },
        data: PrismaPriceListMapper.toUpdateInput(priceList),
      });
    } else {
      await this.prisma.priceList.create({
        data: PrismaPriceListMapper.toCreateInput(priceList),
      });
    }

    this.logger.debug({ event: 'pricing.repository.price-list.saved', priceListId: p.id }, 'PriceList persisted');
    const saved = await this.findById(new PriceListId(p.id), p.tenantId);
    return saved!;
  }
}
