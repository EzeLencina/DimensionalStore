import type { VariantResponseDto } from './variant-response.dto';

export type VariantListQueryDto = {
  status?: string;
  search?: string;
  includeDeleted?: boolean;
  sortField?: string;
  sortDirection?: string;
  page?: number;
  limit?: number;
};

export type PaginatedVariantResponseDto = {
  data: VariantResponseDto[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};
