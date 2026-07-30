export class TestEnvironment {
  private static initialized = false;
  private static envBackup: Record<string, string | undefined> = {};

  static setup(): void {
    if (this.initialized) return;

    this.envBackup = { ...process.env };

    const env = process.env as Record<string, string | undefined>;
    env['NODE_ENV'] = 'test';
    env['LOG_LEVEL'] = 'error';
    env['API_VERSIONING_TYPE'] = 'uri';
    env['API_DEFAULT_VERSION'] = '1.0';
    env['API_SUPPORTED_VERSIONS'] = '1.0';
    env['API_DEFAULT_LIMIT'] = '20';
    env['API_MAX_LIMIT'] = '100';
    env['HTTP_DRIVER'] = 'undici';
    env['HTTP_TIMEOUT'] = '5000';

    this.initialized = true;
  }

  static teardown(): void {
    Object.keys(this.envBackup).forEach(key => {
      if (this.envBackup[key] !== undefined) {
        (process.env as Record<string, string | undefined>)[key] = this.envBackup[key];
      } else {
        delete process.env[key];
      }
    });

    this.envBackup = {};
    this.initialized = false;
  }

  static isInitialized(): boolean {
    return this.initialized;
  }

  static withEnv<T>(env: Record<string, string>, fn: () => T): T {
    const backup: Record<string, string | undefined> = {};

    Object.entries(env).forEach(([key, value]) => {
      backup[key] = process.env[key];
      (process.env as Record<string, string>)[key] = value;
    });

    try {
      return fn();
    } finally {
      Object.entries(backup).forEach(([key, value]) => {
        if (value !== undefined) {
          (process.env as Record<string, string | undefined>)[key] = value;
        } else {
          delete process.env[key];
        }
      });
    }
  }
}

export async function globalSetup(): Promise<void> {
  TestEnvironment.setup();
}

export async function globalTeardown(): Promise<void> {
  TestEnvironment.teardown();
}
