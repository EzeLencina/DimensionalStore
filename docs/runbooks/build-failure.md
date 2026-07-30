# Runbook: Build Failure

## Síntomas

- `pnpm build` falla con errores
- `pnpm typecheck` reporta errores de TypeScript
- CI pipeline falla en el step de build

## Diagnóstico

```bash
# 1. Verificar error exacto
pnpm build 2>&1 | head -50

# 2. TypeScript strict errors
pnpm typecheck

# 3. ESLint errors
pnpm lint

# 4. Verificar dependencias
pnpm install --frozen-lockfile
```

## Causas Comunes

| Causa | Solución |
|-------|----------|
| Dependencia faltante | `pnpm install` |
| TypeScript error | Corregir tipos, ejecutar `pnpm typecheck` |
| Prisma client no generado | `pnpm --filter @tienda/database db:generate` |
| Lockfile desactualizado | `pnpm install --frozen-lockfile` (o `pnpm install` y commit) |
| Path alias mal configurado | Verificar tsconfig.json paths |
| Dependencia circular | Verificar imports, romper ciclo |

## Resolución Rápida

```bash
# 1. Clean + reinstall
pnpm clean
pnpm install

# 2. Regenerar Prisma
pnpm --filter @tienda/database db:generate

# 3. Build limpio
pnpm build

# 4. Si persiste, revisar cambios recientes
git diff HEAD~1 --name-only
```
