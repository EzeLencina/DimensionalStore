import { Injectable, Inject } from '@nestjs/common';
import { LOGGER_TOKEN } from '@tienda/logger/nest';
import { PrismaClient } from '@tienda/database';
import { Brand, BrandId, BrandException, BRAND_ERROR_CODES } from '../../../../domain';
import type { BrandRepository } from '../../../../domain/repository';
import type { BrandFilter, BrandSort, PaginatedResult } from '../../../../domain/specifics';
import { PrismaBrandMapper } from '../mappers/prisma-brand.mapper';

@Injectable()
export class PrismaBrandRepository implements BrandRepository {
  constructor(
    private readonly prisma: PrismaClient,
    @Inject(LOGGER_TOKEN) private readonly logger: any,
  ) {}

  async findById(id: BrandId): Promise<Brand | null> {
    const model = await this.prisma.brand.findUnique({
      where: { id: id.getValue() },
    });
    return model ? PrismaBrandMapper.toDomain(model) : null;
  }

  async findBySlug(tenantId: string, slug: string): Promise<Brand | null> {
    const model = await this.prisma.brand.findFirst({
      where: { slug, tenantId },
    });
    return model ? PrismaBrandMapper.toDomain(model) : null;
  }

  async findByTenant(tenantId: string): Promise<Brand[]> {
    const models = await this.prisma.brand.findMany({
      where: { tenantId },
      orderBy: { name: 'asc' },
    });
    return models.map(PrismaBrandMapper.toDomain);
  }

  async findFiltered(
    filter: BrandFilter,
    sort?: BrandSort,
    page = 1,
    limit = 20,
  ): Promise<PaginatedResult<Brand>> {
    const where: any = { tenantId: filter.tenantId };

    if (!filter.includeDeleted) {
      where.deletedAt = null;
    }
    if (filter.status) {
      where.status = filter.status;
    }
    if (filter.visibility) {
      where.visibility = filter.visibility;
    }
    if (filter.search) {
      where.OR = [
        { name: { contains: filter.search, mode: 'insensitive' } },
        { slug: { contains: filter.search, mode: 'insensitive' } },
      ];
    }

    const orderBy: any = {};
    if (sort) {
      orderBy[sort.field] = sort.direction;
    } else {
      orderBy.name = 'asc';
    }

    const [items, total] = await Promise.all([
      this.prisma.brand.findMany({
        where,
        orderBy,
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.brand.count({ where }),
    ]);

    return {
      data: items.map(PrismaBrandMapper.toDomain),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async existsBySlug(tenantId: string, slug: string, excludeId?: string): Promise<boolean> {
    const where: any = { slug, tenantId };
    if (excludeId) {
      where.id = { not: excludeId };
    }
    const count = await this.prisma.brand.count({ where });
    return count > 0;
  }

  async save(brand: Brand): Promise<Brand> {
    const p = brand.toPrimitives();
    const existing = await this.prisma.brand.findUnique({
      where: { id: p.id },
    });

    if (existing) {
      if (existing.version !== p.version) {
        throw new BrandException(
          BRAND_ERROR_CODES.BRAND_VERSION_CONFLICT,
          `Version conflict: expected ${p.version}, found ${existing.version}`,
        );
      }
      await this.prisma.brand.update({
        where: { id: p.id },
        data: {
          name: p.name,
          slug: p.slug,
          description: p.description,
          logoUrl: p.logoUrl,
          websiteUrl: p.websiteUrl,
          status: p.status as any,
          visibility: p.visibility as any,
          seoTitle: p.seoTitle,
          seoDescription: p.seoDescription,
          deletedAt: p.deletedAt,
          updatedAt: p.updatedAt,
          version: p.version,
        },
      });
    } else {
      await this.prisma.brand.create({
        data: PrismaBrandMapper.toCreateInput(brand),
      });
    }

    this.logger.debug(
      { event: 'brands.repository.saved', brandId: p.id, version: p.version },
      'Brand persisted',
    );

    const saved = await this.findById(new BrandId(p.id));
    return saved!;
  }

  async delete(brandId: BrandId): Promise<void> {
    await this.prisma.brand.deleteMany({
      where: { id: brandId.getValue() },
    });
  }

  async countProducts(brandId: string, tenantId: string): Promise<number> {
    return this.prisma.product.count({
      where: { brandId, tenantId },
    });
  }
}
