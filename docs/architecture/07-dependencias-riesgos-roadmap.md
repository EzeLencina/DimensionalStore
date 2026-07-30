# DEPENDENCIAS, RIESGOS, ROADMAP TÉCNICO Y JUSTIFICACIONES

---

## 1. Dependencias entre Módulos (Diagrama de Acoplamiento)

```
                    ┌──────────┐
                    │   Auth   │
                    └────┬─────┘
                         │ (protege todos los módulos)
                         ▼
┌──────────────────────────────────────────────────────────────────────┐
│                          API GATEWAY                                  │
│  Rate Limiting · Versioning · Tenant Resolution · Request Validation  │
└────┬─────────┬─────────┬─────────┬─────────┬─────────┬─────────┬─────┘
     │         │         │         │         │         │         │
     ▼         ▼         ▼         ▼         ▼         ▼         ▼
┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐
│Catalog │ │Invent. │ │ Orders │ │  CRM   │ │ Finan. │ │Purch.  │ │Config  │
└───┬────┘ └──┬─────┘ └───┬────┘ └───┬────┘ └───┬────┘ └───┬────┘ └───┬────┘
    │         │           │          │          │          │          │
    │         │     ┌─────┘          │    ┌─────┘          │          │
    │         │     │                │    │                │          │
    ▼         ▼     ▼                ▼    ▼                ▼          ▼
┌──────────────────────────────────────────────────────────────────────────┐
│                           SHARED KERNEL                                   │
│  Value Objects (SKU, Price, Money) · Base Entity · Domain Events · Utils  │
└──────────────────────────────────────────────────────────────────────────┘
```

### Matriz de Dependencias

| Módulo | Depende de (Interfaces) | Consume Eventos de | Produce Eventos para |
|--------|------------------------|-------------------|-------------------|
| **Catalog** | Shared Kernel, Auth | — | Inventory (stock), CRM (activity) |
| **Inventory** | Shared Kernel, Catalog (SKU) | Catalog, Orders, Purchases | Notifications (alerts) |
| **Orders** | Shared Kernel, Catalog (SKU), Inventory | — | Inventory (reserve), Finances (payment), CRM (activity), Notifications |
| **CRM** | Shared Kernel | Orders, Auth | Marketing (segments) |
| **Finances** | Shared Kernel | Orders, Purchases | Reports |
| **Purchases** | Shared Kernel, Catalog (SKU), Inventory | — | Inventory (stock), Finances (expense) |
| **CMS** | Shared Kernel | — | — |
| **Marketing** | Shared Kernel | Catalog, Orders, CRM | Orders (discounts) |
| **Configuration** | Shared Kernel | — | Todos (lectura) |
| **Analytics** | Shared Kernel | Todos (lectura) | — |
| **Integrations** | Shared Kernel | Todos (webhooks) | — |

### Regla crítica

**Orders** es el módulo de mayor acoplamiento. Depende de interfaces de Catalog (para validar SKU y precio), Inventory (para stock) y Finances (para transacciones). Esto es correcto: una orden es el agregado central que coordina múltiples dominios. La clave es que depende de **interfaces**, no de implementaciones.

---

## 2. Riesgos Detectados y Mitigaciones

