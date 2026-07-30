import { Injectable, Logger } from '@nestjs/common';
import type { StorageHealth } from '../types';
import { StorageManagerService } from '../services/storage-manager.service';

@Injectable()
export class StorageHealthService {
  private readonly logger = new Logger(StorageHealthService.name);

  constructor(
    private readonly manager: StorageManagerService,
  ) {}

  async check(): Promise<StorageHealth> {
    try {
      const driver = this.manager.getDriver();
      const health = await driver.health();

      if (health.status !== 'healthy') {
        this.logger.warn({
          message: `Storage health check failed: ${health.error ?? 'Unknown error'}`,
          context: 'StorageHealthService',
          data: { driver: driver.name, status: health.status },
        });
      }

      return health;
    } catch (error) {
      this.logger.error({
        message: `Storage health check error: ${(error as Error).message}`,
        context: 'StorageHealthService',
        data: { error: (error as Error).message },
      });

      return {
        status: 'unhealthy',
        latency: -1,
        error: (error as Error).message,
      };
    }
  }

  async checkDriver(name: string): Promise<StorageHealth | null> {
    try {
      const driver = this.manager.getDriver();
      if (driver.name !== name) return null;
      return driver.health();
    } catch {
      return null;
    }
  }
}
