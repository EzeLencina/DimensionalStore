import type { Product } from '../aggregates/product.aggregate';

export type ProductListParams = {
  tenantId: string;
  status?: string[];
  visibility?: string[];
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
};

export type ProductListResult = {
  items: Product[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export interface IProductRepository {
  save(product: Product): Promise<void>;
  findById(id: string, tenantId: string): Promise<Product | null>;
  findBySlug(slug: string, tenantId: string): Promise<Product | null>;
  existsBySlug(slug: string, tenantId: string): Promise<boolean>;
  list(params: ProductListParams): Promise<ProductListResult>;
  delete(id: string, tenantId: string): Promise<void>;
}
