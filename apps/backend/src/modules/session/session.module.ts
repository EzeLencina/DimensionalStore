import { Module } from '@nestjs/common';
import { SESSION_PROVIDERS } from './providers';
import { SessionAppService } from './services';
import { SessionEventHandler } from './events';
import { SessionExceptionFilter } from './exceptions';
import { ActiveSessionGuard, ValidSessionGuard, SessionOwnershipGuard } from './presentation/guards';
import { SessionContextInterceptor, LastActivityInterceptor, SessionMetadataInterceptor } from './presentation/interceptors';

@Module({
  providers: [
    ...SESSION_PROVIDERS,
    SessionAppService,
    SessionEventHandler,
    SessionExceptionFilter,
    ActiveSessionGuard,
    ValidSessionGuard,
    SessionOwnershipGuard,
    SessionContextInterceptor,
    LastActivityInterceptor,
    SessionMetadataInterceptor,
  ],
  exports: [
    SessionAppService,
    'ISessionService',
    ActiveSessionGuard,
    ValidSessionGuard,
    SessionOwnershipGuard,
  ],
})
export class SessionModule {}
