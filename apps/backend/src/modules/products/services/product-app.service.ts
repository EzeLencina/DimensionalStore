import { Injectable, Inject } from '@nestjs/common';
import { LOGGER_TOKEN } from '@tienda/logger/nest';
import type { IProductRepository, ProductListResult } from '../domain/repositories';
import { Product, ProductException, PRODUCT_ERROR_CODES } from '../domain';
import { ProductName, ProductSlug, ProductStatus, ProductVisibility, ProductCondition } from '../domain/value-objects';
import type { IProductService } from '../application/interfaces';
import type {
  CreateProductRequestDto, UpdateProductRequestDto,
  ProductResponseDto, ProductListResponseDto,
} from '../application/dto';
import { ProductMapper } from '../application/mappers';
import { ProductValidators } from '../application/validators';

@Injectable()
export class ProductAppService implements IProductService {
  constructor(
    @Inject('IProductRepository') private readonly repository: IProductRepository,
    @Inject(LOGGER_TOKEN) private readonly logger: any,
  ) {}

  async create(tenantId: string, dto: CreateProductRequestDto): Promise<ProductResponseDto> {
    const errors = ProductValidators.validateCreateInput(dto as unknown as Record<string, unknown>);
    if (errors.length > 0) {
      throw new ProductException(PRODUCT_ERROR_CODES.PRODUCT_INVALID_DATA, errors.join('; '));
    }

    const existingSlug = await this.repository.existsBySlug(dto.slug, tenantId);
    if (existingSlug) {
      throw new ProductException(
        PRODUCT_ERROR_CODES.PRODUCT_SLUG_ALREADY_EXISTS,
        `Slug "${dto.slug}" already exists in this tenant`,
      );
    }

    const product = Product.create({
      tenantId,
      name: dto.name,
      slug: dto.slug,
      shortDescription: dto.shortDescription ?? null,
      description: dto.description ?? null,
      productType: dto.productType ?? 'PHYSICAL',
      visibility: dto.visibility ?? 'PUBLIC',
      condition: dto.condition ?? 'NEW',
      warrantyMonths: dto.warrantyMonths ?? null,
      seoTitle: dto.seoTitle ?? null,
      seoDescription: dto.seoDescription ?? null,
    });

    await this.repository.save(product);

    this.logger.info(
      { event: 'products.product.created', productId: product.getId().toString(), tenantId },
      'Product created',
    );

    return ProductMapper.toResponse(product);
  }

  async findById(id: string, tenantId: string): Promise<ProductResponseDto> {
    const product = await this.repository.findById(id, tenantId);
    if (!product) {
      throw new ProductException(PRODUCT_ERROR_CODES.PRODUCT_NOT_FOUND, 'Product not found');
    }
    return ProductMapper.toResponse(product);
  }

  async findBySlug(slug: string, tenantId: string): Promise<ProductResponseDto> {
    const product = await this.repository.findBySlug(slug, tenantId);
    if (!product) {
      throw new ProductException(PRODUCT_ERROR_CODES.PRODUCT_NOT_FOUND, 'Product not found');
    }
    return ProductMapper.toResponse(product);
  }

  async update(id: string, tenantId: string, dto: UpdateProductRequestDto): Promise<ProductResponseDto> {
    const product = await this.repository.findById(id, tenantId);
    if (!product) {
      throw new ProductException(PRODUCT_ERROR_CODES.PRODUCT_NOT_FOUND, 'Product not found');
    }

    if (dto.name !== undefined) product.rename(dto.name);
    if (dto.slug !== undefined) {
      const existingSlug = await this.repository.existsBySlug(dto.slug, tenantId);
      if (existingSlug && product.getSlug().toString() !== dto.slug) {
        throw new ProductException(
          PRODUCT_ERROR_CODES.PRODUCT_SLUG_ALREADY_EXISTS,
          `Slug "${dto.slug}" already exists in this tenant`,
        );
      }
      product.changeSlug(dto.slug);
    }
    if (dto.shortDescription !== undefined) product.updateShortDescription(dto.shortDescription);
    if (dto.description !== undefined) product.updateDescription(dto.description);
    if (dto.warrantyMonths !== undefined) product.defineWarranty(dto.warrantyMonths);
    if (dto.seoTitle !== undefined || dto.seoDescription !== undefined) {
      product.updateSeo(dto.seoTitle ?? null, dto.seoDescription ?? null);
    }

    await this.repository.save(product);

    this.logger.info(
      { event: 'products.product.updated', productId: id, tenantId },
      'Product updated',
    );

    return ProductMapper.toResponse(product);
  }

  async changeStatus(id: string, tenantId: string, status: string): Promise<ProductResponseDto> {
    const product = await this.repository.findById(id, tenantId);
    if (!product) {
      throw new ProductException(PRODUCT_ERROR_CODES.PRODUCT_NOT_FOUND, 'Product not found');
    }

    switch (status) {
      case 'ACTIVE':
        product.activate();
        break;
      case 'INACTIVE':
        product.deactivate();
        break;
      case 'ARCHIVED':
        product.archive();
        break;
      default:
        throw new ProductException(
          PRODUCT_ERROR_CODES.PRODUCT_INVALID_STATUS_TRANSITION,
          `Invalid status target: ${status}`,
        );
    }

    await this.repository.save(product);

    return ProductMapper.toResponse(product);
  }

  async changeVisibility(id: string, tenantId: string, visibility: string): Promise<ProductResponseDto> {
    const product = await this.repository.findById(id, tenantId);
    if (!product) {
      throw new ProductException(PRODUCT_ERROR_CODES.PRODUCT_NOT_FOUND, 'Product not found');
    }

    product.changeVisibility(visibility as any);
    await this.repository.save(product);

    return ProductMapper.toResponse(product);
  }

  async archive(id: string, tenantId: string): Promise<ProductResponseDto> {
    const product = await this.repository.findById(id, tenantId);
    if (!product) {
      throw new ProductException(PRODUCT_ERROR_CODES.PRODUCT_NOT_FOUND, 'Product not found');
    }

    product.archive();
    await this.repository.save(product);

    this.logger.info(
      { event: 'products.product.archived', productId: id, tenantId },
      'Product archived',
    );

    return ProductMapper.toResponse(product);
  }

  async restore(id: string, tenantId: string): Promise<ProductResponseDto> {
    const product = await this.repository.findById(id, tenantId);
    if (!product) {
      throw new ProductException(PRODUCT_ERROR_CODES.PRODUCT_NOT_FOUND, 'Product not found');
    }

    product.restore();
    await this.repository.save(product);

    this.logger.info(
      { event: 'products.product.restored', productId: id, tenantId },
      'Product restored',
    );

    return ProductMapper.toResponse(product);
  }

  async list(tenantId: string, params?: { page?: number; limit?: number; status?: string; search?: string }): Promise<ProductListResponseDto> {
    const result: ProductListResult = await this.repository.list({
      tenantId,
      status: params?.status ? [params.status] : undefined,
      search: params?.search,
      page: params?.page ?? 1,
      limit: params?.limit ?? 20,
    });

    return ProductMapper.toListResponse(result);
  }
}
