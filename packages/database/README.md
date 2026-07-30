# Database — @tienda/database

Paquete de persistencia con Prisma ORM + PostgreSQL. Contiene la configuración de Prisma, el schema centralizado, migraciones, seeds, factories, y scripts.

---

## Árbol completo

```
packages/database/
├── package.json
├── tsconfig.json
├── .env.example
├── .env
│
├── prisma/
│   ├── schema.prisma           # Datasource + Generator + Placeholder model
│   ├── migrations/             # Migraciones generadas por Prisma (futuro)
│   ├── seed/
│   │   ├── seed.ts             # Seed entrypoint
│   │   └── .gitkeep
│   ├── factories/
│   │   └── index.ts            # Factory definitions (futuro)
│   ├── fixtures/
│   │   └── index.ts            # Test fixtures (futuro)
│   └── scripts/
│       ├── seed-all.ts         # Orchestrador de seeds
│       └── reset-db.ts         # Reset de base de datos
│
└── src/
    └── index.ts                # Re-exporta PrismaClient
```

## apps/backend/src/database/

```
apps/backend/src/database/
├── index.ts                    # Barrel export
├── prisma.module.ts            # @Global() module
├── prisma.service.ts           # PrismaService extends PrismaClient
├── prisma.provider.ts          # Factory provider para DI
├── database.constants.ts       # Tokens, defaults
├── database.config.ts          # NestJS Config registro
├── database.health.ts          # DatabaseHealthIndicator
│
└── repository/
    ├── index.ts                # Barrel export
    ├── read.repository.ts      # ReadRepository<T, TId> abstracto
    ├── write.repository.ts     # WriteRepository<T, TId> abstracto
    ├── crud.repository.ts      # CrudRepository<T, TId> (Read + Write)
    └── specification.repository.ts  # SpecificationRepository<T>
```

---

## Explicación de archivos

| Archivo | Propósito |
|---------|-----------|
| `prisma/schema.prisma` | Datasource PostgreSQL + Generator Prisma Client + Placeholder model |
| `prisma/seed/seed.ts` | Seed principal (vacío, listo para implementar) |
| `prisma/factories/` | Factories para generar datos de prueba |
| `prisma/fixtures/` | Fixtures estáticos para tests |
| `prisma/scripts/` | Scripts de utilidad (reset, seed-all) |
| `src/index.ts` | Re-export de PrismaClient público |
| `prisma.module.ts` | Módulo NestJS global que provee PrismaService |
| `prisma.service.ts` | Extiende PrismaClient + logging + lifecycle hooks |
| `prisma.provider.ts` | Provider alternativo (raw PrismaClient vía DATABASE_CONNECTION) |
| `database.constants.ts` | Tokens de DI y valores por defecto |
| `database.config.ts` | Configuración NestJS: pool, SSL, timeouts, retries |
| `database.health.ts` | Health check: ping, latency, connection status |
| `repository/*` | Interfaces base para implementar repositorios |

---

## Flujo de conexión

```
AppModule
  └── ConfigModule (database.config)
  └── CoreModule
        └── DatabaseModule
              └── PrismaModule (Global)
                    └── PrismaService
                          ├── Constructor: configura logging
                          ├── onModuleInit: $connect + query listener
                          ├── onModuleDestroy: $disconnect
                          └── Expuesto como provider global
```

### Conexión sin servidor

```
DATABASE_URL      → postgresql://user:pass@host:5432/tienda
DATABASE_URL_DIRECT → bypassea PgBouncer
SHADOW_DATABASE_URL  → base dedicada para migrations
```

---

## Ciclo de vida de Prisma

```
NestJS startup
  └── PrismaService.constructor()
        └── new PrismaClient({ log: [...] })
  └── PrismaService.onModuleInit()
        └── await this.$connect()
        └── this.$on('query', handler)  ← logging
        └── Logger.log('Connected')

Runtime
  └── Cada request usa PrismaService inyectado
  └── Query events aparecen en debug log

Graceful shutdown
  └── PrismaService.onModuleDestroy()
        └── await this.$disconnect()
        └── Logger.log('Disconnected')
```

---

## Estrategia de migraciones

