import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AUTHENTICATION_PROVIDERS } from './providers';
import { AuthenticationService, AuthenticationFactory } from './services';
import { TokenRotationService, TokenBlacklistService } from './infrastructure/tokens';
import { JwtConfigService } from './infrastructure/jwt';
import { AuthenticationEventHandler } from './events';
import { AuthenticationExceptionFilter } from './exceptions';
import { AuthenticationGuard, OptionalAuthenticationGuard } from './presentation/guards';
import { JwtAuthStrategy, LocalAuthStrategy, BearerStrategy } from './presentation/strategies';
import { PasswordDomainService } from './domain/services';

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('jwt.secret', 'dev-secret'),
        signOptions: {
          expiresIn: configService.get<string>('jwt.expiresIn', '15m'),
          issuer: configService.get<string>('jwt.issuer', 'tienda'),
          audience: configService.get<string>('jwt.audience', 'tienda-api'),
        },
      }),
    }),
  ],
  providers: [
    ...AUTHENTICATION_PROVIDERS,
    AuthenticationService,
    AuthenticationFactory,
    TokenRotationService,
    TokenBlacklistService,
    JwtConfigService,
    AuthenticationEventHandler,
    PasswordDomainService,
    JwtAuthStrategy,
    LocalAuthStrategy,
    BearerStrategy,
    AuthenticationGuard,
    OptionalAuthenticationGuard,
    AuthenticationExceptionFilter,
  ],
  exports: [
    AuthenticationService,
    AuthenticationFactory,
    AuthenticationGuard,
    OptionalAuthenticationGuard,
    PasswordDomainService,
    TokenRotationService,
    TokenBlacklistService,
    'IAuthenticationService',
    'IHashingService',
    'ITokenService',
    'ISessionRepository',
  ],
})
export class AuthenticationModule {}
