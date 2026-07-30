import type { ApiResponse } from '../types';

export function createSuccessResponse<T>(
  data: T,
  message = 'Success',
  statusCode = 200,
): ApiResponse<T> {
  return {
    success: true,
    statusCode,
    message,
    data,
    timestamp: new Date().toISOString(),
  };
}

export function createSuccessResponseWithMeta<T>(
  data: T,
  meta: ApiResponse['meta'],
  message = 'Success',
  statusCode = 200,
): ApiResponse<T> {
  return {
    success: true,
    statusCode,
    message,
    data,
    meta,
    timestamp: new Date().toISOString(),
  };
}
