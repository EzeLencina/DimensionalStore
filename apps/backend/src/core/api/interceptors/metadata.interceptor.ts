import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import type { ApiResponse } from '../types';
import { MetadataService } from '../metadata';

@Injectable()
export class MetadataInterceptor implements NestInterceptor {
  constructor(private readonly metadataService: MetadataService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const startTime = Date.now();

    return next.handle().pipe(
      map(data => {
        if (!this.isApiResponse(data)) {
          return data;
        }

        const executionTimeMs = this.metadataService.getExecutionTime(startTime);

        const record = data as unknown as Record<string, unknown>;
        const existingMeta = record['meta'] as Record<string, unknown> | undefined;

        return {
          ...record,
          meta: {
            ...(existingMeta ?? {}),
            executionTimeMs,
          },
          timestamp: new Date().toISOString(),
        } as unknown as ApiResponse;
      }),
    );
  }

  private isApiResponse(data: unknown): data is ApiResponse {
    if (typeof data !== 'object' || data === null) return false;
    const obj = data as Record<string, unknown>;
    return typeof obj['success'] === 'boolean';
  }
}
