import type { BrandResponseDto } from './brand-response.dto';

export type BrandListQueryDto = {
  status?: string;
  visibility?: string;
  search?: string;
  includeDeleted?: boolean;
  sortField?: string;
  sortDirection?: string;
  page?: number;
  limit?: number;
};

export type PaginatedBrandResponseDto = {
  data: BrandResponseDto[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};
