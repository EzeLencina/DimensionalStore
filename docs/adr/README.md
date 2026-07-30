# Architecture Decision Records

Este directorio contiene los ADRs del proyecto Tienda. Cada ADR documenta una decisión arquitectónica significativa.

## Índice

| ID | Decisión | Contexto |
|----|----------|----------|
| [ADR-001](./ADR-001-nestjs.md) | NestJS como framework backend | Framework Node.js empresarial |
| [ADR-002](./ADR-002-nextjs.md) | Next.js como framework frontend | React con SSR/SSG/ISR |
| [ADR-003](./ADR-003-prisma.md) | Prisma como ORM | Type-safe database access |
| [ADR-004](./ADR-004-postgresql.md) | PostgreSQL como base de datos | Base de datos relacional |
| [ADR-005](./ADR-005-redis.md) | Redis como cache + colas | Cache + Pub/Sub + BullMQ |
| [ADR-006](./ADR-006-bullmq.md) | BullMQ para colas de procesamiento | Job processing sobre Redis |
| [ADR-007](./ADR-007-undici.md) | Undici como HTTP client | HTTP cliente nativo |
| [ADR-008](./ADR-008-cloudflare-r2.md) | Cloudflare R2 como storage | S3-compatible object storage |
| [ADR-009](./ADR-009-zod.md) | Zod para validación | TypeScript-first validation |
| [ADR-010](./ADR-010-pino.md) | Pino para logging | Logging estructurado |
| [ADR-011](./ADR-011-pnpm.md) | pnpm como package manager | Package manager monorepo |
| [ADR-012](./ADR-012-turborepo.md) | Turborepo para monorepo | Build system monorepo |
| [ADR-013](./ADR-013-multi-tenant.md) | Shared DB + RLS multi-tenant | Estrategia multi-tenant |
| [ADR-014](./ADR-014-clean-architecture.md) | Clean Architecture + DDD | Arquitectura de software |
| [ADR-015](./ADR-015-api-versioning.md) | Versionado URI por defecto | Estrategia de versionado API |
