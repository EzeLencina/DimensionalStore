import { Injectable, NestInterceptor, ExecutionContext, CallHandler, Logger } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import type { ApiResponse } from '../types';
import { ResponseBuilder } from '../builders/response.builder';

@Injectable()
export class ResponseFormatInterceptor implements NestInterceptor {
  private readonly logger = new Logger(ResponseFormatInterceptor.name);

  constructor(private readonly responseBuilder: ResponseBuilder) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const request = context.switchToHttp().getRequest();
    const headers = request.headers as Record<string, string>;
    const requestId = headers['x-request-id'] ?? undefined;
    const correlationId = headers['x-correlation-id'] ?? undefined;

    return next.handle().pipe(
      map(data => {
        if (this.isApiResponse(data)) {
          return data;
        }

        const meta: Record<string, unknown> = {};
        if (requestId) meta['requestId'] = requestId;
        if (correlationId) meta['correlationId'] = correlationId;

        return this.responseBuilder.success(data, 'Success', 200, meta);
      }),
    );
  }

  private isApiResponse(data: unknown): data is ApiResponse {
    if (typeof data !== 'object' || data === null) return false;
    const obj = data as Record<string, unknown>;
    return typeof obj['success'] === 'boolean' && typeof obj['statusCode'] === 'number' && 'data' in obj;
  }
}
