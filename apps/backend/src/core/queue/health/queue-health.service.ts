import { Injectable, Logger } from '@nestjs/common';
import type { QueueHealthStatus, QueueHealthSummary, ConnectionHealth } from '../types';
import { BullConnectionFactory } from '../bull/bull-connection.factory';
import { QueueManagerService } from '../services/queue-manager.service';
import { WorkerManagerService } from '../services/worker-manager.service';

@Injectable()
export class QueueHealthService {
  private readonly logger = new Logger(QueueHealthService.name);

  constructor(
    private readonly connectionFactory: BullConnectionFactory,
    private readonly queueManager: QueueManagerService,
    private readonly workerManager: WorkerManagerService,
  ) {}

  async checkRedis(): Promise<ConnectionHealth> {
    return this.connectionFactory.health();
  }

  async checkQueue(name: string): Promise<QueueHealthStatus> {
    const adapter = this.queueManager.getQueue(name);

    if (!adapter) {
      return {
        queue: name,
        status: 'unhealthy',
        waiting: 0,
        active: 0,
        completed: 0,
        failed: 0,
        delayed: 0,
        paused: false,
        workerActive: false,
      };
    }

    try {
      const [counts, isPaused, worker] = await Promise.all([
        adapter.getJobCounts(),
        adapter.isPaused(),
        this.workerManager.getWorker(name),
      ]);

      const workerActive = worker?.running ?? false;
      const failed = counts.failed;
      const status = failed > 100 ? 'degraded' : 'healthy';

      return {
        queue: name,
        status: isPaused ? 'degraded' : status,
        waiting: counts.waiting,
        active: counts.active,
        completed: counts.completed,
        failed,
        delayed: counts.delayed,
        paused: isPaused,
        workerActive,
      };
    } catch (error) {
      this.logger.error({
        message: `Health check failed for queue ${name}: ${(error as Error).message}`,
        context: 'QueueHealthService',
        data: { queue: name, error: (error as Error).message },
      });

      return {
        queue: name,
        status: 'unhealthy',
        waiting: 0,
        active: 0,
        completed: 0,
        failed: 0,
        delayed: 0,
        paused: false,
        workerActive: false,
        error: (error as Error).message,
      };
    }
  }

  async checkAll(): Promise<QueueHealthSummary> {
    const redis = await this.checkRedis();
    const queueNames = this.queueManager.getQueueNames();
    const checks = await Promise.all(
      queueNames.map((name) => this.checkQueue(name)),
    );

    const unhealthyCount = checks.filter((q) => q.status === 'unhealthy').length;
    const degradedCount = checks.filter((q) => q.status === 'degraded').length;

    let overall: QueueHealthSummary['overall'] = 'healthy';
    if (unhealthyCount > 0 || !redis.connected) {
      overall = 'unhealthy';
    } else if (degradedCount > 0) {
      overall = 'degraded';
    }

    return {
      overall,
      redis: { connected: redis.connected, latency: redis.latency },
      queues: checks,
      timestamp: new Date(),
    };
  }
}
