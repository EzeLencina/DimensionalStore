export const AUTHZ_CONSTANTS = {
  MAX_ROLE_DEPTH: 10,
  MAX_PERMISSIONS_PER_ROLE: 500,
  MAX_POLICIES: 1000,
  MAX_RULES_PER_POLICY: 100,
  DEFAULT_SCOPE: 'global',
  SYSTEM_ROLE_PREFIX: 'system:',
  PERMISSION_CACHE_TTL_MS: 5 * 60 * 1000,
  ROLE_CACHE_TTL_MS: 5 * 60 * 1000,
  DENY_BY_DEFAULT: true,
  SUPPORTED_ACTIONS: [
    'create', 'read', 'update', 'delete', 'list',
    'export', 'import', 'approve', 'cancel',
    'archive', 'restore', 'manage',
  ] as const,
  SUPPORTED_SCOPES: [
    'global', 'organization', 'branch', 'department',
    'owner', 'self', 'custom',
  ] as const,
} as const;
