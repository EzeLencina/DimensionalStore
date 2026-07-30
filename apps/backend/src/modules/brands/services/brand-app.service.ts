import { Injectable, Inject } from '@nestjs/common';
import { LOGGER_TOKEN } from '@tienda/logger/nest';
import { Brand, BrandId } from '../domain';
import { BrandException, BRAND_ERROR_CODES } from '../domain/exceptions';
import { BrandValidator } from '../application/validators';
import { BrandMapper } from '../application/mappers';
import { BRAND_REPOSITORY } from '../domain/repository';
import type { BrandRepository } from '../domain/repository';
import type { BrandResponseDto } from '../application/dto';
import type { BrandListQueryDto, PaginatedBrandResponseDto } from '../application/dto';
import { CreateBrandCommand, UpdateBrandCommand } from '../application/commands';
import { Slug } from '../domain/value-objects';

@Injectable()
export class BrandAppService {
  constructor(
    @Inject(BRAND_REPOSITORY) private readonly repository: BrandRepository,
    @Inject(LOGGER_TOKEN) private readonly logger: any,
  ) {}

  async create(tenantId: string, command: CreateBrandCommand): Promise<BrandResponseDto> {
    const slug = command.slug || Slug.fromName(command.name).getValue();
    const commandWithSlug = new CreateBrandCommand(
      command.tenantId, command.name, slug,
      command.description, command.logoUrl, command.websiteUrl,
      command.status, command.visibility,
      command.seoTitle, command.seoDescription,
    );

    const errors = BrandValidator.validateCreate(commandWithSlug);
    if (errors.length > 0) {
      throw new BrandException(BRAND_ERROR_CODES.BRAND_INVALID_DATA, errors.join('; '));
    }

    const existingSlug = await this.repository.existsBySlug(tenantId, slug);
    if (existingSlug) {
      throw new BrandException(
        BRAND_ERROR_CODES.BRAND_SLUG_ALREADY_EXISTS,
        `Slug "${slug}" already exists in this tenant`,
      );
    }

    const status = command.status || 'DRAFT';
    const visibility = command.visibility || 'PUBLIC';

    const brand = Brand.create({
      tenantId,
      name: command.name,
      slug,
      description: command.description ?? null,
      logoUrl: command.logoUrl ?? null,
      websiteUrl: command.websiteUrl ?? null,
      status: status as any,
      visibility: visibility as any,
      seoTitle: command.seoTitle ?? null,
      seoDescription: command.seoDescription ?? null,
    });

    await this.repository.save(brand);

    this.logger.info(
      { event: 'brands.brand.created', brandId: brand.getId().toString(), tenantId },
      'Brand created',
    );

    return BrandMapper.toResponse(brand);
  }

  async findById(id: string, tenantId: string): Promise<BrandResponseDto> {
    const brandId = new BrandId(id);
    const brand = await this.repository.findById(brandId);
    if (!brand || brand.getTenantId() !== tenantId) {
      throw new BrandException(BRAND_ERROR_CODES.BRAND_NOT_FOUND, 'Brand not found');
    }
    return BrandMapper.toResponse(brand);
  }

  async findBySlug(slug: string, tenantId: string): Promise<BrandResponseDto> {
    const brand = await this.repository.findBySlug(tenantId, slug);
    if (!brand) {
      throw new BrandException(BRAND_ERROR_CODES.BRAND_NOT_FOUND, 'Brand not found');
    }
    return BrandMapper.toResponse(brand);
  }

  async findAll(
    tenantId: string,
    query: BrandListQueryDto,
  ): Promise<PaginatedBrandResponseDto> {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;

    const result = await this.repository.findFiltered(
      {
        tenantId,
        status: query.status,
        visibility: query.visibility,
        search: query.search,
        includeDeleted: query.includeDeleted,
      },
      query.sortField
        ? { field: query.sortField as any, direction: (query.sortDirection as any) ?? 'asc' }
        : undefined,
      page,
      limit,
    );

    return BrandMapper.toResponseList(result.data, result.total, page, limit);
  }

  async update(id: string, tenantId: string, command: UpdateBrandCommand): Promise<BrandResponseDto> {
    const errors = BrandValidator.validateUpdate(command as any);
    if (errors.length > 0) {
      throw new BrandException(BRAND_ERROR_CODES.BRAND_INVALID_DATA, errors.join('; '));
    }

    const brandId = new BrandId(id);
    const brand = await this.repository.findById(brandId);
    if (!brand || brand.getTenantId() !== tenantId) {
      throw new BrandException(BRAND_ERROR_CODES.BRAND_NOT_FOUND, 'Brand not found');
    }

    if (command.name !== undefined) brand.rename(command.name);
    if (command.slug !== undefined) {
      const existingSlug = await this.repository.existsBySlug(tenantId, command.slug, id);
      if (existingSlug && brand.getSlug().toString() !== command.slug) {
        throw new BrandException(
          BRAND_ERROR_CODES.BRAND_SLUG_ALREADY_EXISTS,
          `Slug "${command.slug}" already exists in this tenant`,
        );
      }
      brand.changeSlug(command.slug);
    }
    if (command.description !== undefined) brand.updateDescription(command.description);
    if (command.logoUrl !== undefined) brand.updateLogo(command.logoUrl);
    if (command.websiteUrl !== undefined) brand.updateWebsite(command.websiteUrl);
    if (command.seoTitle !== undefined || command.seoDescription !== undefined) {
      brand.updateSeo(command.seoTitle ?? null, command.seoDescription ?? null);
    }

    await this.repository.save(brand);

    this.logger.info(
      { event: 'brands.brand.updated', brandId: id, tenantId },
      'Brand updated',
    );

    return BrandMapper.toResponse(brand);
  }

