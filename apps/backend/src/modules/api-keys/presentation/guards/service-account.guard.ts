import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import type { ServiceAccount } from '../../domain/types';

@Injectable()
export class ServiceAccountGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const required = this.reflector.getAllAndOverride<boolean>('service_account_required', [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!required) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const serviceAccount: ServiceAccount | undefined = request.serviceAccount;

    if (!serviceAccount) {
      throw new ForbiddenException('Service account required');
    }

    if (serviceAccount.status !== 'active') {
      throw new ForbiddenException(`Service account is ${serviceAccount.status}`);
    }

    return true;
  }
}
