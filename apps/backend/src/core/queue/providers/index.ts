import { FactoryProvider } from '@nestjs/common';
import { QUEUE_TOKENS } from '../constants/queue-tokens';
import { QueueConfigurationFactory } from '../config';
import { BullConnectionFactory } from '../bull';

export const queueConnectionProvider: FactoryProvider = {
  provide: QUEUE_TOKENS.BULL_CONNECTION,
  useFactory: async (config: QueueConfigurationFactory) => {
    const factory = new BullConnectionFactory(config);
    await factory.create();
    return factory;
  },
  inject: [QueueConfigurationFactory],
};

export const queueConfigProvider = {
  provide: QUEUE_TOKENS.CONFIG,
  useClass: QueueConfigurationFactory,
};
