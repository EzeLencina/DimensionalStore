# Guía de Contribución

## Convenciones de Commits

Usamos [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <description>

feat(products): add search endpoint
fix(inventory): correct stock deduction
chore(deps): update prisma to 5.22
docs(api): document pagination
refactor(core): extract http driver
test(auth): add e2e login tests
ci(docker): add hadolint step
```

**Types**: `feat`, `fix`, `chore`, `docs`, `refactor`, `test`, `ci`, `perf`, `style`

## Flujo de Trabajo

1. Crear rama desde `develop`: `feature/<name>` o `fix/<name>`
2. Implementar siguiendo Clean Architecture
3. Escribir tests (cobertura mínima 90%)
4. Ejecutar `pnpm typecheck && pnpm lint && pnpm test`
5. Crear PR a `develop` con título semántico
6. Asegurar label `major`, `minor`, `patch` o `no-release`
7. Esperar aprobación de CI + code review

## Estructura de PR

- Título: `feat(scope): description`
- Descripción: qué, por qué, cómo
- Checklist de cambios incluidos
- Referencias a issues/ADRs

## Convenciones de Código

Ver [docs/standards/CODING.md](./docs/standards/CODING.md).

## Tests

- Unit: `*.spec.ts` junto al código
- Integration: `test/integration/*.spec.ts`
- E2E: `test/e2e/*.spec.ts`
- Frontend: `*.test.ts` junto al código

```bash
pnpm test                          # Todos los tests
pnpm --filter @tienda/backend test # Solo backend
pnpm --filter @tienda/frontend test # Solo frontend
```

## Buenas Prácticas

1. **No importar módulos de negocio entre sí** — usar eventos
2. **Domain no conoce Infrastructure** — depende solo de interfaces
3. **Controllers sin lógica** — solo delegan a handlers
4. **Zod para validación** de toda entrada externa
5. **Value Objects inmutables** y auto-validantes
6. **Server Components por defecto** en frontend
7. **No secretos en código** — usar env vars con Zod validation
8. **ADR para decisiones arquitectónicas** en `docs/adr/`
