export class ConfigMock {
  private config: Map<string, unknown> = new Map();

  constructor(defaults?: Record<string, unknown>) {
    if (defaults) {
      Object.entries(defaults).forEach(([key, value]) => {
        this.config.set(key, value);
      });
    }
  }

  set(key: string, value: unknown): void {
    this.config.set(key, value);
  }

  get<T>(key: string): T | undefined {
    return this.config.get(key) as T | undefined;
  }

  getOrThrow<T>(key: string): T {
    const value = this.config.get(key);
    if (value === undefined) {
      throw new Error(`Config key "${key}" not found`);
    }
    return value as T;
  }

  has(key: string): boolean {
    return this.config.has(key);
  }

  all(): Record<string, unknown> {
    const result: Record<string, unknown> = {};
    this.config.forEach((value, key) => {
      result[key] = value;
    });
    return result;
  }

  setBatch(values: Record<string, unknown>): void {
    Object.entries(values).forEach(([key, value]) => {
      this.config.set(key, value);
    });
  }

  delete(key: string): void {
    this.config.delete(key);
  }

  clear(): void {
    this.config.clear();
  }

  reset(defaults?: Record<string, unknown>): void {
    this.config.clear();
    if (defaults) {
      Object.entries(defaults).forEach(([key, value]) => {
        this.config.set(key, value);
      });
    }
  }
}
