export type LogLevel = 'fatal' | 'error' | 'warn' | 'info' | 'debug' | 'trace';

export interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  context?: string;
  data?: Record<string, unknown>;
  error?: Error;
  requestId?: string;
  correlationId?: string;
  traceId?: string;
  tenantId?: string;
  userId?: string;
  sessionId?: string;
  ip?: string;
  method?: string;
  url?: string;
  statusCode?: number;
  duration?: number;
  threshold?: number;
  controller?: string;
  handler?: string;
  metadata?: Record<string, unknown>;
}

export interface Logger {
  fatal(entry: Omit<LogEntry, 'level' | 'timestamp'>): void;
  error(entry: Omit<LogEntry, 'level' | 'timestamp'>): void;
  warn(entry: Omit<LogEntry, 'level' | 'timestamp'>): void;
  info(entry: Omit<LogEntry, 'level' | 'timestamp'>): void;
  debug(entry: Omit<LogEntry, 'level' | 'timestamp'>): void;
  trace(entry: Omit<LogEntry, 'level' | 'timestamp'>): void;

  child(context: string): Logger;
  child(metadata: Record<string, unknown>): Logger;
}

export interface LoggerConfig {
  level: LogLevel;
  prettyPrint: boolean;
  destination?: string;
  redact?: string[];
  base?: Record<string, unknown>;
  enabled?: boolean;
}

export type LoggerFactory = (config?: Partial<LoggerConfig>) => Logger;