| Entorno | Comando | Base |
|---------|---------|------|
| Desarrollo | `db:migrate` | `prisma migrate dev` |
| Desarrollo (solo SQL) | `db:migrate:create` | `prisma migrate dev --create-only` |
| Testing | `db:push` | `prisma db push` (sin archivos) |
| Producción | `db:migrate:deploy` | `prisma migrate deploy` |
| Reset | `db:migrate:reset` | `prisma migrate reset` |

**Rollback**: Prisma no tiene rollback nativo. Se revierte aplicando la migración anterior:
```bash
prisma migrate resolve --rolled-back <migration_name>
prisma migrate dev
```

---

## Estrategia de Seeds

1. `prisma/seed/seed.ts` — Entrypoint ejecutado por `db:seed`
2. Por feature, crear archivos separados en `prisma/seed/` (ej. `seed-users.ts`)
3. El entrypoint importa y ejecuta cada seed en orden
4. Seeds son idempotentes (upsert + verificación previa)
5. `prisma/scripts/seed-all.ts` orquesta seeds para CI/testing

---

## Estrategia de Repositories

```
ReadRepository<T, TId>          ← findById, findAll, findPaginated, count, exists
  └── CrudRepository<T, TId>    ← + create, update, delete

WriteRepository<T, TId>         ← create, update, delete (si solo escritura)

SpecificationRepository<T>      ← findBySpecification (filtros dinámicos)
```

Los repositorios concretos extienden `CrudRepository` e implementan la propiedad `model` apuntando al delegate de Prisma correspondiente:

```ts
@Injectable()
export class ProductRepository extends CrudRepository<Product, string> {
  constructor(prisma: PrismaService) {
    super();
    this.prisma = prisma;
  }
  protected get model() {
    return this.prisma.product;
  }
  async create(data: Partial<Product>): Promise<Product> {
    return this.model.create({ data });
  }
}
```

---

## Estrategia de Unit of Work

Prisma soporta transacciones anidadas vía `$transaction`:

```ts
await this.prisma.$transaction(async (tx) => {
  await tx.inventory.update(...);
  await tx.sale.create(...);
});
```

Para operaciones que cruzan múltiples repositorios, se pasa el `PrismaService` o `PrismaTransactionClient` como unidad de trabajo.

---

## Recomendaciones de rendimiento

1. **Connection Pool**: Configurar `DATABASE_POOL_MIN=2`, `DATABASE_POOL_MAX=10`. Prisma maneja el pool internamente.
2. **Batch Queries**: Usar `createMany`, `updateMany` en lugar de loops.
3. **Pagination**: Usar cursor-based para listas grandes (`cursor`/`take`/`skip`).
4. **Eager Loading**: Usar `include` con criterio, evitar N+1.
5. **Select**: Siempre proyectar campos con `select`, nunca hacer `select *`.
6. **Índices**: Modelar índices compuestos para queries frecuentes.
7. **Logging**: Solo `warn` y `error` en producción. `query` solo en desarrollo.
8. **Batch**: Para inserts masivos, usar `$transaction` con arrays de promises.

---

## Riesgos detectados

| Riesgo | Impacto | Mitigación |
|--------|---------|------------|
| Shadow Database no configurada | Migraciones fallan en CI | Usar `SHADOW_DATABASE_URL` con base efímera |
| Pool agotado | Timeouts en alta concurrencia | Ajustar `POOL_MAX` según carga esperada |
| SSL no configurado en producción | Conexión insegura | Forzar `DATABASE_SSL=true` en producción |
| Prisma Client desactualizado | Breaking changes | Versionar `@prisma/client` con el schema |
| Migraciones lentas en tablas grandes | Downtime largo | Usar `prisma migrate deploy` sin `--create-only` |

---

## Comandos

```bash
# Schema
pnpm db:validate       # Validar schema
pnpm db:format         # Formatear schema
pnpm db:generate       # Generar Prisma Client

# Migraciones
pnpm db:migrate        # Migración desarrollo
pnpm db:migrate:deploy # Migración producción
pnpm db:migrate:status # Estado de migraciones
pnpm db:push           # Push sin migración

# Datos
pnpm db:seed           # Ejecutar seed
pnpm db:studio         # Prisma Studio

# Utilidad
pnpm db:reset          # Reset completo
```
