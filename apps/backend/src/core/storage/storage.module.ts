import { Global, Module } from '@nestjs/common';
import { StorageConfigurationFactory } from './config';
import { StorageDriverFactory } from './factory';
import { LocalDriver, S3CompatibleDriver, MemoryDriver } from './drivers';
import { StorageManagerService, StorageService } from './services';
import { StorageHealthService } from './health';
import { MulterAdapter, StreamAdapter } from './adapters';
import { storageConfigProvider, storageDriverProvider } from './providers';

@Global()
@Module({
  providers: [
    StorageConfigurationFactory,
    StorageDriverFactory,
    LocalDriver,
    S3CompatibleDriver,
    MemoryDriver,
    StorageManagerService,
    StorageService,
    StorageHealthService,
    MulterAdapter,
    StreamAdapter,
    storageConfigProvider,
    storageDriverProvider,
  ],
  exports: [
    StorageConfigurationFactory,
    StorageDriverFactory,
    LocalDriver,
    S3CompatibleDriver,
    MemoryDriver,
    StorageManagerService,
    StorageService,
    StorageHealthService,
    MulterAdapter,
    StreamAdapter,
  ],
})
export class StorageModule {}
