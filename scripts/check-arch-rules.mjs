#!/usr/bin/env node
import { execSync } from 'child_process';
import { existsSync, readdirSync, statSync } from 'fs';
import { resolve } from 'path';

const ROOT = resolve(import.meta.dirname, '..');
let exitCode = 0;

const CORE_MODULES = ['logger', 'database', 'cache', 'event-bus', 'queue', 'storage', 'mail', 'http', 'api', 'security'];
const ALLOWED_CORE_IMPORTS = ['@common', '@tienda/config'];

function checkFile(path) {
  try {
    const content = execSync(
      `rg -o "(?:from |require\\()['\"]@tienda/([^'\"]+)" "${path}"`,
      { encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'], maxBuffer: 1 * 1024 * 1024 },
    );
    return content.split('\n').filter(Boolean);
  } catch {
    return [];
  }
}

function scanDirectory(dir, moduleName) {
  const entries = readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = resolve(dir, entry.name);
    if (entry.isDirectory() && entry.name !== 'node_modules' && entry.name !== '.turbo' && entry.name !== 'dist') {
      scanDirectory(fullPath, moduleName);
    } else if (entry.isFile() && (entry.name.endsWith('.ts') || entry.name.endsWith('.tsx')) && !entry.name.endsWith('.d.ts')) {
      const imports = checkFile(fullPath);
      for (const imp of imports) {
        const match = imp.match(/@tiendra\/(\S+)/);
        if (match && !ALLOWED_CORE_IMPORTS.includes(`@tienda/${match[1]}`)) {
          const relative = fullPath.replace(`${ROOT}/`, '');
          console.error(`ARCH VIOLATION: ${relative} imports @tienda/${match[1]} (not allowed)`);
          exitCode = 1;
        }
      }
    }
  }
}

for (const mod of CORE_MODULES) {
  const modPath = resolve(ROOT, 'apps', 'backend', 'src', 'core', mod);
  if (existsSync(modPath)) {
    scanDirectory(modPath, mod);
  }
}

if (exitCode === 0) {
  console.log('Architecture rules check passed.');
}
process.exit(exitCode);
