import { defineConfig } from 'vitest/config';
import path from 'node:path';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    root: './tests',
    include: [
      'unit/**/*.test.ts',
      'unit/**/*.spec.ts',
      'components/**/*.test.tsx',
      'components/**/*.spec.tsx',
      'integration/**/*.test.ts',
      'integration/**/*.spec.ts',
    ],
    exclude: ['e2e/**/*', 'node_modules'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      include: ['../src/**/*.ts', '../src/**/*.tsx'],
      exclude: [
        '../src/**/*.d.ts',
        '../src/**/*.test.ts',
        '../src/**/*.spec.ts',
        '../src/**/index.ts',
      ],
    },
    setupFiles: ['./setup/global.ts'],
    globalSetup: ['./setup/global-setup.ts'],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '../src'),
    },
  },
});
