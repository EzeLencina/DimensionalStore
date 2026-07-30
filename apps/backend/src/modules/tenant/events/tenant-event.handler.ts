import { Injectable, Inject } from '@nestjs/common';
import { LOGGER_TOKEN } from '@tienda/logger/nest';

@Injectable()
export class TenantEventHandler {
  constructor(
    @Inject(LOGGER_TOKEN) private readonly logger: any,
  ) {}

  handleTenantCreated(event: { tenantId: string; slug: string; name: string }): void {
    this.logger.info({ event: 'tenant.event.created', ...event }, 'Tenant created event');
  }

  handleTenantUpdated(event: { tenantId: string; changes: string[] }): void {
    this.logger.info({ event: 'tenant.event.updated', ...event }, 'Tenant updated event');
  }

  handleTenantActivated(event: { tenantId: string }): void {
    this.logger.info({ event: 'tenant.event.activated', ...event }, 'Tenant activated event');
  }

  handleTenantSuspended(event: { tenantId: string; reason?: string }): void {
    this.logger.warn({ event: 'tenant.event.suspended', ...event }, 'Tenant suspended event');
  }

  handleBranchCreated(event: { branchId: string; tenantId: string; name: string }): void {
    this.logger.info({ event: 'tenant.event.branch_created', ...event }, 'Branch created event');
  }

  handleBranchUpdated(event: { branchId: string; tenantId: string; changes: string[] }): void {
    this.logger.info({ event: 'tenant.event.branch_updated', ...event }, 'Branch updated event');
  }

  handleContextResolved(event: { tenantId: string; userId: string }): void {
    this.logger.info({ event: 'tenant.event.context_resolved', ...event }, 'Context resolved event');
  }
}
