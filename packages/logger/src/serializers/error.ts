export function serializeError(error: unknown): Record<string, unknown> {
  if (!(error instanceof Error)) {
    return { value: String(error) };
  }

  return {
    type: error.constructor.name,
    message: error.message,
    stack: error.stack,
    ...(error.cause ? { cause: String(error.cause) } : {}),
  };
}