| # | Riesgo | Impacto | Probabilidad | Mitigación |
|---|--------|---------|-------------|-----------|
| R1 | **Complejidad de Clean Architecture ralentiza entregas iniciales** | Medio | Alta (primeras semanas) | Permitir simplificaciones temporales si se documenta la deuda técnica. Priorizar vertical slices funcionales sobre pureza arquitectónica en MVP. |
| R2 | **Acoplamiento del módulo Orders con múltiples servicios** | Alto | Media | Usar Sagas (eventos coreografiados) en vez de orquestación central. Si Inventory falla, Orders no se cae; queda en estado de compensación. |
| R3 | **Multi-tenancy vía shared DB + RLS puede tener cuellos de botella** | Alto | Baja (a largo plazo) | Monitorear queries lentas. Planificar migración a DB por tenant cuando un tenant supere 50GB. Particionamiento por tenant como paso intermedio. |
| R4 | **Prisma ORM overhead en consultas complejas (reportes)** | Medio | Alta | Vistas materializadas para reportes. Raw SQL en queries de analytics (Prisma $queryRaw). Caché Redis agresiva. |
| R5 | **BullMQ con Redis como single point of failure** | Medio | Baja | Redis Sentinel o cluster. Jobs críticos con persistencia (no solo en memoria). DLQ para jobs fallidos. |
| R6 | **JWT sin revocation list** | Medio | Media | Refresh tokens en Redis permiten invalidación. Access tokens con TTL corto (15 min). Para casos críticos: blacklist en Redis. |
| R7 | **SKU como string en todas las tablas (desnormalización)** | Bajo | Media | Consistencia eventual es aceptable. Si se renombra un SKU, migración batch con jobs. El SKU es inmutable post-venta. |
| R8 | **Curva de aprendizaje del equipo (DDD, Clean Architecture, CQRS)** | Medio | Alta | Documentación viva. Pair programming inicial. Code reviews enfocados en arquitectura. No exigir pureza desde el día 1. |

---

## 3. Roadmap Técnico (Fases de Implementación)

### FASE 0 — FUNDACIÓN (Semanas 1-3)

```
Objetivo: Infraestructura base, shared kernel, un módulo funcional completo.

[x] Monorepo setup (pnpm, Turborepo, TypeScript strict)
[x] Docker Compose dev (PostgreSQL, Redis)
[x] Package shared (tipos, constantes, interfaces)
[x] Package database (Prisma schema base + migrations)
[x] NestJS scaffolding (core, common, config)
[x] Auth Module completo (register, login, JWT, refresh token, guards)
[x] Tenant middleware + resolución
[x] Catalog Module MVP (CRUD productos con SKU)
[x] GitHub Actions CI (lint, typecheck, test)
```

### FASE 1 — NÚCLEO DEL NEGOCIO (Semanas 4-8)

```
Objetivo: Ecommerce funcional + ERP básico.

[x] Orders Module (carrito, checkout, órdenes, state machine)
[x] Inventory Module (stock, movimientos, reservas)
[x] CRM Module (clientes, direcciones)
[x] Finances Module (caja, transacciones básicas)
[x] Configuration Module (impuestos, métodos de pago, settings)
[x] Frontend: Route groups (shop, dashboard, auth)
[x] Frontend: Shop layout + páginas públicas (home, producto, categoría)
[x] Frontend: Dashboard layout + sidebar
[x] Frontend: Auth pages + provider
[x] Frontend: Catalog pages (listado, detalle, formulario)
[x] BullMQ queues (notifications, inventory, cache)
[x] Cache strategy (Redis, ISR, invalidación por eventos)
```

### FASE 2 — ERP COMPLETO (Semanas 9-14)

```
Objetivo: Compras, finanzas completas, reportes.

[x] Purchases Module (órdenes de compra, proveedores, recepción)
[x] Finances completo (ingresos/egresos, cierre de caja, facturación)
[x] CMS Module (páginas, secciones, SEO)
[x] Marketing Module (cupones, campañas, descuentos)
[x] Reports Module (vistas materializadas, reportes agregados)
[x] Frontend: Compras, finanzas, reportes
[x] Frontend: CMS editor (páginas, secciones)
[x] Permisos granulares (roles, permisos, guards)
[x] Audit logging completo
[x] Rate limiting por plan
```

### FASE 3 — MULTI-TENANT Y SAAS (Semanas 15-20)

```
Objetivo: Onboarding multi-tienda, planes de suscripción.

[x] Panel de administración de tenants
[x] Modelo de suscripción (Stripe recurrente)
[x] Onboarding automatizado (registro → DNS → SSL)
[x] Facturación de suscripciones
[x] Métricas y logs por tenant
[x] Temas/plugins aislados por tenant
[x] Documentación de API pública
[x] Portal para vendedores (multi-usuario dentro de cada tenant)
[ ] DB dedicada para tenants Enterprise
```

