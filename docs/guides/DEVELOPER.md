# Developer Guide

## Levantar el Proyecto

```bash
# Requisitos: Node.js 20+, pnpm 9+, PostgreSQL 16+, Redis 7+

# 1. Clonar
git clone <repo>
cd tienda

# 2. Instalar dependencias
pnpm install

# 3. Copiar env files
cp apps/backend/.env.example apps/backend/.env
cp apps/frontend/.env.example apps/frontend/.env

# 4. Generar Prisma client
pnpm --filter @tienda/database db:generate

# 5. Build
pnpm build

# 6. Desarrollo
pnpm dev
```

## Crear Módulos

```bash
# Nuevo módulo de negocio (backend)
mkdir -p apps/backend/src/modules/<name>/{domain,application,infrastructure,presentation}

# Nuevo feature (frontend)
mkdir -p apps/frontend/src/features/<name>/{components,hooks,services,types}
```

Cada módulo backend debe incluir:
- `<name>.module.ts` — NestJS Module
- `domain/` — Entities, Value Objects, Repository interfaces
- `application/` — Commands, Queries, Handlers
- `infrastructure/` — Prisma repositories
- `presentation/` — Controllers, DTOs

Ejemplo módulo:

```typescript
@Module({
  imports: [CoreModule],
  controllers: [ProductController],
  providers: [
    ProductService,
    { provide: IProductRepository, useClass: PrismaProductRepository },
  ],
})
export class ProductModule {}
```

## Ejecutar Tests

```bash
# Todos los tests
pnpm test

# Backend (Jest)
pnpm --filter @tienda/backend test

# Frontend (Vitest)
pnpm --filter @tienda/frontend test

# Coverage
pnpm --filter @tienda/backend test -- --coverage
pnpm --filter @tienda/frontend test -- --coverage
```

## TypeScript y Lint

```bash
# Type check
pnpm typecheck

# ESLint
pnpm lint

# Prettier
pnpm format          # formatear
pnpm format:check    # verificar
```

## Agregar Paquetes

```bash
# Dependencia interna
pnpm --filter @tienda/backend add @tienda/new-package@workspace:*

# Dependencia externa
pnpm --filter @tienda/backend add lodash

# Dev dependency
pnpm --filter @tienda/backend add -D @types/lodash
```

## Variables de Entorno

1. Agregar a `packages/config/src/validation/env.zod.ts`
2. Agregar factory en `packages/config/src/`
3. Exportar desde `packages/config/src/index.ts`
4. Consumir via `ConfigModule.forRoot()` en app.module.ts

## Migraciones Prisma

```bash
# Crear migración
pnpm --filter @tienda/database db:migrate --name <descripcion>

# Aplicar
pnpm --filter @tienda/database db:push

# Reset (pérdida de datos)
pnpm --filter @tienda/database db:reset

# Studio (GUI)
pnpm --filter @tienda/database db:studio
```

## Buenas Prácticas

1. **Server Components** en frontend por defecto
2. **Controllers** delgados — toda lógica en services/handlers
3. **Repository Pattern** — domain define interfaces
4. **Eventos** para comunicación cross-module
5. **Zod** para validación de entrada
6. **Value Objects** inmutables
7. **No secretos** en código — env vars con Zod
8. **Commits semánticos** — Conventional Commits
9. **Tests antes de PR** — coverage 90%
10. **ADR** para decisiones arquitectónicas