  async changeStatus(id: string, tenantId: string, status: string): Promise<BrandResponseDto> {
    const brandId = new BrandId(id);
    const brand = await this.repository.findById(brandId);
    if (!brand || brand.getTenantId() !== tenantId) {
      throw new BrandException(BRAND_ERROR_CODES.BRAND_NOT_FOUND, 'Brand not found');
    }

    switch (status) {
      case 'ACTIVE':
        brand.activate();
        break;
      case 'INACTIVE':
        brand.deactivate();
        break;
      case 'ARCHIVED':
        brand.archive();
        break;
      default:
        throw new BrandException(
          BRAND_ERROR_CODES.BRAND_INVALID_STATUS_TRANSITION,
          `Invalid status: ${status}`,
        );
    }

    await this.repository.save(brand);
    return BrandMapper.toResponse(brand);
  }

  async changeVisibility(id: string, tenantId: string, visibility: string): Promise<BrandResponseDto> {
    const brandId = new BrandId(id);
    const brand = await this.repository.findById(brandId);
    if (!brand || brand.getTenantId() !== tenantId) {
      throw new BrandException(BRAND_ERROR_CODES.BRAND_NOT_FOUND, 'Brand not found');
    }

    brand.changeVisibility(visibility as any);
    await this.repository.save(brand);
    return BrandMapper.toResponse(brand);
  }

  async archive(id: string, tenantId: string): Promise<BrandResponseDto> {
    const brandId = new BrandId(id);
    const brand = await this.repository.findById(brandId);
    if (!brand || brand.getTenantId() !== tenantId) {
      throw new BrandException(BRAND_ERROR_CODES.BRAND_NOT_FOUND, 'Brand not found');
    }

    brand.archive();
    await this.repository.save(brand);

    this.logger.info(
      { event: 'brands.brand.archived', brandId: id, tenantId },
      'Brand archived',
    );

    return BrandMapper.toResponse(brand);
  }

  async restore(id: string, tenantId: string): Promise<BrandResponseDto> {
    const brandId = new BrandId(id);
    const brand = await this.repository.findById(brandId);
    if (!brand || brand.getTenantId() !== tenantId) {
      throw new BrandException(BRAND_ERROR_CODES.BRAND_NOT_FOUND, 'Brand not found');
    }

    brand.restore();
    await this.repository.save(brand);
    return BrandMapper.toResponse(brand);
  }

  async softDelete(id: string, tenantId: string): Promise<void> {
    const brandId = new BrandId(id);
    const brand = await this.repository.findById(brandId);
    if (!brand || brand.getTenantId() !== tenantId) {
      throw new BrandException(BRAND_ERROR_CODES.BRAND_NOT_FOUND, 'Brand not found');
    }

    brand.softDelete();
    await this.repository.save(brand);

    this.logger.info(
      { event: 'brands.brand.deleted', brandId: id, tenantId },
      'Brand soft deleted',
    );
  }

  async assignToProduct(productId: string, brandId: string, tenantId: string): Promise<void> {
    const bid = new BrandId(brandId);
    const brand = await this.repository.findById(bid);
    if (!brand || brand.getTenantId() !== tenantId) {
      throw new BrandException(BRAND_ERROR_CODES.BRAND_NOT_FOUND, 'Brand not found');
    }

    const prisma = (this.repository as any).prisma;
    if (!prisma) {
      this.logger.warn(
        { event: 'brands.brand.assign.no-prisma', productId, brandId, tenantId },
        'Cannot assign brand to product: Prisma not available',
      );
      return;
    }

    await prisma.product.updateMany({
      where: { id: productId, tenantId },
      data: { brandId },
    });

    this.logger.info(
      { event: 'brands.brand.assigned-to-product', productId, brandId, tenantId },
      'Brand assigned to product',
    );
  }

  async removeFromProduct(productId: string, tenantId: string): Promise<void> {
    const prisma = (this.repository as any).prisma;
    if (!prisma) {
      return;
    }

    await prisma.product.updateMany({
      where: { id: productId, tenantId },
      data: { brandId: null },
    });

    this.logger.info(
      { event: 'brands.brand.removed-from-product', productId, tenantId },
      'Brand removed from product',
    );
  }
}
