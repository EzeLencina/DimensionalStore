import { Injectable, CanActivate, ExecutionContext, ForbiddenException, Inject } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { LOGGER_TOKEN } from '@tienda/logger/nest';
import type { IAuthorizationService } from '../../application/interfaces';
import { POLICY_KEY } from '../decorators/require-policy.decorator';

@Injectable()
export class PolicyGuard implements CanActivate {
  constructor(
    @Inject('IAuthorizationService')
    private readonly authzService: IAuthorizationService,
    private readonly reflector: Reflector,
    @Inject(LOGGER_TOKEN) private readonly logger: any,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const required = this.reflector.getAllAndOverride<{ resource: string; action: string }[]>(POLICY_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!required || required.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user?.userId) {
      this.logger.warn({ event: 'authz.policy_guard.no_user' }, 'No authenticated user');
      throw new ForbiddenException('Authentication required');
    }

    for (const { resource, action } of required) {
      const result = await this.authzService.checkAccess(user.userId, resource, action, request.context);
      if (!result.granted) {
        this.logger.warn(
          { event: 'authz.policy_guard.denied', userId: user.userId, resource, action, reason: result.reason },
          'Policy denied',
        );
        throw new ForbiddenException(`Policy denies ${resource}:${action}`);
      }
    }

    return true;
  }
}
