import { Injectable, NestInterceptor, ExecutionContext, CallHandler, Inject } from '@nestjs/common';
import { Observable, from, switchMap } from 'rxjs';
import { LOGGER_TOKEN } from '@tienda/logger/nest';
import type { IAuthorizationService } from '../../application/interfaces';

@Injectable()
export class PermissionResolutionInterceptor implements NestInterceptor {
  constructor(
    @Inject('IAuthorizationService')
    private readonly authzService: IAuthorizationService,
    @Inject(LOGGER_TOKEN) private readonly logger: any,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user?.userId) {
      return next.handle();
    }

    return from(this.authzService.getUserPermissions(user.userId)).pipe(
      switchMap((permissions) => {
        request.__authorization = {
          ...request.__authorization,
          permissions,
          userId: user.userId,
        };
        return next.handle();
      }),
    );
  }
}
