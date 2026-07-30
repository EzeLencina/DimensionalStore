export type UUID = string;

export type Nullable<T> = T | null;

export type DeepPartial<T> = T extends Record<string, unknown>
  ? { [P in keyof T]?: DeepPartial<T[P]> }
  : T;

export type SortOrder = 'asc' | 'desc';

export interface PaginationParams {
  page: number;
  perPage: number;
  sortBy?: string;
  sortOrder?: SortOrder;
}

export interface PaginationMeta {
  page: number;
  perPage: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface PaginatedResult<T> {
  items: T[];
  pagination: PaginationMeta;
}

export type ApiSuccessResponse<T> = {
  success: true;
  data: T;
  timestamp: string;
  requestId: string;
};

export type ApiErrorDetail = {
  code: string;
  message: string;
  details: Record<string, string[]> | null;
};

export type ApiErrorResponse = {
  success: false;
  error: ApiErrorDetail;
  timestamp: string;
  requestId: string;
};

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;

export type Result<T, E = Error> =
  | { success: true; value: T }
  | { success: false; error: E };

export type AsyncResult<T, E = Error> = Promise<Result<T, E>>;

export interface Identifiable {
  id: UUID;
}

export interface Timestampable {
  createdAt: string;
  updatedAt: string;
}

export interface SoftDeletable {
  deletedAt: string | null;
}

export interface TenantScoped {
  tenantId: UUID;
}

export interface Auditable {
  createdAt: string;
  createdBy: UUID;
  updatedAt: string;
  updatedBy: UUID;
}

export type Status = 'ACTIVE' | 'INACTIVE' | 'DRAFT' | 'ARCHIVED';

export type DateRange = {
  start: string;
  end: string;
};

export type KeyValuePair<K = string, V = unknown> = {
  key: K;
  value: V;
};
