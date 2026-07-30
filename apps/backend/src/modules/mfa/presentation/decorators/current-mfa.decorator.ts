import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentMfa = createParamDecorator(
  (data: string | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const mfa = {
      verified: request.mfaVerified,
      method: request.mfaMethod,
      challengeId: request.mfaChallengeId,
    };
    return data ? mfa?.[data as keyof typeof mfa] : mfa;
  },
);
