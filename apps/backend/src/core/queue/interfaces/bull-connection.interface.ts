import type { ConnectionHealth } from '../types';

export interface IBullConnectionFactory {
  create(): Promise<unknown>;
  getClient(): unknown;
  isConnected(): boolean;
  close(): Promise<void>;
  health(): Promise<ConnectionHealth>;
}
