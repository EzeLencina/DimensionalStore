export const ErrorCodes = {
  // ── Authentication ────────────────────────
  AUTH_001: { code: 'AUTH_001', httpStatus: 401, message: 'Authentication required' },
  AUTH_002: { code: 'AUTH_002', httpStatus: 403, message: 'Insufficient permissions' },
  AUTH_003: { code: 'AUTH_003', httpStatus: 401, message: 'Invalid credentials' },
  AUTH_004: { code: 'AUTH_004', httpStatus: 401, message: 'Token expired' },
  AUTH_005: { code: 'AUTH_005', httpStatus: 401, message: 'Invalid token' },
  AUTH_006: { code: 'AUTH_006', httpStatus: 401, message: 'Session expired' },

  // ── Validation ────────────────────────────
  VALIDATION_001: { code: 'VALIDATION_001', httpStatus: 400, message: 'Validation failed' },
  VALIDATION_002: { code: 'VALIDATION_002', httpStatus: 400, message: 'Invalid input format' },
  VALIDATION_003: { code: 'VALIDATION_003', httpStatus: 400, message: 'Missing required field' },

  // ── Not Found ─────────────────────────────
  NOT_FOUND_001: { code: 'NOT_FOUND_001', httpStatus: 404, message: 'Resource not found' },
  NOT_FOUND_002: { code: 'NOT_FOUND_002', httpStatus: 404, message: 'Route not found' },

  // ── Conflict ──────────────────────────────
  CONFLICT_001: { code: 'CONFLICT_001', httpStatus: 409, message: 'Resource already exists' },
  CONFLICT_002: { code: 'CONFLICT_002', httpStatus: 409, message: 'Resource in use' },

  // ── Business ──────────────────────────────
  BUSINESS_001: { code: 'BUSINESS_001', httpStatus: 422, message: 'Business rule violation' },
  BUSINESS_002: { code: 'BUSINESS_002', httpStatus: 422, message: 'Invalid state transition' },

  // ── Database ──────────────────────────────
  DB_001: { code: 'DB_001', httpStatus: 500, message: 'Database operation failed' },
  DB_002: { code: 'DB_002', httpStatus: 500, message: 'Database connection lost' },
  DB_003: { code: 'DB_003', httpStatus: 409, message: 'Duplicate entry' },
  DB_004: { code: 'DB_004', httpStatus: 500, message: 'Migration pending' },

  // ── Cache ─────────────────────────────────
  CACHE_001: { code: 'CACHE_001', httpStatus: 500, message: 'Cache operation failed' },
  CACHE_002: { code: 'CACHE_002', httpStatus: 500, message: 'Cache connection lost' },

  // ── Rate Limit ────────────────────────────
  RATE_LIMIT_001: { code: 'RATE_LIMIT_001', httpStatus: 429, message: 'Too many requests' },

  // ── External Services ─────────────────────
  EXTERNAL_001: { code: 'EXTERNAL_001', httpStatus: 502, message: 'External service error' },
  EXTERNAL_002: { code: 'EXTERNAL_002', httpStatus: 502, message: 'External service timeout' },
  EXTERNAL_003: { code: 'EXTERNAL_003', httpStatus: 502, message: 'External service unavailable' },

  // ── Infrastructure ────────────────────────
  INFRA_001: { code: 'INFRA_001', httpStatus: 500, message: 'Internal server error' },
  INFRA_002: { code: 'INFRA_002', httpStatus: 503, message: 'Service unavailable' },

  // ── Configuration ─────────────────────────
  CONFIG_001: { code: 'CONFIG_001', httpStatus: 500, message: 'Application configuration error' },
  CONFIG_002: { code: 'CONFIG_002', httpStatus: 500, message: 'Missing environment variable' },

  // ── HTTP (fallback) ───────────────────────
  HTTP_ERROR: { code: 'HTTP_ERROR', httpStatus: 500, message: 'An unexpected error occurred' },
} as const;

export type ErrorCode = keyof typeof ErrorCodes;
export type ErrorCodeEntry = (typeof ErrorCodes)[ErrorCode];
