import { Injectable, NestInterceptor, ExecutionContext, CallHandler, Logger } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { API_DEFAULTS } from '../constants/api-defaults';

@Injectable()
export class ExecutionTimeInterceptor implements NestInterceptor {
  private readonly logger = new Logger(ExecutionTimeInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const startTime = Date.now();
    const request = context.switchToHttp().getRequest();
    const method = request.method;
    const url = request.url;
    const version = request.headers['x-api-version'] ?? 'unknown';

    return next.handle().pipe(
      tap(() => {
        const executionTime = Date.now() - startTime;
        const warnThreshold = API_DEFAULTS.EXECUTION_TIME_WARN_THRESHOLD;

        const logData = {
          method,
          url,
          version,
          executionTimeMs: executionTime,
        };

        if (executionTime > warnThreshold) {
          this.logger.warn({
            message: `Slow request: ${method} ${url} (${executionTime}ms)`,
            context: 'ExecutionTimeInterceptor',
            data: logData,
          });
        } else {
          this.logger.debug({
            message: `${method} ${url} completed in ${executionTime}ms`,
            context: 'ExecutionTimeInterceptor',
            data: logData,
          });
        }
      }),
    );
  }
}
