import type { ApiTestResponse } from '../types';
import { TEST_DEFAULTS } from '../constants';

export function assertSuccessResponse<T>(response: ApiTestResponse<T>): void {
  if (!response.success) throw new Error('Expected success response');
  if (response.statusCode < 200 || response.statusCode >= 300) {
    throw new Error(`Expected status code 2xx, got ${response.statusCode}`);
  }
  if (!TEST_DEFAULTS.ISO_DATE_PATTERN.test(response.timestamp)) {
    throw new Error('Invalid ISO date format in timestamp');
  }
}

export function assertErrorResponse(response: ApiTestResponse<unknown>): void {
  if (response.success) throw new Error('Expected error response');
  if (response.statusCode < 400) {
    throw new Error(`Expected status code 4xx/5xx, got ${response.statusCode}`);
  }
}

export function assertPaginatedResponse<T>(response: ApiTestResponse<T[]>): void {
  assertSuccessResponse(response);
  if (!Array.isArray(response.data)) {
    throw new Error('Expected paginated data to be an array');
  }
  if (!response.meta) throw new Error('Expected meta in paginated response');
  if (!response.meta['pagination']) {
    throw new Error('Expected pagination in meta');
  }
}

export function assertPaginationMeta(meta: Record<string, unknown>): void {
  if (meta['page'] === undefined) throw new Error('Expected page in pagination meta');
  if (meta['limit'] === undefined) throw new Error('Expected limit in pagination meta');
  if (meta['totalCount'] === undefined) throw new Error('Expected totalCount in pagination meta');
  if (meta['totalPages'] === undefined) throw new Error('Expected totalPages in pagination meta');
  if (typeof meta['hasNextPage'] !== 'boolean') throw new Error('Expected hasNextPage to be boolean');
  if (typeof meta['hasPreviousPage'] !== 'boolean') throw new Error('Expected hasPreviousPage to be boolean');
}

export function assertUuid(value: string): void {
  if (!TEST_DEFAULTS.UUID_PATTERN.test(value)) {
    throw new Error(`Expected valid UUID, got "${value}"`);
  }
}

export function assertIsoDate(value: string): void {
  if (!TEST_DEFAULTS.ISO_DATE_PATTERN.test(value)) {
    throw new Error(`Expected valid ISO date, got "${value}"`);
  }
}

export function assertDateOrder(earlier: string, later: string): void {
  if (new Date(earlier).getTime() >= new Date(later).getTime()) {
    throw new Error(`Expected "${earlier}" to be before "${later}"`);
  }
}

export function assertNotEmpty<T>(value: T[] | string | Record<string, unknown>): void {
  if (Array.isArray(value)) {
    if (value.length === 0) throw new Error('Expected non-empty array');
  } else if (typeof value === 'string') {
    if (value.length === 0) throw new Error('Expected non-empty string');
  } else {
    if (Object.keys(value).length === 0) throw new Error('Expected non-empty object');
  }
}

export function assertBetween(value: number, min: number, max: number): void {
  if (value < min || value > max) {
    throw new Error(`Expected ${value} to be between ${min} and ${max}`);
  }
}

export function assertDeepClone<T>(original: T, clone: T): void {
  if (JSON.stringify(original) !== JSON.stringify(clone)) {
    throw new Error('Expected deep clone to match original');
  }
  if (clone === original) {
    throw new Error('Expected deep clone to be a different reference');
  }
}

export const Assertions = {
  assertSuccessResponse,
  assertErrorResponse,
  assertPaginatedResponse,
  assertPaginationMeta,
  assertUuid,
  assertIsoDate,
  assertDateOrder,
  assertNotEmpty,
  assertBetween,
  assertDeepClone,
};
