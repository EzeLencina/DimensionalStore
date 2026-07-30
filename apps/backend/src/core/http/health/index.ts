import { Injectable, Logger } from '@nestjs/common';
import type { HealthCheckResponse } from '../types';
import { HttpManagerService } from '../services/http-manager.service';

@Injectable()
export class HttpHealthService {
  private readonly logger = new Logger(HttpHealthService.name);

  constructor(private readonly manager: HttpManagerService) {}

  async check(): Promise<HealthCheckResponse> {
    const client = this.manager.getClient();

    this.logger.log({
      message: 'Performing HTTP health check',
      context: 'HttpHealthService',
      data: { driver: client.name },
    });

    const result = await client.healthCheck();

    this.logger.log({
      message: `HTTP health check result: ${result.status}`,
      context: 'HttpHealthService',
      data: { status: result.status, latency: result.latency },
    });

    return result;
  }

  isAvailable(): Promise<boolean> {
    return this.check().then(r => r.status === 'ok');
  }
}
