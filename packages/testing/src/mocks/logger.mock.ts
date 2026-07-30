export class LoggerMock {
  readonly logs: Array<{ level: string; message: string; data?: unknown }> = [];

  debug(message: string, data?: unknown): void {
    this.logs.push({ level: 'debug', message, data });
  }

  info(message: string, data?: unknown): void {
    this.logs.push({ level: 'info', message, data });
  }

  warn(message: string, data?: unknown): void {
    this.logs.push({ level: 'warn', message, data });
  }

  error(message: string, data?: unknown): void {
    this.logs.push({ level: 'error', message, data });
  }

  fatal(message: string, data?: unknown): void {
    this.logs.push({ level: 'fatal', message, data });
  }

  trace(message: string, data?: unknown): void {
    this.logs.push({ level: 'trace', message, data });
  }

  getByLevel(level: string): Array<{ level: string; message: string; data?: unknown }> {
    return this.logs.filter(log => log.level === level);
  }

  hasMessage(message: string): boolean {
    return this.logs.some(log => log.message.includes(message));
  }

  hasLevel(level: string): boolean {
    return this.logs.some(log => log.level === level);
  }

  clear(): void {
    this.logs.length = 0;
  }

  get size(): number {
    return this.logs.length;
  }
}
