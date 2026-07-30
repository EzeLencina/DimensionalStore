import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable, map } from 'rxjs';
import { createSuccessResponse } from '@common/responses/success-response';

@Injectable()
export class TransformInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const request = context.switchToHttp().getRequest();
    const path = request.url ?? '/';
    const method = request.method ?? 'UNKNOWN';
    const requestId = request.requestId ?? request.id;
    const correlationId = request.correlationId;

    return next.handle().pipe(
      map((data) =>
        createSuccessResponse(data, path, method, requestId, correlationId),
      ),
    );
  }
}
