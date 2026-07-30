import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Reflector } from '@nestjs/core';
import { API_VERSION_METADATA } from '../decorators/api-version.decorator';
import { ApiConfigurationFactory } from '../config';

@Injectable()
export class ApiVersionInterceptor implements NestInterceptor {
  constructor(
    private readonly reflector: Reflector,
    private readonly configFactory: ApiConfigurationFactory,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const version = this.reflector.get<string>(
      API_VERSION_METADATA,
      context.getHandler(),
    ) ?? this.configFactory.getVersioningConfig().defaultVersion;

    const response = context.switchToHttp().getResponse();
    response.header('x-api-version', version);

    return next.handle().pipe(
      map(data => {
        if (typeof data === 'object' && data !== null) {
          const record = data as Record<string, unknown>;
          return {
            ...record,
            meta: {
              ...(record['meta'] as Record<string, unknown> ?? {}),
              version,
            },
          };
        }
        return data;
      }),
    );
  }
}
