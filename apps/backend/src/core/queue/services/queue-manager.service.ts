import { Injectable, OnApplicationShutdown, Logger } from '@nestjs/common';
import { Queue as BullQueue } from 'bullmq';
import type { IQueueManager, IQueueAdapter, IBullConnectionFactory } from '../interfaces';
import { BullQueueAdapter, BullConnectionFactory } from '../bull';
import { QueueConfigurationFactory } from '../config';
import type { QueueDefinition, QueueOptions } from '../types';
import { QueueUnavailableException, ConfigurationErrorException } from '../exceptions';

@Injectable()
export class QueueManagerService implements IQueueManager, OnApplicationShutdown {
  private readonly queues: Map<string, IQueueAdapter> = new Map();
  private readonly logger = new Logger(QueueManagerService.name);
  private initialized = false;

  constructor(
    private readonly configFactory: QueueConfigurationFactory,
    private readonly connectionFactory: BullConnectionFactory,
  ) {}

  async onApplicationShutdown(): Promise<void> {
    await this.clear();
  }

  async initialize(): Promise<void> {
    if (this.initialized) return;
    this.configFactory.validate();
    await this.connectionFactory.create();
    this.initialized = true;
    this.logger.log({ message: 'QueueManager initialized', context: 'QueueManagerService' });
  }

  createQueue(definition: QueueDefinition, options?: QueueOptions): IQueueAdapter {
    const name = definition.name;

    if (this.queues.has(name)) {
      return this.queues.get(name) as IQueueAdapter;
    }

    if (!this.initialized) {
      throw new ConfigurationErrorException(
        'QueueManager not initialized. Call initialize() first.',
      );
    }

    const queueOptions = this.configFactory.getQueueOptions(options);
    const prefix = definition.prefix ?? this.configFactory.getConfiguration().prefix;
    const connection = this.connectionFactory.getClient();

    if (!connection) {
      throw new QueueUnavailableException('Redis connection not available for queue creation');
    }

    const bullQueue = new BullQueue(name, {
      connection,
      prefix,
      defaultJobOptions: {
        attempts: queueOptions.defaultJobOptions?.attempts,
        backoff: queueOptions.defaultJobOptions?.backoff as { type: 'fixed' | 'exponential'; delay: number } | undefined,
        removeOnComplete: queueOptions.defaultJobOptions?.removeOnComplete as boolean | number | { count: number } | { age: number; count?: number } | undefined,
        removeOnFail: queueOptions.defaultJobOptions?.removeOnFail as boolean | number | { count: number } | { age: number; count?: number } | undefined,
        stackTraceLimit: queueOptions.defaultJobOptions?.stackTraceLimit,
      },
    });

    const adapter = new BullQueueAdapter(name, bullQueue, this.logger);
    this.queues.set(name, adapter);

    this.logger.log({
      message: `Queue created: ${name}`,
      context: 'QueueManagerService',
      data: { queue: name, prefix },
    });

    return adapter;
  }

  getQueue(name: string): IQueueAdapter | null {
    return this.queues.get(name) ?? null;
  }

  getQueues(): Map<string, IQueueAdapter> {
    return new Map(this.queues);
  }

  hasQueue(name: string): boolean {
    return this.queues.has(name);
  }

  async removeQueue(name: string): Promise<void> {
    const adapter = this.queues.get(name);
    if (!adapter) return;

    await adapter.close();
    this.queues.delete(name);

    this.logger.log({
      message: `Queue removed: ${name}`,
      context: 'QueueManagerService',
    });
  }

  async clear(): Promise<void[]> {
    const promises: Promise<void>[] = [];
    for (const [name] of this.queues) {
      promises.push(this.removeQueue(name));
    }
    return Promise.all(promises);
  }

  getQueueNames(): string[] {
    return Array.from(this.queues.keys());
  }
}
