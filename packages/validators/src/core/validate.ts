import { z } from 'zod';
import type { ValidationResult, ValidationError } from '../types';
import { MAX_VALIDATION_ERRORS, VALIDATION_ERROR_CODES } from '../constants';

export function validate<T>(
  schema: z.ZodType<T>,
  input: unknown,
): ValidationResult {
  const parsed = schema.safeParse(input);

  if (parsed.success) {
    return { success: true, data: parsed.data };
  }

  const errors: ValidationError[] = parsed.error.issues
    .slice(0, MAX_VALIDATION_ERRORS)
    .map(mapZodIssue);

  return { success: false, errors };
}

export function validateObject(
  schema: z.ZodObject<any, any>,
  input: unknown,
  mode: 'strict' | 'strip' | 'passthrough' = 'strip',
): ValidationResult {
  let effective = schema;

  if (mode === 'strict') {
    effective = schema.strict();
  } else if (mode === 'passthrough') {
    effective = schema.passthrough();
  }

  const parsed = effective.safeParse(input);

  if (parsed.success) {
    return { success: true, data: parsed.data };
  }

  const errors: ValidationError[] = parsed.error.issues
    .slice(0, MAX_VALIDATION_ERRORS)
    .map(mapZodIssue);

  return { success: false, errors };
}

function mapZodIssue(issue: z.ZodIssue): ValidationError {
  return {
    field: issue.path.join('.'),
    message: issue.message,
    code: mapZodCode(issue.code),
    received: issue.code === 'invalid_type' ? (issue as any).received : undefined,
    expected: issue.code === 'invalid_type' ? (issue as any).expected : undefined,
  };
}

function mapZodCode(code: z.ZodIssueCode): string {
  const map: Record<string, string> = {
    invalid_type: VALIDATION_ERROR_CODES.INVALID_TYPE,
    invalid_literal: VALIDATION_ERROR_CODES.INVALID_FORMAT,
    custom: VALIDATION_ERROR_CODES.CUSTOM,
    invalid_union: VALIDATION_ERROR_CODES.INVALID_TYPE,
    invalid_enum_value: VALIDATION_ERROR_CODES.INVALID_ENUM,
    too_small: VALIDATION_ERROR_CODES.TOO_SHORT,
    too_big: VALIDATION_ERROR_CODES.TOO_LONG,
    invalid_string: VALIDATION_ERROR_CODES.INVALID_FORMAT,
  };
  return map[code] ?? VALIDATION_ERROR_CODES.CUSTOM;
}
