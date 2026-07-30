import { TestEnvironment } from '@tienda/testing';

let appInstance: unknown = null;

export async function setupTestApp(): Promise<void> {
  TestEnvironment.setup();
}

export async function teardownTestApp(): Promise<void> {
  if (appInstance) {
    const app = appInstance as { close: () => Promise<void> };
    await app.close();
    appInstance = null;
  }
  TestEnvironment.teardown();
}

export function getApp(): unknown {
  return appInstance;
}

export function setApp(app: unknown): void {
  appInstance = app;
}

beforeAll(async () => {
  await setupTestApp();
});

afterAll(async () => {
  await teardownTestApp();
});
