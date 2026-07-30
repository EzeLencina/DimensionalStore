import { DataGenerator } from '../generators';

export interface FactoryBuildOptions<T> {
  count?: number;
  overrides?: Partial<T>;
  sequence?: (index: number) => Partial<T>;
}

export abstract class BaseFactory<T extends Record<string, unknown>> {
  protected abstract define(): T;

  build(overrides?: Partial<T>): T {
    return { ...this.define(), ...overrides } as T;
  }

  buildMany(count: number, overrides?: Partial<T>): T[] {
    return Array.from({ length: count }, () => this.build(overrides));
  }

  buildSequence(
    count: number,
    sequence: (index: number) => Partial<T>,
  ): T[] {
    return Array.from({ length: count }, (_, i) =>
      this.build(sequence(i)),
    );
  }

  buildWithOptions(options: FactoryBuildOptions<T>): T | T[] {
    if (options.count && options.count > 1) {
      if (options.sequence) {
        return this.buildSequence(options.count, options.sequence);
      }
      return this.buildMany(options.count, options.overrides);
    }
    return this.build(options.overrides);
  }
}

export class ObjectFactory<T extends Record<string, unknown>> extends BaseFactory<T> {
  private definition: T | (() => T);

  constructor(definition: T | (() => T)) {
    super();
    this.definition = definition;
  }

  protected define(): T {
    if (typeof this.definition === 'function') {
      return (this.definition as () => T)();
    }
    return { ...this.definition };
  }

  setDefinition(definition: T | (() => T)): void {
    this.definition = definition;
  }
}

export function createFactory<T extends Record<string, unknown>>(
  definition: T | (() => T),
): ObjectFactory<T> {
  return new ObjectFactory<T>(definition);
}

export interface FactoryBuilderStep<T> {
  with(overrides: Partial<T>): FactoryBuilderStep<T>;
  sequence(fn: (index: number) => Partial<T>): FactoryBuilderStep<T>;
  build(): T;
  buildMany(count: number): T[];
}

export function factoryBuilder<T extends Record<string, unknown>>(
  base: T,
): FactoryBuilderStep<T> {
  let overrides: Partial<T> = {};
  let seq: ((index: number) => Partial<T>) | null = null;

  const step: FactoryBuilderStep<T> = {
    with: (override: Partial<T>) => {
      overrides = { ...overrides, ...override };
      return step;
    },
    sequence: (fn: (index: number) => Partial<T>) => {
      seq = fn;
      return step;
    },
    build: () => ({ ...base, ...overrides } as T),
    buildMany: (count: number) => {
      if (seq !== null) {
        return Array.from({ length: count }, (_, i) => ({
          ...base,
          ...(seq as (index: number) => Partial<T>)(i),
        })) as T[];
      }
      return Array.from({ length: count }, () => ({
        ...base,
        ...overrides,
      })) as T[];
    },
  };

  return step;
}

export class FactoryManager {
  private factories: Map<string, BaseFactory<Record<string, unknown>>> = new Map();

  register<T extends Record<string, unknown>>(name: string, factory: BaseFactory<T>): void {
    this.factories.set(name, factory as BaseFactory<Record<string, unknown>>);
  }

  get<T extends Record<string, unknown>>(name: string): BaseFactory<T> {
    const factory = this.factories.get(name);
    if (!factory) {
      throw new Error(`Factory "${name}" not registered`);
    }
    return factory as BaseFactory<T>;
  }

  build<T extends Record<string, unknown>>(name: string, overrides?: Partial<T>): T {
    return this.get<T>(name).build(overrides);
  }

  buildMany<T extends Record<string, unknown>>(name: string, count: number, overrides?: Partial<T>): T[] {
    return this.get<T>(name).buildMany(count, overrides);
  }

  clear(): void {
    this.factories.clear();
  }
}

export const factoryManager = new FactoryManager();
