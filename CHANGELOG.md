# Changelog

## [0.0.0] — 2026-07-29

### Fase 3 — Documentación y Cierre

- Documentación completa del proyecto (README, ARCHITECTURE, CONTRIBUTING, ROADMAP)
- Architecture Decision Records (ADR) en docs/adr/
- Developer Guide y Onboarding Guide
- Coding Standards documentados
- Diagramas Mermaid de arquitectura
- Documentación para AI (OpenCode prompts, reglas)
- Runbooks para escenarios de fallo
- Auditoría técnica final
- docs/ backend, frontend, database, security, testing

### Fase 2B — Testing Infrastructure

- @tienda/testing package con factories, mocks, fixtures, assertions, generators
- Configuración Jest backend con 90% coverage
- Configuración Vitest frontend con 90% coverage
- Supertest para E2E backend
- HttpMockServer, LoggerMock, ClockMock, ConfigMock, QueueMock, UuidMock
- BaseFactory, DataGenerator, ContractValidator, TestEnvironment

### Fase 2A — API Module + CI/CD

- API Module (71 files): response builder, versioning, pagination, filtering, sorting, search, field-selection
- 8 decoradores, 4 interceptors, 5 pipes, 3 serializadores
- Swagger/OpenAPI 3.1 setup
- 5 workflows GitHub Actions: CI, PR Check, Security Scan, Docker Validate, Release
- 6 reusable actions: setup, cache, quality, test, install, build
- 4 validation scripts: circular deps, unused exports, unused deps, arch rules

### Fase 2 — Core Infrastructure

- HTTP Module (43 files): UndiciDriver, policies, middleware, interceptors
- Mail Module: SMTP/Log/SES/SendGrid/Mailgun/Resend drivers
- Queue Module: BullMQ adapters, workers, jobs, retry strategies
- Storage Module: Local/Memory/S3 drivers, path builder
- Security Module: Helmet, CORS, Rate-Limit, CSRF, compression
- Cache Module: Redis ioredis con conexión dedicada
- Todos los módulos @Global() registrados en CoreModule
- TypeScript strict: 0 errores de compilación

### Fase 1 — Base Architecture

- Monorepo Turborepo + pnpm workspace
- NestJS backend con Clean Architecture + DDD
- Next.js 15 frontend con App Router + shadcn/ui
- PostgreSQL + Prisma ORM configurado
- Redis + BullMQ scaffolding
- 14 packages compartidos
- Arquitectura multi-tenant preparada
- Documentación arquitectónica (7 docs)
- Modelado de dominio (7 docs)
