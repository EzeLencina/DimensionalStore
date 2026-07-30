import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import type { ServiceAccount } from '../../domain/types';
import { ScopeResolver } from '../../domain/services';
import { SCOPES_KEY } from '../decorators/require-scope.decorator';

@Injectable()
export class ScopeGuard implements CanActivate {
  private readonly scopeResolver = new ScopeResolver();

  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredScopes = this.reflector.getAllAndOverride<string[]>(SCOPES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredScopes || requiredScopes.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const account: ServiceAccount | undefined = request.serviceAccount;

    if (!account) {
      throw new ForbiddenException('Service account not found in request');
    }

    const result = this.scopeResolver.hasAllScopes(account.scopes, requiredScopes);
    if (!result.valid) {
      throw new ForbiddenException(`Missing required scopes: ${result.missing.join(', ')}`);
    }

    return true;
  }
}