### FASE 4 — ESCALAMIENTO (Semanas 21-28)

```
Objetivo: Performance, disponibilidad, ecosistema.

[x] Read replicas de PostgreSQL
[x] CDN global (Cloudflare)
[x] Búsqueda full-text con Meilisearch
[x] API pública rateada (developer portal)
[x] Webhooks API
[x] Integraciones: Mercado Pago, Stripe, correo argentino, AFIP
[x] Monitoreo: Prometheus + Grafana + Sentry + OpenTelemetry
[ ] Particionamiento de tablas grandes
[ ] Dashboard en tiempo real (WebSockets)
[ ] Aplicación móvil (React Native) — futuro lejano
```

---

## 4. Justificación de Decisiones Técnicas

### ¿Por qué monorepo con Turborepo?

| Alternativa | Problema |
|-------------|----------|
| Multi-repo | Sincronización de tipos, versiones, dependencias. Cambios cross-package requieren PRs separados. |
| **Turborepo** | **Cache inteligente, paralelización, TypeScript project references. Un solo comando para build/test/lint. Dependencias compartidas.** |

### ¿Por qué NestJS y no Express/Fastify?

| Alternativa | Problema |
|-------------|----------|
| Express | Sin estructura opinada. Cada desarrollador organiza distinto. Mantenible a largo plazo? No. |
| Fastify | Rápido, pero ecosistema de plugins/generators menor. Poca adopción enterprise. |
| **NestJS** | **DI nativa, decorators, guards, interceptors, pipes. Modularización obligatoria. Estandarización del equipo. La estructura guía hacia Clean Architecture sin esfuerzo extra. Mejor para equipos de 2-10 personas.** |

### ¿Por qué Prisma y no Drizzle/TypeORM?

| Alternativa | Problema |
|-------------|----------|
| TypeORM | API verbosa, decorators engorrosos, tipos genéricos complejos. Migraciones problemáticas. |
| Drizzle | Nuevo, ecosistema menor, menos recursos de aprendizaje. |
| **Prisma** | **Mejor DX del mercado. Tipos generados automáticamente. Migraciones seguras. Schema declarativo. La ganancia en productividad del equipo compensa el overhead en queries simples.** |

### ¿Por qué CQRS separado (Commands/Queries) sin usar event sourcing?

CQRS separado a nivel de carpetas (no a nivel de base de datos). Cada módulo tiene:

- `application/commands/` — para mutaciones
- `application/queries/` — para lecturas

No implementamos event sourcing porque:
- No hay requerimiento de auditoría completa (suficiente con audit logs)
- Complejidad añadida sin beneficio en este volumen de datos
- Se puede migrar a event sourcing en el futuro si cambian los requisitos

### ¿Por qué SKU como string desnormalizado en lugar de JOIN con Product?

| Enfoque | Problema |
|---------|----------|
| JOIN con product.id | Reportes de rentabilidad lentos. Las líneas de venta/compra pierden trazabilidad si el producto cambia. |
| **SKU string** | **Los reportes no necesitan JOIN. Los datos históricos son inmutables. El SKU es el identificador de negocio. La desnormalización es intencional y controlada.** |

### ¿Por qué shared DB + RLS y no DB por tenant desde el inicio?

| Enfoque | Problema |
|---------|----------|
| DB por tenant desde día 1 | Costo operativo alto para N tenants pequeños. Migraciones en N DBs. Pool de conexiones grande. |
| **Shared DB + RLS** | **Cero overhead operativo inicial. RLS es probado en PostgreSQL. Si un tenant escala, se migra a su propia DB sin cambiar código.** |

### ¿Por qué Zustand y no Redux/Context?

| Alternativa | Problema |
|-------------|----------|
| Redux | Boilerplate excesivo para este tamaño de proyecto. Mucha ceremonia. |
| React Context | Re-renders innecesarios. Díficil de optimizar. No tiene DevTools. |
| **Zustand** | **API mínima, sin boilerplate. Persistencia integrada. DevTools. Bundle pequeño (~1KB). Suficiente para el estado global que necesitamos.** |

