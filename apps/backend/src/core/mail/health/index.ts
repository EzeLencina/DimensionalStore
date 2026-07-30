import { Injectable, Logger } from '@nestjs/common';
import type { ConnectionHealth } from '../types';
import { MailManagerService } from '../services/mail-manager.service';

@Injectable()
export class MailHealthService {
  private readonly logger = new Logger(MailHealthService.name);

  constructor(
    private readonly manager: MailManagerService,
  ) {}

  async check(): Promise<ConnectionHealth> {
    try {
      const provider = this.manager.getProvider();
      const health = await provider.validateConnection();

      if (health.status !== 'healthy') {
        this.logger.warn({
          message: `Mail health check failed: ${health.error ?? 'Unknown error'}`,
          context: 'MailHealthService',
          data: {
            provider: provider.name,
            status: health.status,
          },
        });
      }

      return health;
    } catch (error) {
      this.logger.error({
        message: `Mail health check error: ${(error as Error).message}`,
        context: 'MailHealthService',
        data: { error: (error as Error).message },
      });

      return {
        status: 'unhealthy',
        latency: -1,
        provider: 'unknown',
        error: (error as Error).message,
      };
    }
  }

  async checkProvider(name: string): Promise<ConnectionHealth | null> {
    try {
      const provider = this.manager.getProvider();
      if (provider.name !== name) return null;
      return provider.validateConnection();
    } catch {
      return null;
    }
  }
}
