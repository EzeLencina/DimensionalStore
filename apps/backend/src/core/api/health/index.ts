import { Injectable, Logger } from '@nestjs/common';
import { ApiConfigurationFactory } from '../config';

@Injectable()
export class ApiHealthService {
  private readonly logger = new Logger(ApiHealthService.name);

  constructor(private readonly configFactory: ApiConfigurationFactory) {}

  check(): { status: string; version: string; timestamp: string } {
    const version = this.configFactory.getVersioningConfig().defaultVersion;

    const result = {
      status: 'ok',
      version,
      timestamp: new Date().toISOString(),
    };

    this.logger.debug({
      message: 'API health check',
      context: 'ApiHealthService',
      data: result,
    });

    return result;
  }

  isAvailable(): boolean {
    return true;
  }
}
