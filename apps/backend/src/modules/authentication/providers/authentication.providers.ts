import { Provider } from '@nestjs/common';
import { IHashingService, ITokenService, ISessionRepository, IAuthenticationService } from '../application/interfaces';
import { Argon2HashingService } from '../infrastructure/hashing';
import { JwtTokenService } from '../infrastructure/jwt';
import { InMemorySessionRepository } from '../infrastructure/repositories';
import { AuthenticationService } from '../services';

export const HashingServiceProvider: Provider<IHashingService> = {
  provide: 'IHashingService',
  useClass: Argon2HashingService,
};

export const TokenServiceProvider: Provider<ITokenService> = {
  provide: 'ITokenService',
  useClass: JwtTokenService,
};

export const SessionRepositoryProvider: Provider<ISessionRepository> = {
  provide: 'ISessionRepository',
  useClass: InMemorySessionRepository,
};

export const AuthenticationServiceProvider: Provider<IAuthenticationService> = {
  provide: 'IAuthenticationService',
  useExisting: AuthenticationService,
};

export const AUTHENTICATION_PROVIDERS: Provider[] = [
  HashingServiceProvider,
  TokenServiceProvider,
  SessionRepositoryProvider,
  AuthenticationServiceProvider,
];
