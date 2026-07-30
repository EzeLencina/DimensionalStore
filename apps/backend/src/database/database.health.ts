import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Injectable()
export class DatabaseHealthIndicator {
  private readonly logger = new Logger(DatabaseHealthIndicator.name);

  constructor(private readonly prisma: PrismaService) {}

  async isHealthy(): Promise<{ status: string; latency: number }> {
    const start = Date.now();

    try {
      await this.prisma.$queryRaw`SELECT 1`;
      const latency = Date.now() - start;

      this.logger.debug(`Database health check passed (${latency}ms)`);

      return { status: 'healthy', latency };
    } catch (error) {
      this.logger.error('Database health check failed', error);
      throw error;
    }
  }

  async getConnectionStatus(): Promise<{
    connected: boolean;
    poolSize?: number;
    latency?: number;
  }> {
    try {
      const start = Date.now();
      await this.prisma.$queryRaw`SELECT 1`;
      const latency = Date.now() - start;

      return { connected: true, latency };
    } catch {
      return { connected: false };
    }
  }
}
