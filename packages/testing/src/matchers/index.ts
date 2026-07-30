import { TEST_DEFAULTS } from '../constants';

export function toBeUuid(received: string): { message: () => string; pass: boolean } {
  const pass = TEST_DEFAULTS.UUID_PATTERN.test(received);
  return {
    message: () => `expected ${received} to be a valid UUID`,
    pass,
  };
}

export function toBeIsoDate(received: string): { message: () => string; pass: boolean } {
  const pass = TEST_DEFAULTS.ISO_DATE_PATTERN.test(received);
  return {
    message: () => `expected ${received} to be a valid ISO date`,
    pass,
  };
}

export function toBeInRange(
  received: number,
  min: number,
  max: number,
): { message: () => string; pass: boolean } {
  const pass = received >= min && received <= max;
  return {
    message: () => `expected ${received} to be between ${min} and ${max}`,
    pass,
  };
}

export function toBeSorted(
  received: unknown[],
  direction: 'asc' | 'desc',
  key?: string,
): { message: () => string; pass: boolean } {
  if (!Array.isArray(received)) {
    return { message: () => 'expected an array', pass: false };
  }

  const values = key
    ? received.map(item => (item as Record<string, unknown>)[key])
    : received;

  let pass = true;
  for (let i = 1; i < values.length; i++) {
    const prev = values[i - 1] as number;
    const curr = values[i] as number;
    if (direction === 'asc' && prev > curr) {
      pass = false;
      break;
    }
    if (direction === 'desc' && prev < curr) {
      pass = false;
      break;
    }
  }

  return {
    message: () => `expected array to be sorted ${direction}`,
    pass,
  };
}

export const customMatchers = {
  toBeUuid,
  toBeIsoDate,
  toBeInRange,
  toBeSorted,
};
