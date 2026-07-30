import { randomUUID } from 'node:crypto';

export class DataGenerator {
  private static seed: number | null = null;

  static setSeed(seed: number): void {
    this.seed = seed;
  }

  static uuid(): string {
    return randomUUID();
  }

  static integer(min = 1, max = 1000): number {
    return Math.floor(this.random() * (max - min + 1)) + min;
  }

  static float(min = 0, max = 1, decimals = 2): number {
    const value = min + this.random() * (max - min);
    return parseFloat(value.toFixed(decimals));
  }

  static boolean(): boolean {
    return this.random() > 0.5;
  }

  static string(length = 10): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(this.random() * chars.length));
    }
    return result;
  }

  static email(): string {
    const name = this.string(8).toLowerCase();
    const domain = this.string(6).toLowerCase();
    return `${name}@${domain}.com`;
  }

  static url(): string {
    const scheme = this.boolean() ? 'https' : 'http';
    const domain = this.string(8).toLowerCase();
    const tld = ['com', 'io', 'dev', 'app', 'org'][this.integer(0, 4)];
    return `${scheme}://${domain}.${tld}`;
  }

  static date(start = new Date(2020, 0, 1), end = new Date()): Date {
    const startMs = start.getTime();
    const endMs = end.getTime();
    return new Date(startMs + this.random() * (endMs - startMs));
  }

  static isoDate(): string {
    return this.date().toISOString();
  }

  static phone(): string {
    const codes = ['+1', '+44', '+34', '+49', '+33'];
    const code = codes[this.integer(0, codes.length - 1)];
    const number = Array.from({ length: 9 }, () => this.integer(0, 9)).join('');
    return `${code}${number}`;
  }

  static pick<T>(items: T[]): T {
    return items[this.integer(0, items.length - 1)]!;
  }

  static pickMultiple<T>(items: T[], min = 1, max = items.length): T[] {
    const count = this.integer(min, Math.min(max, items.length));
    const shuffled = [...items].sort(() => this.random() - 0.5);
    return shuffled.slice(0, count);
  }

  static object<T extends Record<string, unknown>>(template: Record<string, () => unknown>): T {
    const result: Record<string, unknown> = {};
    for (const [key, generator] of Object.entries(template)) {
      result[key] = generator();
    }
    return result as T;
  }

  static array<T>(generator: (index: number) => T, count: number): T[] {
    return Array.from({ length: count }, (_, i) => generator(i));
  }

  static merge<T extends Record<string, unknown>>(
    base: T,
    overrides: Partial<T>,
  ): T {
    return { ...base, ...overrides };
  }

  private static random(): number {
    if (this.seed !== null) {
      this.seed = (this.seed * 1664525 + 1013904223) % 4294967296;
      return this.seed / 4294967296;
    }
    return Math.random();
  }
}
