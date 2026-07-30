import type { CollectionResponseDto } from './collection-response.dto';

export type CollectionListQueryDto = {
  status?: string;
  visibility?: string;
  type?: string;
  search?: string;
  activeOnly?: boolean;
  includeDeleted?: boolean;
  sortField?: string;
  sortDirection?: string;
  page?: number;
  limit?: number;
};

export type PaginatedCollectionResponseDto = {
  data: CollectionResponseDto[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};
