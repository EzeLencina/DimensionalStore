import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ApiKeyDomainService } from '../../domain/services';
import { ApiKeyValidators } from '../../application/validators';
import { ScopeResolver } from '../../domain/services';

@Injectable()
export class MachineAuthGuard implements CanActivate {
  private readonly scopeResolver = new ScopeResolver();

  constructor(
    private readonly apiKeyService: ApiKeyDomainService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers['authorization'] as string | undefined;

    if (!authHeader) {
      throw new UnauthorizedException('Authentication required');
    }

    const plainKey = ApiKeyValidators.extractKeyFromHeader(authHeader);
    if (!plainKey) {
      throw new UnauthorizedException('Invalid API key format');
    }

    const result = await this.apiKeyService.validateKey(plainKey);
    if (!result.valid) {
      throw new UnauthorizedException(result.reason ?? 'Machine authentication failed');
    }

    const requiredScopes = this.reflector.getAllAndOverride<string[]>('machine_scopes', [
      context.getHandler(),
      context.getClass(),
    ]);

    if (requiredScopes && requiredScopes.length > 0 && result.serviceAccount) {
      const scopeResult = this.scopeResolver.hasAllScopes(result.serviceAccount.scopes, requiredScopes);
      if (!scopeResult.valid) {
        throw new UnauthorizedException(`Missing scopes: ${scopeResult.missing.join(', ')}`);
      }
    }

    request.apiKey = result.apiKey;
    request.serviceAccount = result.serviceAccount;
    request.machineAuth = true;
    request.machineScopes = result.serviceAccount?.scopes ?? [];

    return true;
  }
}
