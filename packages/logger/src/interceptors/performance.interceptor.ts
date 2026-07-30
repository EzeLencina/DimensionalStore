import type { ExecutionContext } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import type { CallHandler, NestInterceptor } from '@nestjs/common';
import type { Logger } from '../types';

@Injectable()
export class PerformanceInterceptor implements NestInterceptor {
  constructor(
    private readonly logger: Logger,
    private readonly thresholdMs = 1000,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const start = Date.now();
    const handler = context.getHandler().name;
    const controller = context.getClass().name;

    return next.handle().pipe(
      tap(() => {
        const duration = Date.now() - start;

        if (duration > this.thresholdMs) {
          this.logger.warn({
            message: `Slow execution: ${controller}.${handler} (${duration}ms)`,
            controller,
            handler,
            duration,
            threshold: this.thresholdMs,
          });
        }
      }),
    );
  }
}
