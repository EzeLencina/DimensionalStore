import { Injectable, CanActivate, ExecutionContext, ForbiddenException, Inject } from '@nestjs/common';
import { LOGGER_TOKEN } from '@tienda/logger/nest';

@Injectable()
export class OrganizationGuard implements CanActivate {
  constructor(
    @Inject(LOGGER_TOKEN) private readonly logger: any,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();

    if (!request.tenantContext) {
      throw new ForbiddenException('Tenant context required');
    }

    const targetOrgId = request.params['organizationId'] || request.body?.organizationId;

    if (targetOrgId && request.tenantContext.tenant.id !== targetOrgId) {
      this.logger.warn({
        event: 'tenant.organization_guard.mismatch',
        targetOrgId,
        userOrgId: request.tenantContext.tenant.id,
      }, 'Organization mismatch');
      throw new ForbiddenException('Organization access denied');
    }

    return true;
  }
}
