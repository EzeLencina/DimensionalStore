# AI Documentation for OpenCode

Este directorio contiene el contexto necesario para que agentes de IA (como OpenCode) trabajen eficientemente en el proyecto Tienda.

## Contexto del Proyecto

Tienda es una plataforma empresarial integrada (ERP + Ecommerce + CRM) construida como monorepo con Turborepo + pnpm.

- **Backend**: NestJS 10 con Clean Architecture + DDD
- **Frontend**: Next.js 15 con App Router
- **Database**: PostgreSQL 16 + Prisma ORM
- **Cache/Queue**: Redis 7 + BullMQ
- **Storage**: Local / S3-compatible (Cloudflare R2)
- **Testing**: Jest (backend) + Vitest (frontend)
- **CI/CD**: GitHub Actions

## Reglas de Desarrollo

1. **No importar módulos de negocio entre sí** — usar EventBus
2. **Domain no conoce Infrastructure** — depende solo de interfaces
3. **Controllers sin lógica** — solo delegan a handlers
4. **Zod para validación** de toda entrada externa
5. **Value Objects inmutables** y auto-validantes
6. **Server Components por defecto** en frontend
7. **No secretos en código** — env vars con Zod validation
8. **ADR para decisiones arquitectónicas** en `docs/adr/`
9. **Commits semánticos** — Conventional Commits
10. **Cobertura mínima 90%** en tests

## Arquitectura

### Capas Clean Architecture por Módulo

```
Presentation (Controller, DTOs)
    ↓ depende de
Application (Commands, Queries, Handlers)
    ↓ depende de (interfaces)
Domain (Entities, Value Objects, Repository Interfaces)
    ↓ implementa
Infrastructure (Prisma Repositories, Cache, HTTP clients)
```

### Core Modules (todos @Global())

| Módulo | Path | Propósito |
|--------|------|-----------|
| Logger | `@core/logger` | Pino logging |
| Database | `@core/database` | Prisma service |
| Cache | `@core/cache` | Redis cache |
| EventBus | `@core/events` | Domain events |
| Queue | `@core/queue` | BullMQ queues |
| Storage | `@core/storage` | File storage |
| Mail | `@core/mail` | Email sending |
| Http | `@core/http` | HTTP client |
| Api | `@core/api` | REST infrastructure |
| Security | `@core/security` | Helmet, CORS, Rate-Limit |

### Path Aliases Backend

| Alias | Path |
|-------|------|
| `@core/*` | `apps/backend/src/core/*` |
| `@common/*` | `apps/backend/src/common/*` |
| `@modules/*` | `apps/backend/src/modules/*` |
| `@domain/*` | `apps/backend/src/domain/*` |
| `@application/*` | `apps/backend/src/application/*` |
| `@infrastructure/*` | `apps/backend/src/infrastructure/*` |
| `@config/*` | `apps/backend/src/config/*` |
| `@shared/*` | `apps/backend/src/shared/*` |

## Cómo Agregar Funcionalidades

### Nuevo Módulo Backend

1. Crear `apps/backend/src/modules/<name>/`
2. Crear `<name>.module.ts` con decorador `@Module`
3. Definir estructura: `domain/`, `application/`, `infrastructure/`, `presentation/`
4. Agregar controllers, providers y exports
5. Importar en AppModule si es global
6. Módulos de negocio se comunican via EventBus (no imports directos)

### Nuevo Endpoint

1. Controller con `@Controller({ path: 'resource', version: '1' })`
2. Usar decoradores `@ApiPagination()`, `@ApiSorting()`, etc.
3. Validar entrada con Zod + pipes
4. Delegar a handler/service
5. Usar `ResponseBuilder` para respuestas estandarizadas

### Nuevo Package

1. Crear `packages/<name>/`
2. `package.json` con `"name": "@tienda/<name>"`
3. `tsconfig.json` extendiendo `@tienda/typescript-config`
4. `src/index.ts` como barrel export
5. Agregar en `pnpm-workspace.yaml`

## Cómo Evitar Romper la Arquitectura

1. **No permitir que Domain importe Infrastructure**
2. **No usar repositorio directo desde Controller** — pasar por Application layer
3. **No compartir tipos de Prisma directamente al Domain** — mapear
4. **No importar módulos de negocio entre sí** — usar EventBus
5. **No poner lógica en controladores** — máximo validación + delegación
6. **No usar `any`** — TypeScript strict
7. **No exponer IDs internos** — usar SKU o UUIDs públicos
8. **No mutar Value Objects** — son inmutables

## Prompts Recomendados para OpenCode

### Auditoría de Código
```
"Analiza el módulo X buscando violaciones de Clean Architecture. Verifica que Domain no importe Infrastructure, que los controllers sean delgados, y que las dependencias sean unidireccionales."
```

### Nuevo Módulo
```
"Crea un nuevo módulo de negocio 'X' siguiendo la estructura existente en apps/backend/src/modules/. Incluye domain (entities, value objects, repository interface), application (commands, handlers), infrastructure (prisma repository), y presentation (controller, dto). Usa los path aliases @domain, @application, @infrastructure. Comunica eventos via EventBus."
```

### Nuevo Endpoint
```
"Agrega un endpoint GET /api/v1/resources con paginación, filtrado, sorting y búsqueda. Usa @core/api decorators y pipes. Responde con ResponseBuilder."
```

### Refactor
```
"Refactoriza el servicio X para usar Repository Pattern. Domain define interface, Infrastructure implementa con Prisma."
```

### Tests
```
"Escribe tests unitarios para el servicio X usando @tienda/testing mocks. Escribe tests de integración con NestJS TestingModule."
```

## Buenas Prácticas para Agentes IA

1. Siempre leer los ADRs relevantes antes de tomar decisiones arquitectónicas
2. Revisar módulos existentes como referencia (mirar estructura, no copiar lógica de negocio)
3. Verificar `docs/standards/CODING.md` para convenciones
4. Usar `pnpm typecheck` después de cambios significativos
5. No modificar lógica de negocio existente sin entender el contexto completo
6. Documentar decisiones significativas como ADRs
