import type { ApiTestResponse } from '@tienda/testing';

export function createTestResponse<T>(
  data: T,
  overrides?: Partial<ApiTestResponse<T>>,
): ApiTestResponse<T> {
  return {
    success: overrides?.success ?? true,
    statusCode: overrides?.statusCode ?? 200,
    message: overrides?.message ?? 'Success',
    data,
    meta: overrides?.meta,
    timestamp: overrides?.timestamp ?? new Date().toISOString(),
  };
}

export function createTestHeaders(overrides?: Record<string, string>): Record<string, string> {
  return {
    'x-request-id': 'test-request-id',
    'x-correlation-id': 'test-correlation-id',
    'content-type': 'application/json',
    ...overrides,
  };
}
