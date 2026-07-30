# Runbook: Migration Failure

## Síntomas

- `prisma migrate dev` falla
- `prisma migrate deploy` falla en CI
- Error de schema o base de datos

## Diagnóstico

```bash
# 1. Ver estado de migraciones
pnpm --filter @tienda/database db:status

# 2. Ver migraciones pendientes
pnpm --filter @tienda/database db:list

# 3. Ver schema actual
pnpm --filter @tienda/database db:validate
```

## Causas Comunes

| Causa | Solución |
|-------|----------|
| Schema inválido | Corregir schema.prisma |
| Migración conflictiva | Resolver conflictos manualmente |
| Base de datos no accesible | Verificar conexión |
| Datos existentes incompatibles | Crear migración con `--create-only` y editar SQL |

## Resolución

```bash
# 1. Si es desarrollo (pérdida de datos aceptable)
pnpm --filter @tienda/database db:reset

# 2. Si es producción — crear migración manual
pnpm --filter @tienda/database db:migrate --create-only
# Editar el SQL generado
pnpm --filter @tienda/database db:migrate --deploy

# 3. Rollback (solo si es seguro)
pnpm --filter @tienda/database db:migrate --rollback
```
