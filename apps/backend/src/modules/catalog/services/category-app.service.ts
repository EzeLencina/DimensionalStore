import { Injectable, Inject } from '@nestjs/common';
import { LOGGER_TOKEN } from '@tienda/logger/nest';
import { Category, CategoryId } from '../domain';
import { CatalogException, CATALOG_ERROR_CODES } from '../domain/exceptions';
import { CategoryValidator } from '../application/validators';
import { CategoryMapper } from '../application/mappers';
import { CATEGORY_REPOSITORY } from '../domain/repository';
import type { CategoryRepository } from '../domain/repository';
import type { CategoryResponseDto } from '../application/dto/category';
import type { CategoryListQueryDto, PaginatedCategoryResponseDto } from '../application/dto/category';
import { CreateCategoryCommand } from '../application/commands/category';
import type { UpdateCategoryCommand } from '../application/commands/category';
import { Slug } from '../domain/value-objects';

@Injectable()
export class CategoryAppService {
  constructor(
    @Inject(CATEGORY_REPOSITORY) private readonly repository: CategoryRepository,
    @Inject(LOGGER_TOKEN) private readonly logger: any,
  ) {}

  async create(tenantId: string, command: CreateCategoryCommand): Promise<CategoryResponseDto> {
    const slug = command.slug || Slug.fromName(command.name).getValue();
    const commandWithSlug = new CreateCategoryCommand(
      command.tenantId, command.name, slug,
      command.parentId, command.description,
      command.shortDescription, command.status, command.visibility,
      command.displayOrder, command.icon, command.image,
      command.seoTitle, command.seoDescription,
    );

    const errors = CategoryValidator.validateCreate(commandWithSlug);
    if (errors.length > 0) {
      throw new CatalogException(CATALOG_ERROR_CODES.CATEGORY_INVALID_DATA, errors.join('; '));
    }

    const existingSlug = await this.repository.existsBySlug(tenantId, slug);
    if (existingSlug) {
      throw new CatalogException(
        CATALOG_ERROR_CODES.CATEGORY_SLUG_ALREADY_EXISTS,
        `Slug "${slug}" already exists in this tenant`,
      );
    }

    const status = command.status || 'DRAFT';
    const visibility = command.visibility || 'PUBLIC';

    const category = Category.create({
      tenantId,
      parentId: command.parentId,
      name: command.name,
      slug,
      description: command.description ?? null,
      shortDescription: command.shortDescription ?? null,
      status: status as any,
      visibility: visibility as any,
      displayOrder: command.displayOrder ?? 0,
      icon: command.icon ?? null,
      image: command.image ?? null,
      seoTitle: command.seoTitle ?? null,
      seoDescription: command.seoDescription ?? null,
    });

    await this.repository.save(category);

    this.logger.info(
      { event: 'catalog.category.created', categoryId: category.getId().toString(), tenantId },
      'Category created',
    );

    return CategoryMapper.toResponse(category);
  }

  async findById(id: string, tenantId: string): Promise<CategoryResponseDto> {
    const categoryId = new CategoryId(id);
    const category = await this.repository.findById(categoryId);
    if (!category || category.getTenantId() !== tenantId) {
      throw new CatalogException(CATALOG_ERROR_CODES.CATEGORY_NOT_FOUND, 'Category not found');
    }
    return CategoryMapper.toResponse(category);
  }

  async findBySlug(slug: string, tenantId: string): Promise<CategoryResponseDto> {
    const category = await this.repository.findBySlug(tenantId, slug);
    if (!category) {
      throw new CatalogException(CATALOG_ERROR_CODES.CATEGORY_NOT_FOUND, 'Category not found');
    }
    return CategoryMapper.toResponse(category);
  }

