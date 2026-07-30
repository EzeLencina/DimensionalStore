import type { RequestMetadata, ApiMetadataContext, RateLimitMetadata } from '../types';

export interface IMetadataService {
  create(context: ApiMetadataContext): RequestMetadata;

  addRateLimit(metadata: RequestMetadata, rateLimit: RateLimitMetadata): RequestMetadata;

  getExecutionTime(startTime: number): number;

  generateRequestId(): string;

  generateCorrelationId(): string;
}
