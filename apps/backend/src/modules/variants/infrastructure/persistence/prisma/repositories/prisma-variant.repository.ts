import { Injectable, Inject } from '@nestjs/common';
import { LOGGER_TOKEN } from '@tienda/logger/nest';
import { PrismaClient } from '@tienda/database';
import { ProductVariant, VariantId, VariantException, VARIANT_ERROR_CODES } from '../../../../domain';
import type { VariantRepository } from '../../../../domain/repository';
import { PrismaVariantMapper } from '../mappers/prisma-variant.mapper';

@Injectable()
export class PrismaVariantRepository implements VariantRepository {
  constructor(
    private readonly prisma: PrismaClient,
    @Inject(LOGGER_TOKEN) private readonly logger: any,
  ) {}

  async findById(id: VariantId, tenantId: string): Promise<ProductVariant | null> {
    const model = await this.prisma.productVariant.findUnique({
      where: { id: id.getValue() },
    });
    if (!model || model.tenantId !== tenantId) return null;
    return PrismaVariantMapper.toDomain(model);
  }

  async findBySku(sku: string, tenantId: string): Promise<ProductVariant | null> {
    const model = await this.prisma.productVariant.findFirst({
      where: { sku, tenantId },
    });
    return model ? PrismaVariantMapper.toDomain(model) : null;
  }

  async existsBySku(sku: string, tenantId: string, excludeId?: string): Promise<boolean> {
    const where: any = { sku, tenantId };
    if (excludeId) { where.id = { not: excludeId }; }
    const count = await this.prisma.productVariant.count({ where });
    return count > 0;
  }

  async listByProduct(productId: string, tenantId: string): Promise<ProductVariant[]> {
    const models = await this.prisma.productVariant.findMany({
      where: { productId, tenantId },
      orderBy: { sku: 'asc' },
    });
    return models.map(PrismaVariantMapper.toDomain);
  }

  async findDefaultByProduct(productId: string, tenantId: string): Promise<ProductVariant | null> {
    const model = await this.prisma.productVariant.findFirst({
      where: { productId, tenantId, isDefault: true, deletedAt: null },
    });
    return model ? PrismaVariantMapper.toDomain(model) : null;
  }

  async existsAttributeCombination(
    productId: string,
    tenantId: string,
    _attributes: { name: string; value: string }[],
    _excludeId?: string,
  ): Promise<boolean> {
    const variants = await this.prisma.productVariant.findMany({
      where: { productId, tenantId, deletedAt: null },
    });
    const key = _attributes.map(a => `${a.name}:${a.value}`).sort().join('|');
    for (const v of variants) {
      if (_excludeId && v.id === _excludeId) continue;
      const existingAttrs = (v.attributes as { name: string; value: string }[]) ?? [];
      const existingKey = existingAttrs.map(a => `${a.name}:${a.value}`).sort().join('|');
      if (key && existingKey === key) return true;
    }
    return false;
  }

  async countByProduct(productId: string, tenantId: string): Promise<number> {
    return this.prisma.productVariant.count({
      where: { productId, tenantId, deletedAt: null },
    });
  }

  async findFiltered(
    filter: any,
    sort?: any,
    page = 1,
    limit = 20,
  ): Promise<any> {
    const where: any = { tenantId: filter.tenantId };

    if (!filter.includeDeleted) { where.deletedAt = null; }
    if (filter.productId) { where.productId = filter.productId; }
    if (filter.status) { where.status = filter.status; }
    if (filter.search) {
      where.OR = [
        { sku: { contains: filter.search, mode: 'insensitive' } },
        { name: { contains: filter.search, mode: 'insensitive' } },
      ];
    }

    const orderBy: any = {};
    if (sort) { orderBy[sort.field] = sort.direction; }
    else { orderBy.sku = 'asc'; }

    const [items, total] = await Promise.all([
      this.prisma.productVariant.findMany({
        where, orderBy, skip: (page - 1) * limit, take: limit,
      }),
      this.prisma.productVariant.count({ where }),
    ]);

    return {
      data: items.map(PrismaVariantMapper.toDomain),
      total, page, limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async save(variant: ProductVariant): Promise<ProductVariant> {
    const p = variant.toPrimitives();
    const existing = await this.prisma.productVariant.findUnique({
      where: { id: p.id },
    });

    if (existing) {
      if (existing.version !== p.version) {
        throw new VariantException(
          VARIANT_ERROR_CODES.VARIANT_VERSION_CONFLICT,
          `Version conflict: expected ${p.version}, found ${existing.version}`,
        );
      }
      await this.prisma.productVariant.update({
        where: { id: p.id },
        data: PrismaVariantMapper.toUpdateInput(variant) as any,
      });
    } else {
      await this.prisma.productVariant.create({
        data: PrismaVariantMapper.toCreateInput(variant) as any,
      });
    }

    this.logger.debug(
      { event: 'variants.repository.saved', variantId: p.id, version: p.version },
      'Variant persisted',
    );

    const saved = await this.findById(new VariantId(p.id), p.tenantId);
    return saved!;
  }

  async delete(variantId: VariantId, tenantId: string): Promise<void> {
    await this.prisma.productVariant.deleteMany({
      where: { id: variantId.getValue(), tenantId },
    });
  }
}
