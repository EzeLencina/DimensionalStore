import {
  Controller, Get, Post, Patch, Param, Query, Body,
  HttpStatus, HttpCode, Inject,
} from '@nestjs/common';
import type { IProductService } from '../../application/interfaces';
import type {
  CreateProductRequestDto, UpdateProductRequestDto,
  ChangeStatusRequestDto, ChangeVisibilityRequestDto,
  ProductResponseDto, ProductListResponseDto,
} from '../../application/dto';

@Controller('api/v1/products')
export class ProductController {
  constructor(
    @Inject('IProductService') private readonly productService: IProductService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() dto: CreateProductRequestDto,
  ): Promise<ProductResponseDto> {
    const tenantId = 'default';
    return this.productService.create(tenantId, dto);
  }

  @Get(':id')
  async findById(
    @Param('id') id: string,
  ): Promise<ProductResponseDto> {
    const tenantId = 'default';
    return this.productService.findById(id, tenantId);
  }

  @Get('slug/:slug')
  async findBySlug(
    @Param('slug') slug: string,
  ): Promise<ProductResponseDto> {
    const tenantId = 'default';
    return this.productService.findBySlug(slug, tenantId);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateProductRequestDto,
  ): Promise<ProductResponseDto> {
    const tenantId = 'default';
    return this.productService.update(id, tenantId, dto);
  }

  @Patch(':id/status')
  async changeStatus(
    @Param('id') id: string,
    @Body() dto: ChangeStatusRequestDto,
  ): Promise<ProductResponseDto> {
    const tenantId = 'default';
    return this.productService.changeStatus(id, tenantId, dto.status);
  }

  @Patch(':id/visibility')
  async changeVisibility(
    @Param('id') id: string,
    @Body() dto: ChangeVisibilityRequestDto,
  ): Promise<ProductResponseDto> {
    const tenantId = 'default';
    return this.productService.changeVisibility(id, tenantId, dto.visibility);
  }

  @Post(':id/archive')
  @HttpCode(HttpStatus.OK)
  async archive(
    @Param('id') id: string,
  ): Promise<ProductResponseDto> {
    const tenantId = 'default';
    return this.productService.archive(id, tenantId);
  }

  @Post(':id/restore')
  @HttpCode(HttpStatus.OK)
  async restore(
    @Param('id') id: string,
  ): Promise<ProductResponseDto> {
    const tenantId = 'default';
    return this.productService.restore(id, tenantId);
  }

  @Get()
  async list(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('status') status?: string,
    @Query('search') search?: string,
  ): Promise<ProductListResponseDto> {
    const tenantId = 'default';
    return this.productService.list(tenantId, {
      page: page ? parseInt(page, 10) : undefined,
      limit: limit ? parseInt(limit, 10) : undefined,
      status,
      search,
    });
  }
}
