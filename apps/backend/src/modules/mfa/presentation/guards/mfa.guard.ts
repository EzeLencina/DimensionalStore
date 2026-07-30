import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { MfaDomainService } from '../../domain/services';
import { MFA_CHECK_KEY } from '../decorators/mfa-required.decorator';

@Injectable()
export class MfaGuard implements CanActivate {
  constructor(
    private readonly mfaService: MfaDomainService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const required = this.reflector.getAllAndOverride<boolean>(MFA_CHECK_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!required) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user?.userId) {
      throw new ForbiddenException('User not authenticated');
    }

    const state = await this.mfaService.getState(user.userId);
    if (state.status !== 'enabled') {
      throw new ForbiddenException('MFA is not enabled');
    }

    return true;
  }
}
