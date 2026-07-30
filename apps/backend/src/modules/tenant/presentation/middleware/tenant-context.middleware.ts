import { Injectable, NestMiddleware, Inject } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { LOGGER_TOKEN } from '@tienda/logger/nest';
import type { ITenantService } from '../../application/interfaces';

@Injectable()
export class TenantContextMiddleware implements NestMiddleware {
  constructor(
    @Inject('ITenantService')
    private readonly tenantService: ITenantService,
    @Inject(LOGGER_TOKEN) private readonly logger: any,
  ) {}

  async use(req: Request, _res: Response, next: NextFunction): Promise<void> {
    const user = req.user as Record<string, unknown> | undefined;

    if (!user?.['userId']) {
      next();
      return;
    }

    const tenantId = this.resolveTenantId(req);
    const branchId = req.headers['x-branch-id'] as string;

    if (!tenantId) {
      next();
      return;
    }

    try {
      const context = await this.tenantService.resolveContext(
        user['userId'] as string,
        user['email'] as string,
        (user['username'] as string) ?? (user['email'] as string),
        (user['type'] as string) ?? 'customer',
        tenantId,
        branchId,
      );

      req.tenantContext = context;
      req.tenantId = tenantId;

      this.logger.info({
        event: 'tenant.context.resolved',
        tenantId: context.tenant.id,
        tenantSlug: context.tenant.slug,
        branchId: context.branch?.id,
        userId: context.user.id,
      }, 'Tenant context resolved');

      next();
    } catch (error) {
      this.logger.warn({
        event: 'tenant.context.failed',
        tenantId,
        userId: (user as Record<string, unknown>)?.['userId'],
        error: (error as Error).message,
      }, 'Tenant context resolution failed');
      next();
    }
  }

  private resolveTenantId(req: Request): string | undefined {
    const headerTenant = req.headers['x-tenant-id'] as string;
    if (headerTenant) return headerTenant;

    const user = req.user as Record<string, unknown> | undefined;
    if (user?.['tenantId']) return user['tenantId'] as string;

    return undefined;
  }
}
