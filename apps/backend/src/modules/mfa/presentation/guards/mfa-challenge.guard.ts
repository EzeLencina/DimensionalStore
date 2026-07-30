import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { MfaDomainService } from '../../domain/services';

@Injectable()
export class MfaChallengeGuard implements CanActivate {
  constructor(private readonly mfaService: MfaDomainService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const challengeId = request.headers['x-mfa-challenge-id'] as string;
    const code = request.headers['x-mfa-code'] as string;

    if (!challengeId || !code) {
      throw new UnauthorizedException('MFA challenge ID and code required');
    }

    const result = await this.mfaService.verifyChallenge(challengeId, code);
    if (!result.verified) {
      throw new UnauthorizedException('MFA verification failed');
    }

    request.mfaVerified = true;
    request.mfaMethod = result.method;
    return true;
  }
}
