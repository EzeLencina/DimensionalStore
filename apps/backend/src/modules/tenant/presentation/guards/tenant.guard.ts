import { Injectable, CanActivate, ExecutionContext, ForbiddenException, Inject } from '@nestjs/common';
import { LOGGER_TOKEN } from '@tienda/logger/nest';

@Injectable()
export class TenantGuard implements CanActivate {
  constructor(
    @Inject(LOGGER_TOKEN) private readonly logger: any,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();

    if (!request.tenantContext) {
      this.logger.warn({ event: 'tenant.guard.no_context' }, 'Tenant context is required');
      throw new ForbiddenException('Tenant context required');
    }

    if (request.tenantContext.tenant.status === 'suspended') {
      this.logger.warn({
        event: 'tenant.guard.suspended',
        tenantId: request.tenantContext.tenant.id,
      }, 'Tenant is suspended');
      throw new ForbiddenException('Tenant is suspended');
    }

    return true;
  }
}
