# Roadmap

## Fase 0 — Foundation (Completada)

- [x] Monorepo con Turborepo + pnpm
- [x] NestJS backend scaffolding
- [x] Next.js frontend con App Router
- [x] PostgreSQL + Prisma ORM
- [x] 14 packages compartidos
- [x] Docker multi-stage builds
- [x] Documentación de producto y arquitectura

## Fase 1 — Core Infrastructure (Completada)

- [x] 10 core modules (Logger, Database, Cache, Events, Queue, Storage, Mail, Http, Api, Security)
- [x] HTTP client con Undici + policies (retry, circuit-breaker, timeout)
- [x] Mail multi-driver (SMTP, Log, SES, SendGrid, Mailgun, Resend)
- [x] Queue BullMQ + Workers + Jobs abstractos
- [x] Storage multi-driver (Local, Memory, S3)
- [x] Security (Helmet, CORS, Rate-Limit, CSRF, Compression)
- [x] Cache Redis con conexión dedicada
- [x] API Module (versioning, pagination, filtering, sorting, search, swagger)
- [x] TypeScript strict: 0 errores

## Fase 2 — Testing & CI/CD (Completada)

- [x] @tienda/testing package (factories, mocks, fixtures, assertions)
- [x] Jest config backend con 90% coverage
- [x] Vitest config frontend con 90% coverage
- [x] E2E testing con Supertest
- [x] 5 GitHub Actions workflows
- [x] 6 reusable actions
- [x] Security scanning (audit, secret scan, dependency review)
- [x] Docker validation
- [x] Quality gates scripts

## Fase 3 — Documentation (Completada)

- [x] README, ARCHITECTURE, CONTRIBUTING, CODE_OF_CONDUCT
- [x] CHANGELOG, ROADMAP
- [x] Architecture Decision Records (ADRs)
- [x] Developer Guide, Onboarding
- [x] Coding Standards
- [x] AI Documentation
- [x] Runbooks
- [x] Mermaid diagrams
- [x] Technical audit

## Fase 4 — Autenticación y Autorización (Siguiente)

- [ ] JWT + Refresh Tokens
- [ ] OAuth2 / OpenID Connect
- [ ] RBAC con roles y permisos
- [ ] API Keys para integraciones
- [ ] Módulo Auth (login, register, password reset)
- [ ] Guards globales (JWT, Roles, Permissions)
- [ ] Rate limiting por usuario/API key
- [ ] Tests de seguridad

## Fase 5 — Módulos Core de Negocio

- [ ] Catálogo (Productos, Variantes, Categorías, Marcas)
- [ ] Inventario (Stock, Almacenes, Movimientos)
- [ ] Ventas (Órdenes, Carrito, Checkout)
- [ ] Clientes (CRM, Segmentación)
- [ ] CRM (Notas, Historial)
- [ ] Gestión de usuarios y sucursales

## Fase 6 — ERP Completo

- [ ] Compras (Órdenes de compra, Proveedores)
- [ ] Finanzas (Transacciones, Facturación)
- [ ] Caja (Apertura/cierre, Movimientos)
- [ ] Dashboard financiero
- [ ] Reportes y analytics

## Fase 7 — Multi-tenant & SaaS

- [ ] Panel de administración de tenants
- [ ] Facturación y suscripciones
- [ ] Onboarding automatizado
- [ ] Métricas de uso
- [ ] Temas white-label

## Fase 8 — Scaling

- [ ] Read replicas PostgreSQL
- [ ] CDN + Edge caching
- [ ] Meilisearch para búsqueda全文
- [ ] API Pública con rate limiting
- [ ] Webhooks
- [ ] Documentación API pública
