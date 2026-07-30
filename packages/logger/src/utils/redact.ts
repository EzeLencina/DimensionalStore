const SENSITIVE_PATTERNS = [
  /password/i,
  /secret/i,
  /token/i,
  /api[_-]?key/i,
  /authorization/i,
  /jwt/i,
  /refresh[_-]?token/i,
  /credit[_-]?card/i,
  /ssn/i,
  /private[_-]?key/i,
];

export function isSensitiveKey(key: string): boolean {
  return SENSITIVE_PATTERNS.some((pattern) => pattern.test(key));
}

export function redactDeep<T>(value: T, censor = '[REDACTED]'): T {
  if (typeof value !== 'object' || value === null) {
    return value;
  }

  if (Array.isArray(value)) {
    return value.map((item) => redactDeep(item, censor)) as unknown as T;
  }

  const result = { ...value } as Record<string, unknown>;

  for (const key of Object.keys(result)) {
    if (isSensitiveKey(key)) {
      result[key] = censor;
    } else if (typeof result[key] === 'object' && result[key] !== null) {
      result[key] = redactDeep(result[key], censor);
    }
  }

  return result as T;
}
