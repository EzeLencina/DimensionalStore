import { SENSITIVE_KEYS } from '../constants';

export function redactSensitive(
  data: Record<string, unknown>,
  censor = '[REDACTED]',
): Record<string, unknown> {
  const lowerKeys = new Set(SENSITIVE_KEYS.map((k) => k.toLowerCase()));

  const redacted: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(data)) {
    if (lowerKeys.has(key.toLowerCase())) {
      redacted[key] = censor;
    } else if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      redacted[key] = redactSensitive(value as Record<string, unknown>, censor);
    } else {
      redacted[key] = value;
    }
  }

  return redacted;
}
