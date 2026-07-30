import { Module } from '@nestjs/common';
import { MFA_PROVIDERS } from './providers';
import { MfaAppService } from './services';
import { MfaEventHandler } from './events';
import { MfaExceptionFilter } from './exceptions';
import { MfaGuard, MfaChallengeGuard } from './presentation/guards';
import { MfaChallengeInterceptor } from './presentation/interceptors';

@Module({
  providers: [
    ...MFA_PROVIDERS,
    MfaAppService,
    MfaEventHandler,
    MfaExceptionFilter,
    MfaGuard,
    MfaChallengeGuard,
    MfaChallengeInterceptor,
  ],
  exports: [
    MfaAppService,
    'IMfaService',
    MfaGuard,
    MfaChallengeGuard,
    MfaChallengeInterceptor,
  ],
})
export class MfaModule {}
