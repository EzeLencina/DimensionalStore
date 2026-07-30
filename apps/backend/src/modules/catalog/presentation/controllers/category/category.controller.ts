import {
  Controller, Get, Post, Put, Patch, Delete,
  Param, Query, Body, Headers, HttpCode, HttpStatus,
} from '@nestjs/common';
import { CategoryAppService } from '../../../services/category-app.service';
import { CreateCategoryCommand, UpdateCategoryCommand } from '../../../application/commands/category';
import type { CategoryResponseDto } from '../../../application/dto/category';
import type { CategoryListQueryDto, PaginatedCategoryResponseDto } from '../../../application/dto/category';

@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryAppService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Headers('X-Tenant-Id') tenantId: string,
    @Body() body: {
      name: string;
      slug?: string;
      parentId?: string | null;
      description?: string | null;
      shortDescription?: string | null;
      status?: string;
      visibility?: string;
      displayOrder?: number;
      icon?: string | null;
      image?: string | null;
      seoTitle?: string | null;
      seoDescription?: string | null;
    },
  ): Promise<CategoryResponseDto> {
    const command = new CreateCategoryCommand(
      tenantId,
      body.name,
      body.slug ?? '',
      body.parentId,
      body.description,
      body.shortDescription,
      body.status,
      body.visibility,
      body.displayOrder,
      body.icon,
      body.image,
      body.seoTitle,
      body.seoDescription,
    );
    return this.categoryService.create(tenantId, command);
  }

  @Get()
  async findAll(
    @Headers('X-Tenant-Id') tenantId: string,
    @Query() query: CategoryListQueryDto,
  ): Promise<PaginatedCategoryResponseDto> {
    return this.categoryService.findAll(tenantId, query);
  }

  @Get('root')
  async findRoots(
    @Headers('X-Tenant-Id') tenantId: string,
  ): Promise<CategoryResponseDto[]> {
    const result = await this.categoryService.findAll(tenantId, { parentId: null as any });
    return result.data;
  }

  @Get('slug/:slug')
  async findBySlug(
    @Headers('X-Tenant-Id') tenantId: string,
    @Param('slug') slug: string,
  ): Promise<CategoryResponseDto> {
    return this.categoryService.findBySlug(slug, tenantId);
  }

  @Get(':id')
  async findById(
    @Headers('X-Tenant-Id') tenantId: string,
    @Param('id') id: string,
  ): Promise<CategoryResponseDto> {
    return this.categoryService.findById(id, tenantId);
  }

  @Put(':id')
  async update(
    @Headers('X-Tenant-Id') tenantId: string,
    @Param('id') id: string,
    @Body() body: {
      name?: string;
      slug?: string;
      parentId?: string | null;
      description?: string | null;
      shortDescription?: string | null;
      displayOrder?: number;
      icon?: string | null;
      image?: string | null;
      seoTitle?: string | null;
      seoDescription?: string | null;
    },
  ): Promise<CategoryResponseDto> {
    const command = new UpdateCategoryCommand(
      id, tenantId,
      body.name, body.slug, body.parentId,
      body.description, body.shortDescription,
      body.displayOrder, body.icon, body.image,
      body.seoTitle, body.seoDescription,
    );
    return this.categoryService.update(id, tenantId, command);
  }

  @Patch(':id/status')
  async changeStatus(
    @Headers('X-Tenant-Id') tenantId: string,
    @Param('id') id: string,
    @Body('status') status: string,
  ): Promise<CategoryResponseDto> {
    return this.categoryService.changeStatus(id, tenantId, status);
  }

  @Patch(':id/visibility')
  async changeVisibility(
    @Headers('X-Tenant-Id') tenantId: string,
    @Param('id') id: string,
    @Body('visibility') visibility: string,
  ): Promise<CategoryResponseDto> {
    return this.categoryService.changeVisibility(id, tenantId, visibility);
  }

  @Patch(':id/archive')
  async archive(
    @Headers('X-Tenant-Id') tenantId: string,
    @Param('id') id: string,
  ): Promise<CategoryResponseDto> {
    return this.categoryService.archive(id, tenantId);
  }

  @Patch(':id/restore')
  async restore(
    @Headers('X-Tenant-Id') tenantId: string,
    @Param('id') id: string,
  ): Promise<CategoryResponseDto> {
    return this.categoryService.restore(id, tenantId);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(
    @Headers('X-Tenant-Id') tenantId: string,
    @Param('id') id: string,
  ): Promise<void> {
    return this.categoryService.softDelete(id, tenantId);
  }
}
