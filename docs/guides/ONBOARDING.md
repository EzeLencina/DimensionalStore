# Onboarding Guide

## Día 1 — Entorno

```bash
git clone <repo>
cd tienda
pnpm install
pnpm build
pnpm dev
```

Verificar:
- Backend en `http://localhost:4000/health`
- Frontend en `http://localhost:3000`
- Swagger en `http://localhost:4000/api/docs`

## Día 2 — Arquitectura

Leer en orden:
1. `docs/architecture/00-visao-general.md`
2. `docs/architecture/02-backend-arquitectura.md`
3. `docs/architecture/03-frontend-arquitectura.md`
4. `docs/domain/01-bounded-contexts.md`
5. `ARCHITECTURE.md`
6. `docs/adr/` (los más relevantes)

## Día 3 — Código

Explorar:
- `apps/backend/src/core/` — 10 módulos de infraestructura
- `apps/backend/src/modules/` — Módulos de negocio (future)
- `apps/frontend/src/features/` — Features frontend
- `packages/` — 14 packages compartidos

## Día 4 — Desarrollo

Realizar un cambio pequeño:
1. Crear rama `feature/first-change`
2. Leer `CONTRIBUTING.md`
3. Implementar siguiendo `docs/standards/CODING.md`
4. Ejecutar `pnpm typecheck && pnpm lint && pnpm test`
5. Crear PR con título semántico

## Recursos

| Recurso | Ubicación |
|---------|-----------|
| Developer Guide | `docs/guides/DEVELOPER.md` |
| Coding Standards | `docs/standards/CODING.md` |
| Architecture | `ARCHITECTURE.md` |
| ADR | `docs/adr/` |
| DevOps | `docs/devops/README.md` |
| Runbooks | `docs/runbooks/` |
| Testing | `docs/testing/README.md` |
| AI Docs | `docs/ai/` |

## Contacto

- Issues: GitHub Issues
- PRs: GitHub Pull Requests
- Discusiones: GitHub Discussions
