# ADR-003: Prisma como ORM

## Contexto

Se necesita un ORM para PostgreSQL con type-safety, migraciones, y buena DX.

## Problema

Elegir un ORM TypeScript que ofrezca type-safety nativo, migraciones declarativas, y buen rendimiento.

## Alternativas

| Alternativa | Pros | Contras |
|-------------|------|---------|
| **Prisma** | Type-safe, migraciones automáticas, studio | Capa extra de abstracción |
| **TypeORM** | Maduro, active record + data mapper | Decoradores, queries complejas |
| **Drizzle** | SQL-like, lightweight | Migraciones manuales, ORM joven |
| **Knex** | SQL builder puro | Sin type-safety, todo manual |

## Decisión

Prisma 5+ con schema declarativo y migraciones.

## Consecuencias

- `prisma generate` para cliente type-safe
- Migraciones declarativas con `prisma migrate`
- Studio para exploración visual
- Soporte nativo de PostgreSQL features (enum, array, jsonb)
- Middleware Prisma para logging y multi-tenant
- Esquema centralizado en packages/database
