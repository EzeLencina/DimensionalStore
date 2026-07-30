// ──────────────────────────────────────────────
// @tienda/validators — Validation infrastructure
// ──────────────────────────────────────────────

// Legacy schemas (backward compat)
export * from './common';
export * from './string';
export * from './number';
export * from './date';

// Core validation engine
export { validate } from './core';

// Helpers
export {
  isEmail,
  isUUID,
  isURL,
  isPhone,
  isSlug,
  isCurrency,
  isPositive,
  isPercentage,
} from './helpers';

// Transformers
export {
  trim,
  lowercase,
  uppercase,
  normalize,
  sanitize,
  parseNumber,
  parseBoolean,
  parseDate,
} from './transformers';

// Error mappers
export {
  mapZodErrorToValidationErrors,
  mapZodErrorToMessage,
  formatZodErrors,
} from './mappers';

// NestJS Pipes
export {
  ZodValidationPipe,
  ParseUUIDPipe,
  ParseDatePipe,
  PaginationPipe,
  SortingPipe,
  SearchPipe,
} from './pipes';
export type {
  PaginationInput,
  PaginationOutput,
  SortingInput,
  SortingOutput,
  SearchInput,
  SearchOutput,
} from './pipes';

// Types
export type {
  ValidationResult,
  ValidationError,
  ValidationMode,
} from './types';

// Constants
export {
  VALIDATION_ERROR_PREFIX,
  DEFAULT_VALIDATION_MODE,
  MAX_VALIDATION_ERRORS,
  VALIDATION_ERROR_CODES,
} from './constants';
