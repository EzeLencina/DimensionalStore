import { Injectable, NestInterceptor, ExecutionContext, CallHandler, Inject } from '@nestjs/common';
import { Observable } from 'rxjs';
import { LOGGER_TOKEN } from '@tienda/logger/nest';

@Injectable()
export class SessionContextInterceptor implements NestInterceptor {
  constructor(
    @Inject(LOGGER_TOKEN) private readonly logger: any,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const request = context.switchToHttp().getRequest();
    const session = request.session;

    if (session) {
      request.__session = {
        sessionId: session.getSessionId().getValue(),
        userId: session.getUserId(),
        deviceId: session.getDeviceId().getValue(),
        createdAt: session.getCreatedAt(),
        lastActivity: session.getLastActivity(),
        expiresAt: session.getExpiresAt(),
      };
    }

    return next.handle();
  }
}
