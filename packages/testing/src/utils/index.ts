import { randomUUID } from 'node:crypto';
import type { PaginationTestParams, ApiTestResponse } from '../types';

export function createPaginationParams(
  overrides?: Partial<PaginationTestParams>,
): PaginationTestParams {
  return {
    page: overrides?.page ?? 1,
    limit: overrides?.limit ?? 20,
    totalCount: overrides?.totalCount ?? 100,
  };
}

export function createApiResponse<T>(
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

export function generateRequestId(): string {
  return randomUUID();
}

export function generateCorrelationId(): string {
  return randomUUID();
}

export function buildQueryString(
  params: Record<string, string | number | boolean | undefined | null>,
): string {
  const entries = Object.entries(params)
    .filter(([_, v]) => v != null)
    .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`);

  return entries.length > 0 ? `?${entries.join('&')}` : '';
}

export function parseQueryString(query: string): Record<string, string> {
  const params: Record<string, string> = {};
  const searchParams = new URLSearchParams(query.startsWith('?') ? query.slice(1) : query);

  searchParams.forEach((value, key) => {
    params[key] = value;
  });

  return params;
}

export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export function isPromise(value: unknown): value is Promise<unknown> {
  return typeof value === 'object' && value !== null && 'then' in value;
}
