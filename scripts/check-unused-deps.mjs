#!/usr/bin/env node
import { execSync } from 'child_process';

try {
  const result = execSync('npx depcheck --ignores="@tienda/*,turbo,husky,lint-staged,prettier"', {
    encoding: 'utf8',
    stdio: ['pipe', 'pipe', 'pipe'],
    maxBuffer: 5 * 1024 * 1024,
  });
  console.log('Dependency check passed.');
  process.exit(0);
} catch (err) {
  const output = err.stdout || err.message || 'Unknown error';
  console.log('Unused or missing dependencies found:');
  console.log(output);
  process.exit(0);
}
