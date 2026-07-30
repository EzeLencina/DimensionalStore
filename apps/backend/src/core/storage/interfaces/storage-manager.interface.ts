import type { IStorageDriver } from './storage-driver.interface';
import type { StorageDriverType, StorageDriverConfig } from '../types';

export interface IStorageManager {
  getDriver(): IStorageDriver;
  getDriverType(): StorageDriverType;
  getConfig(): StorageDriverConfig;
  switchDriver(type: StorageDriverType, config?: Partial<StorageDriverConfig>): IStorageDriver;
}
