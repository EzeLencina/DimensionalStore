import { Injectable, NestInterceptor, ExecutionContext, CallHandler, Inject } from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import { LOGGER_TOKEN } from '@tienda/logger/nest';

@Injectable()
export class AuditContextInterceptor implements NestInterceptor {
  constructor(
    @Inject(LOGGER_TOKEN) private readonly logger: any,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const request = context.switchToHttp().getRequest();
    const startTime = Date.now();

    return next.handle().pipe(
      tap({
        next: () => {
          const duration = Date.now() - startTime;
          const user = request.user;
          const authz = request.__authorization;

          if (user?.userId) {
            this.logger.info({
              event: 'authz.audit',
              userId: user.userId,
              method: request.method,
              path: request.url,
              duration,
              permissionsEvaluated: authz?.permissions?.length ?? 0,
            }, 'Authorization audit');
          }
        },
        error: (error) => {
          this.logger.warn({
            event: 'authz.audit.error',
            userId: request.user?.userId,
            method: request.method,
            path: request.url,
            error: error.message,
          }, 'Authorization audit error');
        },
      }),
    );
  }
}
