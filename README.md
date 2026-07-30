# Tienda — Plataforma Empresarial Integrada

ERP + Ecommerce + CRM. Monorepo con NestJS, Next.js, TypeScript Strict, Clean Architecture y DDD.

## Stack

| Capa | Tecnología |
|------|-----------|
| **Runtime** | Node.js 20+, pnpm 9, Turborepo |
| **Backend** | NestJS 10, TypeScript Strict |
| **Frontend** | Next.js 15, App Router, TailwindCSS, shadcn/ui |
| **Database** | PostgreSQL 16, Prisma ORM |
| **Cache** | Redis 7 (ioredis) |
| **Queue** | BullMQ |
| **Storage** | Local / S3-compatible (Cloudflare R2) |
| **Mail** | SMTP / Log / SendGrid / SES / Mailgun / Resend |
| **API** | REST (NestJS) con OpenAPI 3.1 |
| **Testing** | Jest (backend) + Vitest (frontend) + @tienda/testing |
| **CI/CD** | GitHub Actions, Docker |

## Arquitectura

```
tienda/
├── apps/
│   ├── backend/        # NestJS API — Clean Architecture + DDD
│   └── frontend/       # Next.js 15 — Feature-Based Modular
├── packages/           # Shared kernel (14 packages)
│   ├── config/         # Zod-validated env config
│   ├── database/       # Prisma client + schema
│   ├── logger/         # Pino logger + NestJS module
│   ├── queue/          # Queue abstractions
│   ├── testing/        # Test utilities (factories, mocks, fixtures)
│   ├── ui/             # Shared React components
│   ├── shared/         # Domain-agnostic types
│   ├── types/          # Shared TypeScript types
│   ├── utils/          # Pure utility functions
│   ├── validators/     # Zod validators
│   ├── schemas/        # Zod schemas
│   ├── constants/      # Shared constants
│   ├── eslint-config/  # Shared ESLint config
│   └── typescript-config/ # Shared TS config
├── docker/             # Dockerfiles + compose files
├── scripts/            # CI/validation scripts
└── docs/               # Documentation
```

## Requisitos

- Node.js >= 20.17.0
- pnpm >= 9.0.0
- PostgreSQL 16
- Redis 7

## Instalación

```bash
git clone <repo>
cd tienda
pnpm install
pnpm --filter @tienda/database db:generate
pnpm build
```

## Scripts

| Script | Descripción |
|--------|------------|
| `pnpm dev` | Desarrollo (turborepo) |
| `pnpm build` | Build producción (turborepo) |
| `pnpm lint` | ESLint (turborepo) |
| `pnpm typecheck` | TypeScript strict check |
| `pnpm test` | Tests (turborepo) |
| `pnpm format` | Prettier formateo |
| `pnpm format:check` | Verificar formato |
| `pnpm clean` | Limpiar builds y node_modules |

## Estructura del Backend

```
apps/backend/src/
├── main.ts                 # Bootstrap
├── app.module.ts           # Root module
├── config/                 # NestJS config (8 factories)
├── core/                   # Global infrastructure (10 modules)
│   ├── logger/             # Pino logger
│   ├── database/           # Prisma service
│   ├── cache/              # Redis cache
│   ├── events/             # Event bus
│   ├── queue/              # BullMQ queues
│   ├── storage/            # File storage
│   ├── mail/               # Email
│   ├── http/               # HTTP client
│   ├── api/                # REST API infrastructure
│   └── security/           # Security (helmet, CORS, rate-limit)
├── common/                 # Shared resources
├── domain/                 # DDD domain layer
├── application/            # Application layer (CQRS)
├── infrastructure/         # Concrete implementations
├── modules/                # Business modules (bounded contexts)
└── health/                 # Health check endpoint
```

## Enlaces

- [Arquitectura](./ARCHITECTURE.md)
- [Contribuir](./CONTRIBUTING.md)
- [Código de Conducta](./CODE_OF_CONDUCT.md)
- [Changelog](./CHANGELOG.md)
- [Roadmap](./ROADMAP.md)
- [Developer Guide](./docs/guides/DEVELOPER.md)
- [Onboarding](./docs/guides/ONBOARDING.md)
- [ADR](./docs/adr/)
- [DevOps](./docs/devops/README.md)

## Licencia

MIT
