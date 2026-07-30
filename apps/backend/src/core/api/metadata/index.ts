import { Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import type { RequestMetadata, ApiMetadataContext, RateLimitMetadata } from '../types';
import type { IMetadataService } from '../interfaces';

@Injectable()
export class MetadataService implements IMetadataService {
  create(context: ApiMetadataContext): RequestMetadata {
    return {
      requestId: context.requestId,
      correlationId: context.correlationId,
      apiVersion: context.version,
      timestamp: new Date().toISOString(),
      executionTimeMs: this.getExecutionTime(context.startTime),
      endpoint: context.endpoint,
      method: context.method,
      statusCode: 0,
    };
  }

  addRateLimit(metadata: RequestMetadata, rateLimit: RateLimitMetadata): RequestMetadata {
    return {
      ...metadata,
      rateLimit,
    };
  }

  getExecutionTime(startTime: number): number {
    return Date.now() - startTime;
  }

  generateRequestId(): string {
    return randomUUID();
  }

  generateCorrelationId(): string {
    return randomUUID();
  }
}
