import { ZodError } from 'zod';
import type { ValidationError } from '../types';
import { MAX_VALIDATION_ERRORS, VALIDATION_ERROR_CODES } from '../constants';

export function mapZodErrorToValidationErrors(error: ZodError): ValidationError[] {
  return error.issues.slice(0, MAX_VALIDATION_ERRORS).map((issue) => ({
    field: issue.path.join('.'),
    message: issue.message,
    code: mapIssueCode(issue.code),
    received: issue.code === 'invalid_type' ? (issue as any).received : undefined,
  }));
}

export function mapZodErrorToMessage(error: ZodError): string {
  const first = error.issues[0];
  if (!first) return 'Validation failed';

  const path = first.path.length > 0 ? first.path.join('.') : 'value';
  return `${path}: ${first.message}`;
}

function mapIssueCode(code: string): string {
  const map: Record<string, string> = {
    invalid_type: VALIDATION_ERROR_CODES.INVALID_TYPE,
    invalid_string: VALIDATION_ERROR_CODES.INVALID_FORMAT,
    too_small: VALIDATION_ERROR_CODES.TOO_SHORT,
    too_big: VALIDATION_ERROR_CODES.TOO_LONG,
    invalid_enum_value: VALIDATION_ERROR_CODES.INVALID_ENUM,
    custom: VALIDATION_ERROR_CODES.CUSTOM,
  };
  return map[code] ?? VALIDATION_ERROR_CODES.CUSTOM;
}

export function formatZodErrors(error: ZodError): Record<string, string[]> {
  const formatted: Record<string, string[]> = {};

  for (const issue of error.issues) {
    const path = issue.path.join('.') || '_root';
    if (!formatted[path]) {
      formatted[path] = [];
    }
    formatted[path].push(issue.message);
  }

  return formatted;
}
