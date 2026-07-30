# Checklists

## Nuevo Módulo Backend

- [ ] Crear `apps/backend/src/modules/<name>/`
- [ ] Crear `<name>.module.ts` con `@Module` decorator
- [ ] Estructura: `domain/`, `application/`, `infrastructure/`, `presentation/`
- [ ] `domain/`: Entities, Value Objects, Repository interfaces
- [ ] `application/`: Commands, Queries, Handlers
- [ ] `infrastructure/`: Prisma repositories
- [ ] `presentation/`: Controllers, DTOs
- [ ] Barrel export (`index.ts`)
- [ ] Importar en AppModule (si global) o lazy load
- [ ] Tests: unit + integration
- [ ] README.md

## Nuevo Package

- [ ] Crear `packages/<name>/`
- [ ] `package.json` con `@tienda/<name>` name
- [ ] `tsconfig.json` extendiendo `@tienda/typescript-config`
- [ ] `src/index.ts` barrel export
- [ ] TypeScript strict
- [ ] README.md
- [ ] Agregar en `pnpm-workspace.yaml`

## Nueva Integración

- [ ] Evaluar si es core o módulo de negocio
- [ ] Si es core: agregar en `@core/<name>/`
- [ ] Si es módulo: agregar en `modules/<name>/`
- [ ] Driver pattern (interfaz + implementaciones)
- [ ] Factory para seleccionar driver via env var
- [ ] Health check
- [ ] Excepciones específicas (extienden `AppException`)
- [ ] Config via `packages/config`
- [ ] Tests (unit + integration)
- [ ] README con drivers, flujo, config, riesgos

## Nueva API

- [ ] Controller con `@Controller({ path: 'resource', version: '1' })`
- [ ] Swagger decorators: `@ApiTags`, `@ApiOperation`
- [ ] API decorators: `@ApiPagination`, `@ApiSorting`, `@ApiFiltering`, `@ApiSearch`
- [ ] Response decorators: `@ApiStandardResponse`, `@ApiPaginatedResponse`
- [ ] Pipes: `PaginationPipe`, `SortingPipe`, `FilteringPipe`, `SearchPipe`
- [ ] Zod validation schema
- [ ] Service/Handler con lógica
- [ ] ResponseBuilder para respuesta estandarizada
- [ ] Tests E2E con Supertest

## Nuevo Proveedor (Driver)

- [ ] Implementar interfaz del módulo core
- [ ] Registrar en Factory del módulo
- [ ] Agregar env var para seleccionar driver
- [ ] Configurar en `packages/config`
- [ ] Health check
- [ ] Excepciones específicas
- [ ] Tests

## Nueva Migración

- [ ] `pnpm --filter @tienda/database db:migrate --name <desc>`
- [ ] Revisar SQL generado
- [ ] Verificar índices (composite, tenant_id)
- [ ] Verificar soft delete si aplica
- [ ] Verificar RLS policies
- [ ] `pnpm --filter @tienda/database db:deploy`
- [ ] Rollback plan

## Nuevo Test

- [ ] Unit: `*.spec.ts` junto al código
- [ ] Integration: `test/integration/*.spec.ts`
- [ ] E2E: `test/e2e/*.spec.ts`
- [ ] Usar `@tienda/testing` (factories, mocks, assertions)
- [ ] Coverage >= 90%
- [ ] No depender de servicios externos reales

## Nuevo Workflow CI/CD

- [ ] Crear `.github/workflows/<name>.yml`
- [ ] Usar acciones reutilizables de `.github/actions/`
- [ ] Concurrency group + cancel-in-progress
- [ ] Timeout configurado
- [ ] Caché pnpm + Turbo
- [ ] Secretos via `secrets.GITHUB_TOKEN` o env
