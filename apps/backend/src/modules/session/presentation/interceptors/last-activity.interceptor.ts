import { Injectable, NestInterceptor, ExecutionContext, CallHandler, Inject } from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import { LOGGER_TOKEN } from '@tienda/logger/nest';
import type { ISessionService } from '../../application/interfaces';

@Injectable()
export class LastActivityInterceptor implements NestInterceptor {
  constructor(
    @Inject('ISessionService')
    private readonly sessionService: ISessionService,
    @Inject(LOGGER_TOKEN) private readonly logger: any,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    return next.handle().pipe(
      tap({
        next: async () => {
          const request = context.switchToHttp().getRequest();
          const sessionId = request.headers['x-session-id'] as string;

          if (sessionId) {
            try {
              await this.sessionService.touchSession(sessionId);
            } catch {
              this.logger.debug({ event: 'session.last_activity.error', sessionId }, 'Failed to update last activity');
            }
          }
        },
      }),
    );
  }
}