  async findAll(
    tenantId: string,
    query: CategoryListQueryDto,
  ): Promise<PaginatedCategoryResponseDto> {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;

    const result = await this.repository.findFiltered(
      {
        tenantId,
        parentId: query.parentId,
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

    return CategoryMapper.toResponseList(result.data, result.total, page, limit);
  }

  async update(id: string, tenantId: string, command: UpdateCategoryCommand): Promise<CategoryResponseDto> {
    const errors = CategoryValidator.validateUpdate(command as any);
    if (errors.length > 0) {
      throw new CatalogException(CATALOG_ERROR_CODES.CATEGORY_INVALID_DATA, errors.join('; '));
    }

    const categoryId = new CategoryId(id);
    const category = await this.repository.findById(categoryId);
    if (!category || category.getTenantId() !== tenantId) {
      throw new CatalogException(CATALOG_ERROR_CODES.CATEGORY_NOT_FOUND, 'Category not found');
    }

    if (command.name !== undefined) category.rename(command.name);
    if (command.slug !== undefined) {
      const existingSlug = await this.repository.existsBySlug(tenantId, command.slug, id);
      if (existingSlug && category.getSlug().toString() !== command.slug) {
        throw new CatalogException(
          CATALOG_ERROR_CODES.CATEGORY_SLUG_ALREADY_EXISTS,
          `Slug "${command.slug}" already exists in this tenant`,
        );
      }
      category.changeSlug(command.slug);
    }
    if (command.parentId !== undefined) category.moveTo(command.parentId);
    if (command.description !== undefined) category.updateDescription(command.description);
    if (command.shortDescription !== undefined) category.updateShortDescription(command.shortDescription);
    if (command.displayOrder !== undefined) category.updateDisplayOrder(command.displayOrder);
    if (command.icon !== undefined) category.updateIcon(command.icon);
    if (command.image !== undefined) category.updateImage(command.image);
    if (command.seoTitle !== undefined || command.seoDescription !== undefined) {
      category.updateSeo(command.seoTitle ?? null, command.seoDescription ?? null);
    }

    await this.repository.save(category);

    this.logger.info(
      { event: 'catalog.category.updated', categoryId: id, tenantId },
      'Category updated',
    );

    return CategoryMapper.toResponse(category);
  }

  async changeStatus(id: string, tenantId: string, status: string): Promise<CategoryResponseDto> {
    const categoryId = new CategoryId(id);
    const category = await this.repository.findById(categoryId);
    if (!category || category.getTenantId() !== tenantId) {
      throw new CatalogException(CATALOG_ERROR_CODES.CATEGORY_NOT_FOUND, 'Category not found');
    }

    switch (status) {
      case 'ACTIVE':
        category.activate();
        break;
      case 'INACTIVE':
        category.deactivate();
        break;
      case 'ARCHIVED':
        category.archive();
        break;
      default:
        throw new CatalogException(
          CATALOG_ERROR_CODES.CATEGORY_INVALID_STATUS_TRANSITION,
          `Invalid status: ${status}`,
        );
    }

    await this.repository.save(category);
    return CategoryMapper.toResponse(category);
  }

  async changeVisibility(id: string, tenantId: string, visibility: string): Promise<CategoryResponseDto> {
    const categoryId = new CategoryId(id);
    const category = await this.repository.findById(categoryId);
    if (!category || category.getTenantId() !== tenantId) {
      throw new CatalogException(CATALOG_ERROR_CODES.CATEGORY_NOT_FOUND, 'Category not found');
    }

    category.changeVisibility(visibility as any);
    await this.repository.save(category);
    return CategoryMapper.toResponse(category);
  }

  async archive(id: string, tenantId: string): Promise<CategoryResponseDto> {
    const categoryId = new CategoryId(id);
    const category = await this.repository.findById(categoryId);
    if (!category || category.getTenantId() !== tenantId) {
      throw new CatalogException(CATALOG_ERROR_CODES.CATEGORY_NOT_FOUND, 'Category not found');
    }

    category.archive();
    await this.repository.save(category);

    this.logger.info(
      { event: 'catalog.category.archived', categoryId: id, tenantId },
      'Category archived',
    );

    return CategoryMapper.toResponse(category);
  }

  async restore(id: string, tenantId: string): Promise<CategoryResponseDto> {
    const categoryId = new CategoryId(id);
    const category = await this.repository.findById(categoryId);
    if (!category || category.getTenantId() !== tenantId) {
      throw new CatalogException(CATALOG_ERROR_CODES.CATEGORY_NOT_FOUND, 'Category not found');
    }

    category.restore();
    await this.repository.save(category);
    return CategoryMapper.toResponse(category);
  }

  async softDelete(id: string, tenantId: string): Promise<void> {
    const categoryId = new CategoryId(id);
    const category = await this.repository.findById(categoryId);
    if (!category || category.getTenantId() !== tenantId) {
      throw new CatalogException(CATALOG_ERROR_CODES.CATEGORY_NOT_FOUND, 'Category not found');
    }

    category.softDelete();
    await this.repository.save(category);

    this.logger.info(
      { event: 'catalog.category.deleted', categoryId: id, tenantId },
      'Category soft deleted',
    );
  }
}
