# Backend — NestJS

## Stack

- **Runtime**: Node.js 20+, NestJS 10, TypeScript Strict
- **ORM**: Prisma 5+ (PostgreSQL 16)
- **Queue**: BullMQ 5+ (Redis 7)
- **Cache**: Redis 7 (ioredis)
- **Storage**: Local / S3-compatible
- **Mail**: SMTP / Log / SES / SendGrid / Mailgun / Resend
- **HTTP**: Undici (fetch nativo)
- **Auth**: JWT + Passport (futuro)
- **API**: REST + OpenAPI 3.1 (Swagger)

## Core Modules

Cada módulo es `@Global()` y se importa en `CoreModule`:

| Módulo | Path | Archivos | Propósito |
|--------|------|----------|-----------|
| Logger | `@core/logger` | 1 | Pino logger |
| Database | `@core/database` | 2 | Prisma service |
| Cache | `@core/cache` | 18 | Redis operations |
| EventBus | `@core/events` | 1 | Domain events |
| Queue | `@core/queue` | 38 | BullMQ queues |
| Storage | `@core/storage` | 21 | File storage |
| Mail | `@core/mail` | 28 | Email sending |
| Http | `@core/http` | 43 | HTTP client |
| Api | `@core/api` | 71 | REST infrastructure |
| Security | `@core/security` | 16 | HTTP security |

## Arquitectura Clean Architecture

```
apps/backend/src/
├── main.ts                # Bootstrap
├── app.module.ts          # Root module
├── config/                # 8 config factories
├── core/                  # 10 infrastructure modules
├── common/                # Shared (guards, filters, pipes, exceptions)
├── domain/                # DDD domain layer
├── application/           # CQRS layer
├── infrastructure/        # External implementations
├── modules/               # Business bounded contexts
└── modules/health/        # Health check
```

## Path Aliases

| Alias | Path |
|-------|------|
| `@core/*` | `src/core/*` |
| `@common/*` | `src/common/*` |
| `@modules/*` | `src/modules/*` |
| `@domain/*` | `src/domain/*` |
| `@application/*` | `src/application/*` |
| `@infrastructure/*` | `src/infrastructure/*` |
| `@config/*` | `src/config/*` |
| `@shared/*` | `src/shared/*` |

## Bounded Contexts Planificados

1. **Identity** — Users, Roles, Tenants
2. **Catalog** — Products, Categories, Brands
3. **Inventory** — Stock, Warehouses
4. **Sales** — Orders, Cart, Checkout
5. **Purchasing** — Purchase Orders
6. **Customers** — Customer management
7. **Suppliers** — Supplier management
8. **Finance** — Transactions, Invoices
9. **Cash** — Cash Registers
10. **CRM** — Segments, Notes
11. **Marketing** — Coupons, Campaigns
12. **CMS** — Pages, Content
13. **Notifications** — Email, Push
14. **Audit** — Audit logging

## Comandos

```bash
pnpm --filter @tienda/backend dev      # Desarrollo
pnpm --filter @tienda/backend build    # Compilar
pnpm --filter @tienda/backend test     # Tests
pnpm --filter @tienda/backend typecheck # TypeScript
pnpm --filter @tienda/backend start:prod # Producción
```

## Testing

- **Runner**: Jest
- **Coverage**: 90% statements, branches, functions, lines
- **Unit**: `*.spec.ts` colocated
- **Integration**: `test/integration/`
- **E2E**: `test/e2e/` via Supertest
- **Mocks**: `@tienda/testing` package
