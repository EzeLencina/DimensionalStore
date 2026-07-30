# ADR-011: pnpm como Package Manager

## Contexto

El monorepo necesita un package manager eficiente con soporte de workspaces.

## Problema

Elegir un package manager que maneje dependencias compartidas, hoisting controlado, y caché eficiente.

## Alternativas

| Alternativa | Pros | Contras |
|-------------|------|---------|
| **pnpm** | Estructura node_modules estricta, ahorro disco, rápido | Compatibilidad ocasional |
| **npm** | Estándar, widely used | node_modules anidados, lento |
| **Yarn** | Plug'n'Play, workspaces | Complejidad PnP |

## Decisión

pnpm 9.15.0 con workspace protocol (`workspace:*`).

## Consecuencias

- `pnpm-workspace.yaml` define los workspaces
- `workspace:*` para dependencias internas
- `pnpm-lock.yaml` versionado
- Caché pnpm store para CI
- <10MB de overhead vs npm/yarn
- Estructura node_modules estricta (sin hoisting no controlado)
- `pnpm install --frozen-lockfile` en CI
