import { Global, Module } from '@nestjs/common';
import { LoggerModule } from './logger/logger.module';
import { DatabaseModule } from './database/database.module';
import { CacheModule } from './cache/cache.module';
import { EventBusModule } from './events/event-bus.module';
import { QueueModule } from './queue/queue.module';
import { StorageModule } from './storage/storage.module';
import { MailModule } from './mail/mail.module';
import { HttpModule } from './http/http.module';
import { SecurityModule } from './security/security.module';
import { ApiModule } from './api/api.module';

@Global()
@Module({
  imports: [
    LoggerModule,
    DatabaseModule,
    CacheModule,
    EventBusModule,
    QueueModule,
    StorageModule,
    MailModule,
    HttpModule,
    ApiModule,
    SecurityModule,
  ],
  exports: [
    LoggerModule,
    DatabaseModule,
    CacheModule,
    EventBusModule,
    QueueModule,
    StorageModule,
    MailModule,
    HttpModule,
    ApiModule,
    SecurityModule,
  ],
})
export class CoreModule {}
