import { ConnectionOptions } from 'tls';

export type RedisNamespace =
  | 'app'
  | 'cache'
  | 'queue'
  | 'session'
  | 'lock'
  | 'config'
  | 'rate-limit'
  | 'pubsub'
  | 'future';

export type SerializationFormat = 'json' | 'string' | 'buffer' | 'raw';

export type ExpirationStrategy =
  | { type: 'ttl'; ttl: number }
  | { type: 'sliding'; ttl: number; maxTtl: number }
  | { type: 'absolute'; expireAt: Date }
  | { type: 'none' };

export interface RedisConnectionOptions {
  readonly host: string;
  readonly port: number;
  readonly password?: string;
  readonly db: number;
  readonly tls?: boolean | ConnectionOptions;
  readonly keyPrefix: string;
  readonly connectTimeout: number;
  readonly retryMaxAttempts: number;
  readonly retryBaseDelay: number;
  readonly retryMaxDelay: number;
  readonly keepAlive: number;
  readonly family: number;
  readonly enableOfflineQueue: boolean;
  readonly lazyConnect: boolean;
  readonly maxRetriesPerRequest?: number;
  readonly enableAutoPipelining?: boolean;
  readonly sentinels?: Array<{ host: string; port: number }>;
  readonly name?: string;
  readonly role?: 'master' | 'slave';
}

export interface RedisHealthStatus {
  readonly connected: boolean;
  readonly ping: number;
  readonly latency: number;
  readonly reconnectAttempts: number;
  readonly lastReconnect: Date | null;
  readonly uptime: number;
  readonly activeCommands: number;
  readonly connectionError: string | null;
}

export interface RedisConnectionStatus {
  readonly isConnected: boolean;
  readonly isConnecting: boolean;
  readonly isReconnecting: boolean;
  readonly ready: boolean;
  readonly end: boolean;
  readonly error: Error | null;
}

export interface SerializedValue {
  readonly data: string | Buffer;
  readonly encoding: SerializationFormat;
  readonly ttl?: number;
}

export interface RedisEventMap {
  connect: () => void;
  ready: () => void;
  error: (error: Error) => void;
  close: () => void;
  reconnecting: (delay: number, attempt: number) => void;
  end: () => void;
  wait: () => void;
  '+node': (role: string, host: string, port: number) => void;
  '-node': (role: string, host: string, port: number) => void;
  'node error': (error: Error, host: string, port: number) => void;
}

export interface RedisMonitorEvent {
  readonly time: Date;
  readonly args: string[];
  readonly source: string;
  readonly database: number;
}
