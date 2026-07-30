export const API_TAGS = {
  HEALTH: 'Health',
  METRICS: 'Metrics',
  DOCS: 'Documentation',
} as const;

export const API_TAG_DESCRIPTIONS: Record<string, string> = {
  [API_TAGS.HEALTH]: 'Health check endpoints for monitoring',
  [API_TAGS.METRICS]: 'Performance and usage metrics',
  [API_TAGS.DOCS]: 'API documentation and metadata',
} as const;