### ¿Por qué TanStack Query y no RTK Query/SWR?

| Alternativa | Problema |
|-------------|----------|
| RTK Query | Atado a Redux. Si no usamos Redux, no tiene sentido. |
| SWR | Bueno pero menos features que TanStack. Sin mutations con rollback. |
| **TanStack Query** | **Mutations optimistas, paginación infinita, refetch automático, DevTools. El estándar de facto en React para fetching.** |

---

## 5. Estrategia de Pruebas

| Tipo | Herramienta | Cobertura | Objetivo |
|------|-----------|-----------|----------|
| **Unit Tests** | Jest | Domain Layer (entities, value objects, services) | Validar reglas de negocio sin infraestructura |
| **Integration Tests** | Jest + Testcontainers | Application Layer (handlers, repositories) | Validar casos de uso con DB real |
| **E2E Tests** | Playwright / Supertest | Presentation Layer (controllers, API) | Validar flujos completos HTTP |
| **Component Tests** | Testing Library | Frontend components | Validar render, interacciones, estados |
| **Visual Regression** | Percy / Chromatic | UI components | Evitar regresiones visuales |

### Configuración por capa

```
apps/backend/
├── test/
│   ├── unit/
│   │   └── modules/
│   │       ├── catalog/
│   │       │   ├── product.entity.spec.ts
│   │       │   ├── sku.value-object.spec.ts
│   │       │   └── price.value-object.spec.ts
│   │       └── orders/
│   │           └── order.entity.spec.ts
│   ├── integration/
│   │   └── modules/
│   │       ├── catalog/
│   │       │   └── create-product.handler.spec.ts
│   │       └── orders/
│   │           └── create-order.handler.spec.ts
│   └── e2e/
│       ├── auth.e2e-spec.ts
│       ├── products.e2e-spec.ts
│       └── orders.e2e-spec.ts
```

---

## 6. Monitoreo y Observabilidad

### Stack

| Herramienta | Propósito |
|------------|-----------|
| **Prometheus** | Métricas: requests, latencia, errores, uso de recursos |
| **Grafana** | Dashboards: por módulo, por tenant, visión global |
| **Sentry** | Errores en backend y frontend. Source maps. Breadcrumbs. |
| **OpenTelemetry** | Distributed tracing entre servicios. Jaeger backend. |
| **Loki** | Logs centralizados. Búsqueda por tenant_id. |
| **StatusPage** | Página de estado público. |

### Métricas Críticas

```typescript
// Métricas expuestas por Prometheus
const metrics = {
  http_requests_total: { method, path, status, tenant },
  http_request_duration_ms: { method, path, p50, p95, p99 },
  db_query_duration_ms: { model, operation },
  queue_job_duration_ms: { queue, job },
  queue_job_failed_total: { queue, job },
  cache_hit_ratio: { cache },
  active_users: { tenant },
  orders_created_total: { tenant, status },
  stock_alerts_total: { tenant },
};
```

---

## 7. Checklist Final: Preparación para el Futuro

- [x] **Multi-tenant**: tenant_id en toda entidad, RLS, resolución por subdominio/header
- [x] **Multi-sucursal**: warehouse/sucursal como entidad, stock por sucursal
- [x] **Multi-usuario**: roles y permisos granulares, usuarios por tenant
- [x] **Multi-moneda**: Currency value object, campo currency en transacciones
- [x] **Multi-idioma**: i18n planning en frontend, sin hardcode de textos
- [x] **SaaS**: tenant con plan, facturación, onboarding automatizado
- [x] **API pública**: versionada, rateada, documentada, API keys
- [x] **Webhooks**: registro de webhooks por tenant, firma de eventos
- [x] **Escalabilidad horizontal**: microservicios NestJS stateless, read replicas
- [x] **Zero-downtime deploys**: rolling updates en K8s, health checks
- [x] **Backup**: backups automáticos de PostgreSQL, point-in-time recovery
- [x] **Seguridad por capas**: TLS, auth, RBAC, rate limiting, auditoría
