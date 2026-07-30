import type { ExecutionContext } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import type { CallHandler } from '@nestjs/common';
import type { NestInterceptor } from '@nestjs/common';
import type { Logger } from '../types';
import { serializeError } from '../serializers/error';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(private readonly logger: Logger) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const start = Date.now();
    const request = context.switchToHttp().getRequest();
    const method = request.method;
    const url = request.url;
    const requestId = request.requestId;
    const correlationId = request.correlationId;

    this.logger.info({
      message: `→ ${method} ${url}`,
      method,
      url,
      requestId,
      correlationId,
    });

    return next.handle().pipe(
      tap({
        next: () => {
          const duration = Date.now() - start;
          const response = context.switchToHttp().getResponse();

          this.logger.info({
            message: `← ${method} ${url} ${response.statusCode}`,
            method,
            url,
            statusCode: response.statusCode,
            duration,
            requestId,
            correlationId,
          });
        },
        error: (error: Error) => {
          const duration = Date.now() - start;

          this.logger.error({
            message: `✗ ${method} ${url} - ${error.message}`,
            method,
            url,
            duration,
            error,
            requestId,
            correlationId,
            data: serializeError(error) as Record<string, unknown>,
          });
        },
      }),
    );
  }
}
