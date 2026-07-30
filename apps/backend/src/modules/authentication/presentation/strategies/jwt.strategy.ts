import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtConfigService } from '../../infrastructure/jwt/jwt-config.service';
import { TokenPayload } from '../../domain/types';
import { LOGGER_TOKEN } from '@tienda/logger/nest';
import { Inject } from '@nestjs/common';

@Injectable()
export class JwtAuthStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    jwtConfig: JwtConfigService,
    @Inject(LOGGER_TOKEN) private readonly logger: any,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConfig.getSecret(),
      issuer: jwtConfig.getIssuer(),
      audience: jwtConfig.getAudience(),
      passReqToCallback: true,
    });
  }

  async validate(request: any, payload: TokenPayload): Promise<{ userId: string; email: string; sessionId?: string }> {
    if (!payload.sub || !payload.email) {
      this.logger.warn({ event: 'jwt.invalid_payload' }, 'JWT payload missing required fields');
      throw new UnauthorizedException('Invalid token payload');
    }

    return {
      userId: payload.sub,
      email: payload.email,
      sessionId: payload.sessionId,
    };
  }
}
