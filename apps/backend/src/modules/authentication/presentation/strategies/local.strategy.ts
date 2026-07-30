import { Injectable, UnauthorizedException, Inject } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { LOGGER_TOKEN } from '@tienda/logger/nest';
import type { IAuthenticationService } from '../../application/interfaces';
import { AuthenticationException } from '../../domain/exceptions';

@Injectable()
export class LocalAuthStrategy extends PassportStrategy(Strategy, 'local') {
  constructor(
    @Inject('IAuthenticationService')
    private readonly authService: IAuthenticationService,
    @Inject(LOGGER_TOKEN) private readonly logger: any,
  ) {
    super({
      usernameField: 'email',
      passwordField: 'password',
    });
  }

  async validate(email: string, password: string): Promise<{ userId: string; email: string }> {
    try {
      const result = await this.authService.validateCredentials(email, password);
      return result;
    } catch (error) {
      if (error instanceof AuthenticationException) {
        this.logger.warn(
          { event: 'auth.local_strategy.failed', reason: error.code },
          'Local authentication failed',
        );
      }
      throw new UnauthorizedException('Invalid credentials');
    }
  }
}
