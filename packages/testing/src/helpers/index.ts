export class TestHelper {
  static async wait(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  static async waitForCondition(
    condition: () => boolean | Promise<boolean>,
    timeout = 5000,
    interval = 100,
  ): Promise<void> {
    const startTime = Date.now();

    while (Date.now() - startTime < timeout) {
      if (await condition()) return;
      await this.wait(interval);
    }

    throw new Error(`Condition not met within ${timeout}ms`);
  }

  static async retry<T>(
    fn: () => Promise<T>,
    options: { attempts?: number; delay?: number; backoff?: boolean } = {},
  ): Promise<T> {
    const attempts = options.attempts ?? 3;
    const delay = options.delay ?? 100;
    let lastError: Error | null = null;

    for (let i = 0; i < attempts; i++) {
      try {
        return await fn();
      } catch (error) {
        lastError = error as Error;
        if (i < attempts - 1) {
          const waitTime = options.backoff ? delay * Math.pow(2, i) : delay;
          await this.wait(waitTime);
        }
      }
    }

    throw lastError ?? new Error('Retry failed');
  }

  static randomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  static randomString(length = 10): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    return Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
  }

  static cloneDeep<T>(data: T): T {
    return JSON.parse(JSON.stringify(data));
  }

  static omit<T extends Record<string, unknown>, K extends keyof T>(obj: T, keys: K[]): Omit<T, K> {
    const result = { ...obj };
    for (const key of keys) {
      delete result[key];
    }
    return result as Omit<T, K>;
  }

  static pick<T extends Record<string, unknown>, K extends keyof T>(obj: T, keys: K[]): Pick<T, K> {
    const result = {} as Pick<T, K>;
    for (const key of keys) {
      if (key in obj) {
        result[key] = obj[key];
      }
    }
    return result;
  }

  static measureExecutionTime(fn: () => Promise<unknown>): Promise<number> {
    const start = Date.now();
    return fn().then(() => Date.now() - start);
  }
}

export function createTestContext(overrides?: Partial<{ requestId: string; metadata: Record<string, unknown> }>) {
  return {
    requestId: overrides?.requestId ?? 'test-request-id',
    timestamp: new Date().toISOString(),
    metadata: overrides?.metadata ?? {},
  };
}
