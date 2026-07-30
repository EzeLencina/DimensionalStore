export interface RequestMetadata {
  requestId: string;
  correlationId?: string;
  apiVersion: string;
  timestamp: string;
  executionTimeMs: number;
  endpoint: string;
  method: string;
  statusCode: number;
  rateLimit?: RateLimitMetadata;
}

export interface RateLimitMetadata {
  limit: number;
  remaining: number;
  reset: number;
}

export interface ApiMetadataContext {
  version: string;
  startTime: number;
  requestId: string;
  correlationId?: string;
  endpoint: string;
  method: string;
}
