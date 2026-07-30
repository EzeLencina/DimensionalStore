import type { IHttpClient } from './http-client.interface';
import type { HttpConfiguration, HttpDriverType } from '../types';

export interface IHttpManager {
  getClient(): IHttpClient;

  getDriverType(): HttpDriverType;

  getConfig(): HttpConfiguration;

  switchDriver(type: HttpDriverType): IHttpClient;
}
