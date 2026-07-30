import { Injectable, CanActivate, ExecutionContext, ForbiddenException, Inject } from '@nestjs/common';
import { LOGGER_TOKEN } from '@tienda/logger/nest';

@Injectable()
export class BranchGuard implements CanActivate {
  constructor(
    @Inject(LOGGER_TOKEN) private readonly logger: any,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();

    if (!request.tenantContext) {
      throw new ForbiddenException('Tenant context required');
    }

    const requiredBranchId = request.params['branchId'] || request.headers['x-branch-id'];

    if (requiredBranchId && request.tenantContext.branch?.id !== requiredBranchId) {
      this.logger.warn({
        event: 'tenant.branch_guard.mismatch',
        expected: requiredBranchId,
        actual: request.tenantContext.branch?.id,
      }, 'Branch mismatch');
      throw new ForbiddenException('Branch access denied');
    }

    if (!request.tenantContext.branch) {
      this.logger.warn({ event: 'tenant.branch_guard.no_branch' }, 'No branch in context');
      throw new ForbiddenException('No branch assigned');
    }

    return true;
  }
}
