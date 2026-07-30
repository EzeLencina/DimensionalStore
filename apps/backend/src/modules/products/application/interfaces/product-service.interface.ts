import type { ProductResponseDto, ProductListResponseDto, CreateProductRequestDto, UpdateProductRequestDto } from '../dto';

export interface IProductService {
  create(tenantId: string, dto: CreateProductRequestDto): Promise<ProductResponseDto>;
  findById(id: string, tenantId: string): Promise<ProductResponseDto>;
  findBySlug(slug: string, tenantId: string): Promise<ProductResponseDto>;
  update(id: string, tenantId: string, dto: UpdateProductRequestDto): Promise<ProductResponseDto>;
  changeStatus(id: string, tenantId: string, status: string): Promise<ProductResponseDto>;
  changeVisibility(id: string, tenantId: string, visibility: string): Promise<ProductResponseDto>;
  archive(id: string, tenantId: string): Promise<ProductResponseDto>;
  restore(id: string, tenantId: string): Promise<ProductResponseDto>;
  list(tenantId: string, params?: { page?: number; limit?: number; status?: string; search?: string }): Promise<ProductListResponseDto>;
}
