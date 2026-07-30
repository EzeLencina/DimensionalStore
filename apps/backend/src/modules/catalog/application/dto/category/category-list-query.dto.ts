export type CategoryListQueryDto = {
  parentId?: string | null;
  status?: string;
  visibility?: string;
  search?: string;
  includeDeleted?: boolean;
  sortField?: string;
  sortDirection?: string;
  page?: number;
  limit?: number;
};

export type PaginatedCategoryResponseDto = {
  data: CategoryResponseDto[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

import type { CategoryResponseDto } from './category-response.dto';
