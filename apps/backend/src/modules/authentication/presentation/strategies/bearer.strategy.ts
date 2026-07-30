import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtConfigService } from '../../infrastructure/jwt/jwt-config.service';
import { TokenPayload } from '../../domain/types';

@Injectable()
export class BearerStrategy extends PassportStrategy(Strategy, 'bearer') {
  constructor(jwtConfig: JwtConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConfig.getSecret(),
      issuer: jwtConfig.getIssuer(),
      audience: jwtConfig.getAudience(),
    });
  }

  async validate(payload: TokenPayload): Promise<{ userId: string; email: string }> {
    if (!payload.sub || !payload.email) {
      throw new UnauthorizedException('Invalid bearer token');
    }
    return { userId: payload.sub, email: payload.email };
  }
}
