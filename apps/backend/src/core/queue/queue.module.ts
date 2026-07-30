import { Global, Module } from '@nestjs/common';
import { QueueConfigurationFactory } from './config';
import { BullConnectionFactory } from './bull';
import { QueueManagerService, QueueService, WorkerManagerService } from './services';
import { QueueHealthService } from './health';
import { queueConnectionProvider, queueConfigProvider } from './providers';

@Global()
@Module({
  providers: [
    QueueConfigurationFactory,
    BullConnectionFactory,
    QueueManagerService,
    QueueService,
    WorkerManagerService,
    QueueHealthService,
    queueConnectionProvider,
    queueConfigProvider,
  ],
  exports: [
    QueueConfigurationFactory,
    BullConnectionFactory,
    QueueManagerService,
    QueueService,
    WorkerManagerService,
    QueueHealthService,
  ],
})
export class QueueModule {}
