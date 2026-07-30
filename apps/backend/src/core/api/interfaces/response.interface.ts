import type { ApiResponse, ApiPaginatedResponse, ApiErrorResponse, ResponseMeta } from '../types';

export interface IResponseBuilder {
  success<T>(data: T, message?: string, statusCode?: number, meta?: ResponseMeta): ApiResponse<T>;

  created<T>(data: T, message?: string): ApiResponse<T>;

  updated<T>(data: T, message?: string): ApiResponse<T>;

  deleted(message?: string): ApiResponse<null>;

  paginated<T>(
    data: T[],
    paginationMeta: ResponseMeta['pagination'],
    message?: string,
  ): ApiPaginatedResponse<T>;

  error(
    statusCode: number,
    message: string,
    code: string,
    details?: Record<string, unknown> | null,
    requestId?: string,
  ): ApiErrorResponse;

  withMeta<T>(response: ApiResponse<T>, meta: Partial<ResponseMeta>): ApiResponse<T>;
}
