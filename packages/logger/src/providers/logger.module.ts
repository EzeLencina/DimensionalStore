import { Global, Module } from '@nestjs/common';
import { loggerProvider } from './logger.provider';
import { LOGGER_TOKEN } from './logger.token';

@Global()
@Module({
  providers: [loggerProvider],
  exports: [LOGGER_TOKEN],
})
export class LoggerModule {}
