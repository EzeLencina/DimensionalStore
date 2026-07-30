export class MockRegistry {
  private mocks: Map<string, unknown> = new Map();
  private enabled: Map<string, boolean> = new Map();

  register(name: string, mock: unknown): void {
    this.mocks.set(name, mock);
    this.enabled.set(name, true);
  }

  get<T>(name: string): T | undefined {
    if (!this.isEnabled(name)) return undefined;
    return this.mocks.get(name) as T | undefined;
  }

  enable(name: string): void {
    this.enabled.set(name, true);
  }

  disable(name: string): void {
    this.enabled.set(name, false);
  }

  isEnabled(name: string): boolean {
    return this.enabled.get(name) ?? false;
  }

  reset(name: string): void {
    this.mocks.delete(name);
    this.enabled.delete(name);
  }

  resetAll(): void {
    this.mocks.clear();
    this.enabled.clear();
  }

  getRegisteredNames(): string[] {
    return Array.from(this.mocks.keys());
  }
}

export const mockRegistry = new MockRegistry();
