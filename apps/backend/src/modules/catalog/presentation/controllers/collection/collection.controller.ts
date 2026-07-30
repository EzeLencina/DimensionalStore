import {
  Controller, Get, Post, Put, Patch, Delete,
  Param, Query, Body, Headers, HttpCode, HttpStatus,
} from '@nestjs/common';
import { CollectionAppService } from '../../../services/collection-app.service';
import { CreateCollectionCommand, UpdateCollectionCommand } from '../../../application/commands/collection';
import type { CollectionResponseDto } from '../../../application/dto/collection';
import type { CollectionListQueryDto, PaginatedCollectionResponseDto } from '../../../application/dto/collection';

@Controller('collections')
export class CollectionController {
  constructor(private readonly collectionService: CollectionAppService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Headers('X-Tenant-Id') tenantId: string,
    @Body() body: {
      name: string;
      slug?: string;
      description?: string | null;
      type?: string;
      status?: string;
      visibility?: string;
      displayOrder?: number;
      startAt?: string | null;
      endAt?: string | null;
      seoTitle?: string | null;
      seoDescription?: string | null;
    },
  ): Promise<CollectionResponseDto> {
    const command = new CreateCollectionCommand(
      tenantId,
      body.name,
      body.slug ?? '',
      body.description,
      body.type,
      body.status,
      body.visibility,
      body.displayOrder,
      body.startAt,
      body.endAt,
      body.seoTitle,
      body.seoDescription,
    );
    return this.collectionService.create(tenantId, command);
  }

  @Get()
  async findAll(
    @Headers('X-Tenant-Id') tenantId: string,
    @Query() query: CollectionListQueryDto,
  ): Promise<PaginatedCollectionResponseDto> {
    return this.collectionService.findAll(tenantId, query);
  }

  @Get('active')
  async findActive(
    @Headers('X-Tenant-Id') tenantId: string,
  ): Promise<CollectionResponseDto[]> {
    const result = await this.collectionService.findAll(tenantId, { activeOnly: true, status: 'ACTIVE' });
    return result.data;
  }

  @Get('slug/:slug')
  async findBySlug(
    @Headers('X-Tenant-Id') tenantId: string,
    @Param('slug') slug: string,
  ): Promise<CollectionResponseDto> {
    return this.collectionService.findBySlug(slug, tenantId);
  }

  @Get(':id')
  async findById(
    @Headers('X-Tenant-Id') tenantId: string,
    @Param('id') id: string,
  ): Promise<CollectionResponseDto> {
    return this.collectionService.findById(id, tenantId);
  }

  @Put(':id')
  async update(
    @Headers('X-Tenant-Id') tenantId: string,
    @Param('id') id: string,
    @Body() body: {
      name?: string;
      slug?: string;
      description?: string | null;
      type?: string;
      displayOrder?: number;
      startAt?: string | null;
      endAt?: string | null;
      seoTitle?: string | null;
      seoDescription?: string | null;
    },
  ): Promise<CollectionResponseDto> {
    const command = new UpdateCollectionCommand(
      id, tenantId,
      body.name, body.slug, body.description,
      body.type, body.displayOrder,
      body.startAt, body.endAt,
      body.seoTitle, body.seoDescription,
    );
    return this.collectionService.update(id, tenantId, command);
  }

  @Patch(':id/status')
  async changeStatus(
    @Headers('X-Tenant-Id') tenantId: string,
    @Param('id') id: string,
    @Body('status') status: string,
  ): Promise<CollectionResponseDto> {
    return this.collectionService.changeStatus(id, tenantId, status);
  }

  @Patch(':id/visibility')
  async changeVisibility(
    @Headers('X-Tenant-Id') tenantId: string,
    @Param('id') id: string,
    @Body('visibility') visibility: string,
  ): Promise<CollectionResponseDto> {
    return this.collectionService.changeVisibility(id, tenantId, visibility);
  }

  @Patch(':id/archive')
  async archive(
    @Headers('X-Tenant-Id') tenantId: string,
    @Param('id') id: string,
  ): Promise<CollectionResponseDto> {
    return this.collectionService.archive(id, tenantId);
  }

  @Patch(':id/restore')
  async restore(
    @Headers('X-Tenant-Id') tenantId: string,
    @Param('id') id: string,
  ): Promise<CollectionResponseDto> {
    return this.collectionService.restore(id, tenantId);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(
    @Headers('X-Tenant-Id') tenantId: string,
    @Param('id') id: string,
  ): Promise<void> {
    return this.collectionService.softDelete(id, tenantId);
  }
}
