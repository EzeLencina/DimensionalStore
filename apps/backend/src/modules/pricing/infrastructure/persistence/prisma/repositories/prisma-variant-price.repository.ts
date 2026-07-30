import { Injectable, Inject } from '@nestjs/common';
import { LOGGER_TOKEN } from '@tienda/logger/nest';
import { PrismaClient } from '@tienda/database';
import { VariantPrice, VariantPriceId, PricingException, PRICING_ERROR_CODES } from '../../../../domain';
import type { VariantPriceRepository } from '../../../../domain/repository';
import { PrismaVariantPriceMapper } from '../mappers/prisma-variant-price.mapper';

@Injectable()
export class PrismaVariantPriceRepository implements VariantPriceRepository {
  constructor(
    private readonly prisma: PrismaClient,
    @Inject(LOGGER_TOKEN) private readonly logger: any,
  ) {}

  async findById(id: VariantPriceId, tenantId: string): Promise<VariantPrice | null> {
    const model = await this.prisma.variantPrice.findFirst({
      where: { id: id.getValue(), tenantId },
    });
    return model ? PrismaVariantPriceMapper.toDomain(model) : null;
  }

  async findByVariantAndList(productVariantId: string, priceListId: string, tenantId: string, minQty?: number): Promise<VariantPrice | null> {
    const where: any = { productVariantId, priceListId, tenantId, deletedAt: null };
    if (minQty !== undefined) where.minimumQuantity = minQty;
    const model = await this.prisma.variantPrice.findFirst({ where });
    return model ? PrismaVariantPriceMapper.toDomain(model) : null;
  }

  async findApplicablePrices(productVariantId: string, tenantId: string): Promise<VariantPrice[]> {
    const models = await this.prisma.variantPrice.findMany({
      where: { productVariantId, tenantId, deletedAt: null },
    });
    return models.map(PrismaVariantPriceMapper.toDomain);
  }

  async listByVariant(productVariantId: string, tenantId: string): Promise<VariantPrice[]> {
    const models = await this.prisma.variantPrice.findMany({
      where: { productVariantId, tenantId, deletedAt: null },
    });
    return models.map(PrismaVariantPriceMapper.toDomain);
  }

  async listByPriceList(priceListId: string, tenantId: string): Promise<VariantPrice[]> {
    const models = await this.prisma.variantPrice.findMany({
      where: { priceListId, tenantId, deletedAt: null },
    });
    return models.map(PrismaVariantPriceMapper.toDomain);
  }

  async existsByVariantAndList(productVariantId: string, priceListId: string, tenantId: string, minQty?: number): Promise<boolean> {
    const where: any = { productVariantId, priceListId, tenantId, deletedAt: null };
    if (minQty !== undefined) where.minimumQuantity = minQty;
    const count = await this.prisma.variantPrice.count({ where });
    return count > 0;
  }

  async save(variantPrice: VariantPrice): Promise<VariantPrice> {
    const p = variantPrice.toPrimitives();
    const existing = await this.prisma.variantPrice.findUnique({ where: { id: p.id } });

    if (existing) {
      if (existing.version !== p.version) {
        throw new PricingException(PRICING_ERROR_CODES.PRICING_VERSION_CONFLICT, 'Version conflict');
      }
      await this.prisma.variantPrice.update({
        where: { id: p.id },
        data: PrismaVariantPriceMapper.toUpdateInput(variantPrice),
      });
    } else {
      await this.prisma.variantPrice.create({
        data: PrismaVariantPriceMapper.toCreateInput(variantPrice),
      });
    }

    this.logger.debug({ event: 'pricing.repository.variant-price.saved', variantPriceId: p.id }, 'VariantPrice persisted');
    const saved = await this.findById(new VariantPriceId(p.id), p.tenantId);
    return saved!;
  }
}
