import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ApiKeyDomainService } from '../../domain/services';
import { ApiKeyValidators } from '../../application/validators';
import { API_KEYS_REQUIRED_KEY } from '../decorators/require-api-key.decorator';

@Injectable()
export class ApiKeyGuard implements CanActivate {
  constructor(
    private readonly apiKeyService: ApiKeyDomainService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const required = this.reflector.getAllAndOverride<boolean>(API_KEYS_REQUIRED_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!required) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers['authorization'] as string | undefined;

    if (!authHeader) {
      throw new UnauthorizedException('API key required');
    }

    const plainKey = ApiKeyValidators.extractKeyFromHeader(authHeader);
    if (!plainKey) {
      throw new UnauthorizedException('Invalid API key format');
    }

    const result = await this.apiKeyService.validateKey(plainKey);
    if (!result.valid) {
      throw new UnauthorizedException(result.reason ?? 'Invalid API key');
    }

    request.apiKey = result.apiKey;
    request.serviceAccount = result.serviceAccount;
    request.machineAuth = true;

    return true;
  }
}
