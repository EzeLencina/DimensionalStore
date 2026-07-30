import { Injectable, Inject } from '@nestjs/common';
import { LOGGER_TOKEN } from '@tienda/logger/nest';
import { PrismaClient } from '@tienda/database';
import { Category, CategoryId, CatalogException, CATALOG_ERROR_CODES } from '../../../../domain';
import type { CategoryRepository } from '../../../../domain/repository';
import type { CategoryFilter, CategorySort, PaginatedResult } from '../../../../domain/specifics';
import { PrismaCategoryMapper } from '../mappers/prisma-category.mapper';
import type { CategoryPrismaModel } from '../mappers/prisma-category.mapper';

@Injectable()
export class PrismaCategoryRepository implements CategoryRepository {
  constructor(
    private readonly prisma: PrismaClient,
    @Inject(LOGGER_TOKEN) private readonly logger: any,
  ) {}

  async findById(id: CategoryId): Promise<Category | null> {
    const model = await this.prisma.category.findUnique({
      where: { id: id.getValue() },
    });
    return model ? PrismaCategoryMapper.toDomain(model) : null;
  }

  async findBySlug(tenantId: string, slug: string): Promise<Category | null> {
    const model = await this.prisma.category.findFirst({
      where: { slug, tenantId },
    });
    return model ? PrismaCategoryMapper.toDomain(model) : null;
  }

  async findByTenant(tenantId: string): Promise<Category[]> {
    const models = await this.prisma.category.findMany({
      where: { tenantId },
      orderBy: { displayOrder: 'asc' },
    });
    return models.map(PrismaCategoryMapper.toDomain);
  }

  async findChildren(parentId: string): Promise<Category[]> {
    const models = await this.prisma.category.findMany({
      where: { parentId },
      orderBy: { displayOrder: 'asc' },
    });
    return models.map(PrismaCategoryMapper.toDomain);
  }

  async findRootCategories(tenantId: string): Promise<Category[]> {
    const models = await this.prisma.category.findMany({
      where: { tenantId, parentId: null },
      orderBy: { displayOrder: 'asc' },
    });
    return models.map(PrismaCategoryMapper.toDomain);
  }

  async findFiltered(
    filter: CategoryFilter,
    sort?: CategorySort,
    page = 1,
    limit = 20,
  ): Promise<PaginatedResult<Category>> {
    const where: any = { tenantId: filter.tenantId };

    if (!filter.includeDeleted) {
      where.deletedAt = null;
    }
    if (filter.parentId !== undefined) {
      where.parentId = filter.parentId;
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
      orderBy.displayOrder = 'asc';
    }

    const [items, total] = await Promise.all([
      this.prisma.category.findMany({
        where,
        orderBy,
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.category.count({ where }),
    ]);

    return {
      data: items.map(PrismaCategoryMapper.toDomain),
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
    const count = await this.prisma.category.count({ where });
    return count > 0;
  }

  async save(category: Category): Promise<Category> {
    const p = category.toPrimitives();
    const existing = await this.prisma.category.findUnique({
      where: { id: p.id },
    });

    if (existing) {
      if (existing.version !== p.version) {
        throw new CatalogException(
          CATALOG_ERROR_CODES.CATEGORY_VERSION_CONFLICT,
          `Version conflict: expected ${p.version}, found ${existing.version}`,
        );
      }
      await this.prisma.category.update({
        where: { id: p.id },
        data: {
          name: p.name,
          slug: p.slug,
          parentId: p.parentId,
          description: p.description,
          shortDescription: p.shortDescription,
          status: p.status as any,
          visibility: p.visibility as any,
          displayOrder: p.displayOrder,
          icon: p.icon,
          image: p.image,
          seoTitle: p.seoTitle,
          seoDescription: p.seoDescription,
          deletedAt: p.deletedAt,
          updatedAt: p.updatedAt,
          version: p.version,
        },
      });
    } else {
      await this.prisma.category.create({
        data: PrismaCategoryMapper.toCreateInput(category),
      });
    }

    this.logger.debug(
      { event: 'catalog.repository.category.saved', categoryId: p.id, version: p.version },
      'Category persisted',
    );

    const saved = await this.findById(new CategoryId(p.id));
    return saved!;
  }

  async delete(categoryId: CategoryId): Promise<void> {
    await this.prisma.category.deleteMany({
      where: { id: categoryId.getValue() },
    });
  }
}
