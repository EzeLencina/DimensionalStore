export type PaginationType = 'offset' | 'cursor';

export interface OffsetPaginationParams {
  page: number;
  limit: number;
}

export interface CursorPaginationParams {
  cursor?: string;
  limit: number;
}

export type PaginationParams = OffsetPaginationParams | CursorPaginationParams;

export interface PaginationMeta {
  type: PaginationType;
  page?: number;
  limit: number;
  totalCount?: number;
  totalPages?: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  nextCursor?: string;
  previousCursor?: string;
}

export interface PaginationLinks {
  self: string;
  first?: string;
  last?: string;
  next?: string;
  previous?: string;
}

export interface OffsetPaginationInput {
  page?: number;
  limit?: number;
  maxLimit?: number;
  defaultLimit?: number;
}

export interface CursorPaginationInput {
  cursor?: string;
  limit?: number;
  maxLimit?: number;
  defaultLimit?: number;
}
