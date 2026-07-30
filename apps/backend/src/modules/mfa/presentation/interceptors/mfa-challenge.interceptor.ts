import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable, map } from 'rxjs';

@Injectable()
export class MfaChallengeInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        if (data && typeof data === 'object' && data.challengeId) {
          return {
            ...data,
            challengeId: data.challengeId,
            _mfa: true,
          };
        }
        return data;
      }),
    );
  }
}
