import type { Logger, LogEntry } from '../types';

export class NoopLogger implements Logger {
  fatal(_entry: Omit<LogEntry, 'level' | 'timestamp'>): void {}
  error(_entry: Omit<LogEntry, 'level' | 'timestamp'>): void {}
  warn(_entry: Omit<LogEntry, 'level' | 'timestamp'>): void {}
  info(_entry: Omit<LogEntry, 'level' | 'timestamp'>): void {}
  debug(_entry: Omit<LogEntry, 'level' | 'timestamp'>): void {}
  trace(_entry: Omit<LogEntry, 'level' | 'timestamp'>): void {}

  child(_context: string): Logger;
  child(_metadata: Record<string, unknown>): Logger;
  child(_contextOrMeta: string | Record<string, unknown>): Logger {
    return new NoopLogger();
  }
}
