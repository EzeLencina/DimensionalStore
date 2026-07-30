#!/usr/bin/env node
import { execSync } from 'child_process';

try {
  const result = execSync(
    'npx ts-unused-exports tsconfig.json --showLineNumber --exitWithCount',
    { encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'], maxBuffer: 5 * 1024 * 1024 },
  );
  if (result) {
    console.log(result);
  }
  process.exit(0);
} catch (err) {
  const output = err.stdout || err.message || 'Unknown error';
  console.log(output);
  process.exit(0);
}
