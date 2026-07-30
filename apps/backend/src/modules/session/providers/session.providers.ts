import { Provider } from '@nestjs/common';
import { ISessionService } from '../application/interfaces';
import { SessionAppService } from '../services';

export const SessionServiceProvider: Provider<ISessionService> = {
  provide: 'ISessionService',
  useClass: SessionAppService,
};

export const SESSION_PROVIDERS: Provider[] = [
  SessionServiceProvider,
];
