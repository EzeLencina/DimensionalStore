# Database — PostgreSQL + Prisma

## Stack

- **Database**: PostgreSQL 16
- **ORM**: Prisma 5+
- **Client**: `@tienda/database` package
- **Pool**: Configurable via `DATABASE_POOL_MAX`

## Schema

El schema Prisma está en `packages/database/prisma/schema.prisma`.

### Entidades Principales

| Entidad | Bounded Context | Propósito |
|---------|---------------|-----------|
| Tenant | Identity | Multi-tenant |
| User | Identity | Usuarios del sistema |
| Role | Identity | Roles RBAC |
| Product | Catalog | Productos |
| ProductVariant | Catalog | Variantes (talle, color) |
| Category | Catalog | Categorías jerárquicas |
| Brand | Catalog | Marcas |
| Stock | Inventory | Stock por almacén |
| Warehouse | Inventory | Almacenes |
| Order | Sales | Órdenes de venta |
| Customer | Customers | Clientes |
| Supplier | Suppliers | Proveedores |
| Transaction | Finance | Transacciones |
| AuditLog | Audit | Auditoría |

### Convenciones

- IDs: `String` con CUID
- Timestamps: `createdAt`, `updatedAt`, `deletedAt` (soft delete)
- Multi-tenant: `tenantId` en tablas principales
- Enums: nativos de PostgreSQL
- Naming: snake_case en DB, camelCase en Prisma

### Índices

- Compuestos `(tenantId, ...)` para queries multi-tenant
- GIN trigram para búsqueda parcial
- GIN full-text para búsqueda texto español
- B-tree para ordenamiento y joins

### Estrategia Multi-tenant

- Shared database con `tenantId` en tablas multi-tenant
- Row-Level Security (RLS) para aislamiento
- Tablas sin tenant: roles, permissions, config global

### Migraciones

```bash
# Crear migración
pnpm --filter @tienda/database db:migrate --name <desc>

# Aplicar
pnpm --filter @tienda/database db:deploy

# Visualizar
pnpm --filter @tienda/database db:studio
```

### Soft Delete

- Tablas con soft delete tienen `deletedAt` nullable
- Queries excluyen `deletedAt IS NOT NULL` por defecto
- Prisma middleware para filtrar automáticamente
- Algunas entidades usan delete físico (audit_logs, temp files)
