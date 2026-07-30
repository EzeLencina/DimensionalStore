#!/usr/bin/env node
import { execSync } from 'child_process';
import { existsSync, readFileSync } from 'fs';
import { resolve } from 'path';

const result = execSync('npx madge --circular --extensions ts,tsx apps/ packages/', {
  encoding: 'utf8',
  stdio: ['pipe', 'pipe', 'pipe'],
  maxBuffer: 10 * 1024 * 1024,
});

const lines = result.split('\n').filter(Boolean);

if (lines.length > 0) {
  console.error('Circular dependencies detected:');
  for (const line of lines) {
    console.error(`  ${line}`);
  }
  process.exit(1);
}

console.log('No circular dependencies found.');
process.exit(0);
