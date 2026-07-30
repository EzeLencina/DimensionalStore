import { Global, Module, Logger } from '@nestjs/common';
import { RedisConfigurationFactory } from './config';
import { RedisService } from './services';
import { RedisHealthIndicator } from './health';
import { redisClientProvider, redisSubscriberProvider } from './providers';
import { REDIS_TOKENS } from './constants';

@Global()
@Module({
  providers: [
    RedisConfigurationFactory,
    redisClientProvider,
    redisSubscriberProvider,
    RedisService,
    RedisHealthIndicator,
    {
      provide: Logger,
      useValue: new Logger(RedisModule.name),
    },
  ],
  exports: [
    RedisConfigurationFactory,
    RedisService,
    RedisHealthIndicator,
    REDIS_TOKENS.DEFAULT_CLIENT,
  ],
})
export class RedisModule {}
