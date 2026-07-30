import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtConfigService {
  constructor(private readonly configService: ConfigService) {}

  getSecret(): string {
    return this.configService.get<string>('jwt.secret', 'dev-secret');
  }

  getExpiresIn(): string {
    return this.configService.get<string>('jwt.expiresIn', '15m');
  }

  getRefreshSecret(): string {
    return this.configService.get<string>('jwt.refreshSecret', 'dev-refresh-secret');
  }

  getRefreshExpiresIn(): string {
    return this.configService.get<string>('jwt.refreshExpiresIn', '7d');
  }

  getIssuer(): string {
    return this.configService.get<string>('jwt.issuer', 'tienda');
  }

  getAudience(): string {
    return this.configService.get<string>('jwt.audience', 'tienda-api');
  }

  getClockSkew(): number {
    return this.configService.get<number>('jwt.clockSkew', 30);
  }
}
