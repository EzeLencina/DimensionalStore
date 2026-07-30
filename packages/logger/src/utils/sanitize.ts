export function sanitizeLogInput(value: unknown): unknown {
  if (typeof value === 'string') {
    return value
      .replace(/[\x00-\x08\x0b\x0c\x0e-\x1f]/g, '')
      .slice(0, 10_000);
  }

  if (typeof value === 'object' && value !== null) {
    if (Array.isArray(value)) {
      return value.map(sanitizeLogInput);
    }
    const sanitized: Record<string, unknown> = {};
    for (const [key, val] of Object.entries(value as Record<string, unknown>)) {
      sanitized[key] = sanitizeLogInput(val);
    }
    return sanitized;
  }

  return value;
}
