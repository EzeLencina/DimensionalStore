import { Injectable, CanActivate, ExecutionContext, ForbiddenException, Inject } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { LOGGER_TOKEN } from '@tienda/logger/nest';
import type { IAuthorizationService } from '../../application/interfaces';
import { ROLE_KEY } from '../decorators/require-role.decorator';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(
    @Inject('IAuthorizationService')
    private readonly authzService: IAuthorizationService,
    private readonly reflector: Reflector,
    @Inject(LOGGER_TOKEN) private readonly logger: any,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLE_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user?.userId) {
      this.logger.warn({ event: 'authz.role_guard.no_user' }, 'No authenticated user');
      throw new ForbiddenException('Authentication required');
    }

    const assignments = await this.authzService.getUserRoles(user.userId);
    const userRoleNames = new Set(assignments.map(a => a.roleId));

    const hasRole = requiredRoles.some(role => userRoleNames.has(role));

    if (!hasRole) {
      this.logger.warn(
        { event: 'authz.role_guard.denied', userId: user.userId, requiredRoles },
        'Role denied',
      );
      throw new ForbiddenException('Insufficient role');
    }

    this.logger.info(
      { event: 'authz.role_guard.granted', userId: user.userId, role: requiredRoles },
      'Role granted',
    );
    return true;
  }
}
