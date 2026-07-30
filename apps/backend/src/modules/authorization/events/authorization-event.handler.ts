import { Injectable, Inject } from '@nestjs/common';
import { LOGGER_TOKEN } from '@tienda/logger/nest';

@Injectable()
export class AuthorizationEventHandler {
  constructor(
    @Inject(LOGGER_TOKEN) private readonly logger: any,
  ) {}

  handleRoleAssigned(event: { userId: string; roleId: string; assignedBy: string }): void {
    this.logger.info({ event: 'authz.event.role_assigned', ...event }, 'Role assigned event');
  }

  handleRoleRemoved(event: { userId: string; roleId: string }): void {
    this.logger.info({ event: 'authz.event.role_removed', ...event }, 'Role removed event');
  }

  handlePermissionGranted(event: { roleId: string; resource: string; action: string }): void {
    this.logger.info({ event: 'authz.event.permission_granted', ...event }, 'Permission granted event');
  }

  handlePermissionRevoked(event: { roleId: string; resource: string; action: string }): void {
    this.logger.info({ event: 'authz.event.permission_revoked', ...event }, 'Permission revoked event');
  }

  handlePolicyEvaluated(event: { userId: string; resource: string; action: string; granted: boolean }): void {
    this.logger.info({ event: 'authz.event.policy_evaluated', ...event }, 'Policy evaluated event');
  }

  handleAuthorizationGranted(event: { userId: string; resource: string; action: string }): void {
    this.logger.info({ event: 'authz.event.authorization_granted', ...event }, 'Authorization granted event');
  }

  handleAuthorizationDenied(event: { userId: string; resource: string; action: string; reason: string }): void {
    this.logger.warn({ event: 'authz.event.authorization_denied', ...event }, 'Authorization denied event');
  }
}
