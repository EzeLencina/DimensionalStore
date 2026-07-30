import { Injectable, Inject } from '@nestjs/common';
import { LOGGER_TOKEN } from '@tienda/logger/nest';
import type { IAuthorizationService, IRoleRepository, IPolicyRepository, IPermissionRegistry } from '../application/interfaces';
import { AuthorizationDomainService } from '../domain/services';
import { Role, Permission, Policy } from '../domain/entities';
import { Scope, AuthorizationResult, RoleAssignment } from '../domain/types';

@Injectable()
export class AuthorizationAppService implements IAuthorizationService {
  private readonly domainService: AuthorizationDomainService;

  constructor(
    @Inject('IRoleRepository')
    private readonly roleRepository: IRoleRepository,
    @Inject('IPolicyRepository')
    private readonly policyRepository: IPolicyRepository,
    private readonly permissionRegistry: IPermissionRegistry,
    @Inject(LOGGER_TOKEN) private readonly logger: any,
  ) {
    this.domainService = new AuthorizationDomainService();
  }

  async checkAccess(
    userId: string,
    resource: string,
    action: string,
    context?: Record<string, unknown>,
    scope?: Scope,
  ): Promise<AuthorizationResult> {
    const result = this.domainService.checkAccess(userId, resource, action, context, scope);

    this.logger.info({
      event: result.granted ? 'authz.check_access.granted' : 'authz.check_access.denied',
      userId,
      resource,
      action,
      reason: result.reason,
    }, `Access ${result.granted ? 'granted' : 'denied'}`);

    return result;
  }

  async checkAccessBatch(
    userId: string,
    requests: Array<{ resource: string; action: string; scope?: Scope }>,
    context?: Record<string, unknown>,
  ): Promise<AuthorizationResult[]> {
    const results = this.domainService.checkAccessBatch(userId, requests, context);
    return results;
  }

  async getUserPermissions(userId: string, scope?: Scope): Promise<Permission[]> {
    return this.domainService.getUserPermissions(userId, scope);
  }

  async getUserRoles(userId: string): Promise<RoleAssignment[]> {
    return this.domainService.getUserRoles(userId);
  }

  async assignRole(userId: string, roleId: string, scope: Scope, assignedBy: string): Promise<void> {
    this.domainService.assignRole(userId, roleId, scope, assignedBy);
    this.logger.info({ event: 'authz.role.assigned', userId, roleId, assignedBy }, 'Role assigned');
  }

  async removeRole(userId: string, roleId: string): Promise<void> {
    this.domainService.removeRole(userId, roleId);
    this.logger.info({ event: 'authz.role.removed', userId, roleId }, 'Role removed');
  }

  async createRole(role: Role): Promise<void> {
    this.domainService.createRole(role);
    await this.roleRepository.save(role);
    this.logger.info({ event: 'authz.role.created', roleId: role.getId().getValue(), roleName: role.getName() }, 'Role created');
  }

  async createPolicy(policy: Policy): Promise<void> {
    this.domainService.createPolicy(policy);
    await this.policyRepository.save(policy);
    this.logger.info({ event: 'authz.policy.created', policyId: policy.getId().getValue(), policyName: policy.getName() }, 'Policy created');
  }
}
