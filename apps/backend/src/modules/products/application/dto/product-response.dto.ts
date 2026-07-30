export interface ProductResponseDto {
  id: string;
  name: string;
  slug: string;
  shortDescription: string | null;
  description: string | null;
  productType: string;
  status: string;
  visibility: string;
  condition: string;
  warrantyMonths: number | null;
  seoTitle: string | null;
  seoDescription: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  version: number;
}

export interface ProductListResponseDto {
  items: ProductResponseDto[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
