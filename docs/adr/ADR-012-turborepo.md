# ADR-012: Turborepo como Build System

## Contexto

El monorepo necesita un build system con caching, paralelización, y pipelines.

## Problema

Elegir una herramienta que maneje el pipeline de build, lint, test y typecheck de múltiples packages.

## Alternativas

| Alternativa | Pros | Contras |
|-------------|------|---------|
| **Turborepo** | Caching, paralelización, pipelines, remote caching | Ecosistema Vercel |
| **Nx** | Generadores, afectados, plugins | Complejidad, configuración verbosa |
| **Lerna** | Maduro, simple | Sin caching parallel |
| **npm scripts** | Simple, sin dependencias | Manual, sin optimización |

## Decisión

Turborepo 2.3.3 con pipelines declarativos.

## Consecuencias

- `turbo.json` con tasks: build, dev, lint, typecheck, test
- Dependencias entre tasks: `build` → `^build` (topológico)
- Caché local + futura remota (Vercel)
- Outputs: `dist/**`, `.next/**`, `build/**`
- `--filter` para ejecutar en packages específicos
- Integración CI con GitHub Actions (caché Turbo)
