import type { PaginationMeta } from './pagination.types';
import type { RequestMetadata } from './metadata.types';

export interface ApiResponse<T = unknown> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
  meta?: ResponseMeta;
  timestamp: string;
}

export interface ResponseMeta {
  requestId?: string;
  correlationId?: string;
  version?: string;
  pagination?: PaginationMeta;
  executionTimeMs?: number;
  [key: string]: unknown;
}

export interface ApiPaginatedResponse<T = unknown> extends ApiResponse<T[]> {
  meta: ResponseMeta & {
    pagination: PaginationMeta;
  };
}

export interface ApiErrorResponse {
  success: false;
  statusCode: number;
  message: string;
  error: {
    code: string;
    details?: Record<string, unknown> | null;
    errors?: ValidationError[];
  };
  timestamp: string;
  requestId?: string;
}

export interface ValidationError {
  field: string;
  message: string;
  code?: string;
}

export type ResponseFormat = 'json' | 'csv' | 'xml';
