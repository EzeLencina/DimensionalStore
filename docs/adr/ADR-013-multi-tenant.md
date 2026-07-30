# ADR-013: Shared DB + RLS Multi-tenant

## Contexto

La plataforma debe soportar múltiples tenants (empresas) desde el día 1.

## Problema

Elegir una estrategia multi-tenant que balancee simplicidad, aislamiento, y escalabilidad.

## Alternativas

| Alternativa | Pros | Contras |
|-------------|------|---------|
| **Shared DB + tenant_id + RLS** | Simple, un schema, RLS nativo | Menor aislamiento, tenant no puede migrar a DB propia fácilmente |
| **Database per tenant** | Aislamiento total, backup individual | Complejidad operativa, migraciones cross-tenant |
| **Schema per tenant** | Aislamiento medio, un schema por tenant | Migraciones complejas, límite de schemas PostgreSQL |
| **Hybrid (shared default, dedicated premium)** | Flexible, modelo de negocio SaaS | Complejidad arquitectónica |

## Decisión

Shared database con `tenant_id` en todas las tablas principales + RLS.

## Consecuencias

- `tenant_id` como columna UUID en todas las tablas multi-tenant
- RLS policies para aislamiento automático
- Tenant resuelto via `x-tenant-slug` header o subdominio
- Índices compuestos con `(tenant_id, ...)` para performance
- Migraciones futuras a dedicated database para tenants premium
- Tablas sin tenant_id: roles, permissions, config global
- Pool de conexiones por tenant (futuro)
