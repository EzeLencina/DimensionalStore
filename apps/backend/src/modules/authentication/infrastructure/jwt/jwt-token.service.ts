import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JwtConfigService } from './jwt-config.service';
import { ITokenService } from '../../application/interfaces';
import { TokenType, TokenPayload, TokenPair } from '../../domain/types';
import { TokenId } from '../../domain/value-objects';

@Injectable()
export class JwtTokenService implements ITokenService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly jwtConfig: JwtConfigService,
  ) {}

  async generateAccessToken(
    payload: Omit<TokenPayload, 'type' | 'iat' | 'exp'>,
  ): Promise<string> {
    const tokenId = new TokenId();
    return this.jwtService.signAsync(
      {
        ...payload,
        type: 'access',
        jti: tokenId.getValue(),
      },
      {
        secret: this.jwtConfig.getSecret(),
        expiresIn: this.jwtConfig.getExpiresIn(),
        issuer: this.jwtConfig.getIssuer(),
        audience: this.jwtConfig.getAudience(),
      },
    );
  }

  async generateRefreshToken(
    payload: Omit<TokenPayload, 'type' | 'iat' | 'exp'>,
  ): Promise<string> {
    const tokenId = new TokenId();
    return this.jwtService.signAsync(
      {
        ...payload,
        type: 'refresh',
        jti: tokenId.getValue(),
      },
      {
        secret: this.jwtConfig.getRefreshSecret(),
        expiresIn: this.jwtConfig.getRefreshExpiresIn(),
        issuer: this.jwtConfig.getIssuer(),
        audience: this.jwtConfig.getAudience(),
      },
    );
  }

  async generateTokenPair(
    payload: Omit<TokenPayload, 'type' | 'iat' | 'exp'>,
  ): Promise<TokenPair> {
    const [accessToken, refreshToken] = await Promise.all([
      this.generateAccessToken(payload),
      this.generateRefreshToken(payload),
    ]);
    return { accessToken, refreshToken };
  }

  async verifyToken(token: string, type: TokenType): Promise<TokenPayload> {
    const secret =
      type === 'refresh'
        ? this.jwtConfig.getRefreshSecret()
        : this.jwtConfig.getSecret();

    const payload = await this.jwtService.verifyAsync<TokenPayload>(token, {
      secret,
      issuer: this.jwtConfig.getIssuer(),
      audience: this.jwtConfig.getAudience(),
      clockTolerance: this.jwtConfig.getClockSkew(),
    });

    if (payload.type !== type) {
      throw new Error(`Invalid token type: expected ${type}, got ${payload.type}`);
    }

    return payload;
  }

  decodeToken(token: string): TokenPayload | null {
    try {
      return this.jwtService.decode<TokenPayload>(token);
    } catch {
      return null;
    }
  }
}
