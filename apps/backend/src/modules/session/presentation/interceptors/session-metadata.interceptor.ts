import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class SessionMetadataInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const request = context.switchToHttp().getRequest();

    if (!request.__session) {
      request.__session = {};
    }

    request.__session = {
      ...request.__session,
      ipAddress: request.ip || request.connection?.remoteAddress,
      userAgent: request.headers['user-agent'],
      timezone: request.headers['x-timezone'],
      locale: request.headers['x-locale'],
      timestamp: new Date().toISOString(),
    };

    return next.handle();
  }
}
