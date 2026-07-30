# Runbook: Pipeline Failure

## Síntomas

- GitHub Actions workflow falla
- Status check rojo en PR
- Notificación de pipeline fallido

## Diagnóstico

1. Abrir GitHub Actions → workflow run
2. Identificar job fallido
3. Expandir step fallido para ver error

## Causas Comunes

### Lint / TypeCheck
```bash
# Reproducir local
pnpm lint
pnpm typecheck
pnpm format:check
```

### Tests
```bash
# Reproducir local
pnpm test
# Coverage
pnpm test -- --coverage
```

### Build
```bash
# Reproducir local
pnpm clean
pnpm install --frozen-lockfile
pnpm build
```

### Docker
```bash
# Reproducir local
hadolint docker/backend/Dockerfile
docker compose -f docker/dev/docker-compose.yml config
```

## Resolución Rápida

1. **Error de lint**: Corregir código, ejecutar `pnpm lint`
2. **Error de typecheck**: Corregir tipos, `pnpm typecheck`
3. **Test fallido**: Corregir test o código, `pnpm test`
4. **Build fallido**: `pnpm clean && pnpm build`
5. **Docker fallido**: Verificar Dockerfile con `hadolint`

## Si el Fix No es Obvio

1. Revisar diff del PR: `git diff main...HEAD`
2. Buscar cambios en archivos sensibles (tsconfig, package.json, prisma schema)
3. Verificar si el error es pre-existente (re-run workflow en main)
4. Commentar en el PR con el error y plan de fix
