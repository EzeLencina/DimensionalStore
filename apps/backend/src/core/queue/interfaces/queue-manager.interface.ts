import type { IQueueAdapter } from './queue-adapter.interface';
import type { QueueDefinition, QueueOptions } from '../types';

export interface IQueueManager {
  createQueue(definition: QueueDefinition, options?: QueueOptions): IQueueAdapter;

  getQueue(name: string): IQueueAdapter | null;

  getQueues(): Map<string, IQueueAdapter>;

  hasQueue(name: string): boolean;

  removeQueue(name: string): Promise<void>;

  clear(): Promise<void[]>;

  getQueueNames(): string[];
}
