import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class TenantContextInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const request = context.switchToHttp().getRequest();

    if (request.tenantContext) {
      request.__tenant = {
        tenantId: request.tenantContext.tenant.id,
        tenantSlug: request.tenantContext.tenant.slug,
        branchId: request.tenantContext.branch?.id,
        locale: request.tenantContext.settings.locale,
        timezone: request.tenantContext.settings.timezone,
        currency: request.tenantContext.settings.currency,
      };
    }

    return next.handle();
  }
}
