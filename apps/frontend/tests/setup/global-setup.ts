export async function setup(): Promise<void> {
  (process.env as Record<string, string>)['NODE_ENV'] = 'test';
  process.env['LOG_LEVEL'] = 'error';
}

export async function teardown(): Promise<void> {
}
