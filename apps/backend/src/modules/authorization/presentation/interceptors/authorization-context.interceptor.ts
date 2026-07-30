import { Injectable, NestInterceptor, ExecutionContext, CallHandler, Inject } from '@nestjs/common';
import { Observable } from 'rxjs';
import { LOGGER_TOKEN } from '@tienda/logger/nest';

@Injectable()
export class AuthorizationContextInterceptor implements NestInterceptor {
  constructor(
    @Inject(LOGGER_TOKEN) private readonly logger: any,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const request = context.switchToHttp().getRequest();

    request.__authorization = {
      ...request.__authorization,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
    };

    return next.handle();
  }
}
