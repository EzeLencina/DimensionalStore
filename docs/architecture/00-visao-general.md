# VISIÓN GENERAL DE ARQUITECTURA

> Plataforma integral: Ecommerce + ERP + CRM + Finanzas + SaaS-ready.
> Arquitectura diseñada para escalar a 100.000+ productos, 500.000+ clientes, millones de movimientos.

---

## 1. Diagrama de Arquitectura de Alto Nivel

```
┌─────────────────────────────────────────────────────────────────────────────────────┐
│                                   CLIENTES                                          │
│           ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐                   │
│           │ Browser  │  │ Mobile   │  │ API      │  │ Admin    │                   │
│           │ (Shop)   │  │ (future) │  │ Partner  │  │ Dashboard│                   │
│           └─────┬────┘  └─────┬────┘  └─────┬────┘  └─────┬────┘                   │
└─────────────────┼──────────────┼──────────────┼──────────────┼──────────────────────┘
                  │              │              │              │
                  ▼              ▼              ▼              ▼
┌──────────────────────────────────────────────────────────────────────────────────────┐
│                              CDN / WAF (Cloudflare)                                  │
│                         TLS 1.3 · HSTS · DDoS Protection                             │
└──────────────────────────────────────┬───────────────────────────────────────────────┘
                                       │
                                       ▼
┌──────────────────────────────────────────────────────────────────────────────────────┐
│                         LOAD BALANCER (Nginx / HAProxy)                               │
│                            SSL Termination · Rate Limiting                            │
└──────────────────────────┬───────────────────────────────────────────────────────────┘
                           │
                           ▼
┌──────────────────────────────────────────────────────────────────────────────────────┐
│                         NEXT.JS FRONTEND (App Router)                                 │
│                                                                                       │
│   ┌────────────────────┐  ┌────────────────────┐  ┌────────────────────┐             │
│   │   Tienda Pública   │  │  Dashboard Admin    │  │  Portal Vendedor   │             │
│   │   (SSR + ISR)      │  │  (CSR + SSR mix)   │  │  (CSR)             │             │
│   └─────────┬──────────┘  └─────────┬──────────┘  └─────────┬──────────┘             │
│             │                       │                       │                        │
│             └───────────────────────┼───────────────────────┘                        │
│                                     │                                                │
│              ┌──────────────────────┼──────────────────────┐                         │
│              │   TanStack Query · React Hook Form · Zod    │                         │
│              └──────────────────────┼──────────────────────┘                         │
└─────────────────────────────────────┼────────────────────────────────────────────────┘
                                      │
                                      ▼
┌──────────────────────────────────────────────────────────────────────────────────────┐
│                            API GATEWAY (NestJS Gateway)                               │
│      Auth · Rate Limit · Versioning · Tenant Resolution · Request Validation         │
└──────────────────────────────────────┬───────────────────────────────────────────────┘
                                       │
              ┌────────────────────────┼────────────────────────┐
              │                        │                        │
              ▼                        ▼                        ▼
┌──────────────────────┐  ┌──────────────────────┐  ┌──────────────────────┐
│  BFF / Agregación    │  │  WebSockets Gateway  │  │  Admin/Backoffice    │
│  (GraphQL Federation)│  │  (Notif. en tiempo    │  │  REST API            │
│                      │  │   real)               │  │  (CRUD pesados)      │
└──────────┬───────────┘  └──────────┬───────────┘  └──────────┬───────────┘
           │                         │                         │
           └─────────────────────────┼─────────────────────────┘
                                     │
                                     ▼
┌──────────────────────────────────────────────────────────────────────────────────────┐
│                        NESTJS MICROSERVICES (Domain Modules)                          │
│                                                                                       │
│  ┌────────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐    │
│  │ Catalog    │ │ Inventory│ │ Orders   │ │ CRM      │ │ Finances │ │ CMS      │    │
│  │ Module     │ │ Module   │ │ Module   │ │ Module   │ │ Module   │ │ Module   │    │
│  └─────┬──────┘ └────┬─────┘ └────┬─────┘ └────┬─────┘ └────┬─────┘ └────┬─────┘    │
│        │             │            │            │            │            │           │
│  ┌─────┴──────┐ ┌────┴─────┐ ┌───┴──────┐ ┌───┴──────┐ ┌───┴──────┐ ┌──┴───────┐   │
│  │ Purchases  │ │ Auth     │ │ Reports  │ │ Marketing │ │ Analytics │ │Integr.   │   │
│  │ Module     │ │ Module   │ │ Module   │ │ Module   │ │ Module    │ │ Module   │   │
│  └─────┬──────┘ └────┬─────┘ └────┬─────┘ └────┬─────┘ └────┬─────┘ └────┬─────┘   │
└────────┼─────────────┼────────────┼─────────────┼────────────┼────────────┼──────────┘
         │             │            │             │            │            │
         ▼             ▼            ▼             ▼            ▼            ▼
┌──────────────────────────────────────────────────────────────────────────────────────┐
│                                   MESSAGING / QUEUES                                  │
│                                                                                       │
│     ┌─────────────────────────────────────────────────────────────────────────┐       │
│     │                        BullMQ (Redis)                                    │       │
│     │   inventory.update  │  order.confirmed  │  email.send  │  report.gen    │       │
│     └─────────────────────────────────────────────────────────────────────────┘       │
└──────────────────────────────────────┬───────────────────────────────────────────────┘
                                       │
                                       ▼
┌──────────────────────────────────────────────────────────────────────────────────────┐
│                                    DATA LAYER                                        │
│                                                                                       │
│  ┌─────────────────────┐  ┌─────────────────────┐  ┌─────────────────────┐          │
│  │   PostgreSQL 16     │  │      Redis 7         │  │   Cloudflare R2    │          │
│  │  (Primary + Read    │  │  · Cache (TTL)       │  │  · Imágenes        │          │
│  │   Replicas)         │  │  · Sessions          │  │  · Archivos        │          │
│  │  · Prisma ORM       │  │  · Rate Limiting     │  │  · Facturación     │          │
│  │  · Row-Level Sec.   │  │  · BullMQ            │  │  · Backups         │          │
│  │  · Enum + JSONB     │  │  · Pub/Sub           │  │  · Tenant Assets   │          │
│  └─────────────────────┘  └─────────────────────┘  └─────────────────────┘          │
└──────────────────────────────────────┬───────────────────────────────────────────────┘
                                       │
                                       ▼
┌──────────────────────────────────────────────────────────────────────────────────────┐
│                              OBSERVABILITY                                          │
│                                                                                       │
│   ┌────────────┐  ┌────────────┐  ┌────────────┐  ┌────────────┐  ┌────────────┐   │
│   │ Prometheus │  │  Grafana   │  │   Sentry   │  │  Loki      │  │OpenTelemetry│   │
│   │ Metrics    │  │ Dashboards │  │ Errors     │  │ Logs       │  │ Tracing    │   │
│   └────────────┘  └────────────┘  └────────────┘  └────────────┘  └────────────┘   │
└──────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Principios Arquitectónicos Fundamentales

| Principio | Aplicación |
|-----------|-----------|
| **Clean Architecture** | Capas: Domain → Application → Infrastructure → Presentation. Dependencias hacia adentro. |
| **Domain-Driven Design** | Cada módulo = Bounded Context. Ubiquitous Language. Agregados, Value Objects, Domain Events. |
| **Vertical Slice Architecture** | Cada feature agrupa su controller, service, repository, DTO, validación. No capas horizontales genéricas. |
| **CQRS Ready** | Comandos (escritura) y Consultas (lectura) separados a nivel de módulo. Sin mezclar lógica. |
| **SOLID** | SRP: cada clase una razón de cambio. OCP: abierto a extensión, cerrado a modificación. LSP, ISP, DIP. |
| **Repository Pattern** | Abstracción total de persistencia. Domain no conoce Prisma ni PostgreSQL. |
| **Dependency Injection** | NestJS DI nativo. Interfaces para repositorios, servicios de infraestructura. |
| **Multi-tenant desde día 1** | `tenant_id` en toda entidad. RLS en PostgreSQL. Aislamiento lógico con opción a físico. |
| **API First** | Contrato primero (TypeScript types compartidos). Frontend es un cliente más. |
| **SKU-centric** | SKU como identificador universal. Conecta producto ↔ inventario ↔ compras ↔ ventas ↔ finanzas ↔ reportes. |

---

## 3. Decisión de Stack y Justificación

| Decisión | Alternativas | Por qué |
|----------|-------------|---------|
| **NestJS** vs Express/Fastify | Express (plano), Fastify (rápido pero ecosistema menor) | NestJS ofrece DI nativa, decoradores, guards, interceptors, pipes, módulos. La estructura opinada fuerza Clean Architecture. Mejor para equipos grandes y mantenibilidad a largo plazo. |
| **Prisma** vs TypeORM/Drizzle | TypeORM (más maduro pero verboso), Drizzle (más nuevo) | Prisma tiene el mejor DX, generación de tipos nativa, migrations seguras. Conecta perfectamente con TypeScript. Modelado declarativo. |
| **Next.js App Router** vs Remix/Vite SPA | Remix (similar), Vite SPA (sin SSR) | SSR + ISR para SEO del ecommerce. App Router con Server Components reduce JS bundle. Layouts anidados ideales para dashboards. |
| **TanStack Query** vs RTK Query/SWR | SWR (liviano pero menos features) | Caché optimista, paginación, refetch automático, mutations con rollback. Ideal para dashboard con datos cambiantes. |
| **BullMQ** vs RabbitMQ/SQS | RabbitMQ (más pesado), SQS (vendor lock-in) | Redis ya está en el stack. BullMQ es maduro, con scheduling, retry, eventos. Suficiente para el volumen proyectado. |
| **Cloudflare R2** vs S3 | S3 (vendor lock-in, egress fees) | R2 es S3-compatible sin costos de salida. Predecible para facturación SaaS. |
| **GraphQL Federation** vs REST puro | REST puro (múltiples round trips) | GraphQL Federation permite que cada módulo exponga su propio schema. BFF unifica. Ideal para frontend con datos de múltiples dominios. |

---

## 4. Concepción Multi-Tenant (SaaS Ready)

### Estrategia: Shared Database + tenant_id + RLS

```
Fase 1 (MVP):  tenant_id en todas las tablas, middleware de NestJS inyecta tenant_id.
Fase 2 (SaaS): Panel de administración de tenants, facturación por plan.
Fase 3 (Enterprise): Opción de DB dedicada por tenant (aislamiento físico).
```

### Flujo de resolución de tenant:

```
Request → Domain → Gateway → Tenant Middleware:
  1. Extraer tenant del subdominio (midominio.com → tenant "midominio")
  2. Extraer tenant del header (X-Tenant-Slug)
  3. Buscar en Redis (cache) → si no, en PostgreSQL
  4. Inyectar en request y en Prisma via middleware (current_tenant_id)
  5. RLS de PostgreSQL filtra automáticamente
```

### Estructura de tablas:

```prisma
model Tenant {
  id        String   @id @default(cuid())
  slug      String   @unique
  name      String
  plan      PlanEnum @default(FREE)
  settings  Json?
  isActive  Boolean  @default(true)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

Cada entidad de negocio incluye: `tenantId String` y `@@index([tenantId])`

---

## 5. Sistema de SKU (Columna Vertebral)

El SKU es el identificador universal de la plataforma. Conecta todos los dominios.

### Reglas del SKU:

```
Formato: [CATEGORÍA(3)]-[MARCA(3)]-[PRODUCTO(4)]-[VARIANTE(3)]

Ejemplo: ELE-SAM-WIRE-001
          ↑     ↑     ↑      ↑
        Categ  Marca Modelo  Variante

Reglas:
- Máximo 20 caracteres
- Sin espacios ni caracteres especiales
- Auto-generado con opción a manual
- Único por tenant
- Inmutable después de la primera venta
```

### Conectividad del SKU:

```
                    ┌──────────────┐
                    │   PRODUCTO   │
                    │  SKU: padre  │
                    └──────┬───────┘
                           │
              ┌────────────┼────────────┐
              │            │            │
              ▼            ▼            ▼
        ┌──────────┐ ┌──────────┐ ┌──────────┐
        │INVENTARIO│ │  COMPRAS │ │  VENTAS  │
        │ SKU único│ │ SKU línea│ │ SKU línea│
        └──────────┘ └──────────┘ └──────────┘
              │            │            │
              └────────────┼────────────┘
                           │
                           ▼
                    ┌──────────────┐
                    │  FINANZAS    │
                    │  (rentab.    │
                    │   por SKU)   │
                    └──────────────┘
                           │
                           ▼
                    ┌──────────────┐
                    │  REPORTES    │
                    │  + ANALYTICS │
                    └──────────────┘
```

### En la base de datos:

```prisma
model Product {
  id          String   @id @default(cuid())
  tenantId    String
  sku         String   // SKU primario del producto base (sin variante)
  // ...
  variants    ProductVariant[]
  
  @@unique([tenantId, sku])
}

model ProductVariant {
  id         String   @id @default(cuid())
  productId  String
  sku        String   // SKU completo incluyendo código de variante
  // ...
  
  @@unique([tenantId, sku])
}

model InventoryMovement {
  id       String
  sku      String   // SKU directo, no ID
  // ...
  @@index([tenantId, sku])
}

model SaleLine {
  id       String
  sku      String   // SKU directo
  // ...
  @@index([tenantId, sku])
}
```

El SKU viaja como string en todas las transacciones. IDs internos (cuid) nunca se exponen al usuario ni a integraciones.

---

## 6. Diagrama de Dependencias entre Módulos

```
                ┌──────────┐
                │   Auth   │
                └────┬─────┘
                     │ (protege todo)
                     ▼
┌─────────────────────────────────────────────────────────────────┐
│                        API GATEWAY                               │
│              (rutea, rate-limit, versiona, resuelve tenant)      │
└────┬────────┬────────┬────────┬────────┬────────┬────────┬──────┘
     │        │        │        │        │        │        │
     ▼        ▼        ▼        ▼        ▼        ▼        ▼
┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐
│Catalog│ │Invent│ │Orders│ │  CRM │ │Finan.│ │ CMS  │ │Marketing
└──┬───┘ └──┬───┘ └──┬───┘ └──┬───┘ └──┬───┘ └──┬───┘ └──┬───┘
   │        │        │        │        │        │        │
   │   ┌────┘        │        │        │        │        │
   │   │             │        │        │        │        │
   ▼   ▼             ▼        ▼        ▼        ▼        ▼
┌──────────────────────────────────────────────────────────────┐
│                     SHARED KERNEL                              │
│  (Value Objects, Domain Events, Base Repository, Utils)       │
└──────────────────────────────────────────────────────────────┘
```

### Reglas de dependencia:

| Módulo | Depende de | No depende de |
|--------|-----------|--------------|
| **Catalog** | Shared Kernel, Auth (token) | Orders, Finances, CRM |
| **Inventory** | Shared Kernel, Catalog (SKU) | CRM, Marketing |
| **Orders** | Shared Kernel, Catalog, Inventory, Finances | CMS, Marketing |
| **CRM** | Shared Kernel, Orders | Inventory, Catalog |
| **Finances** | Shared Kernel, Orders, Purchases | CMS, Catalog |
| **Purchases** | Shared Kernel, Catalog, Inventory | CRM, Marketing |
| **CMS** | Shared Kernel | Finances, Inventory |
| **Marketing** | Shared Kernel, Catalog, Orders | Inventory, Purchases |
| **Reports** | Shared Kernel, Todos (lectura) | Ninguno (solo lee) |

---

## 7. Flujo General del Sistema — Venta Completa

```
1. CLIENTE navega tienda pública
   → Next.js (SSR) renderiza catálogo desde API (con caché Redis)
   → Consulta: Catalog Module → Redis → PostgreSQL

2. CLIENTE agrega producto al carrito
   → POST /api/cart/add
   → Catalog Module valida stock vía Inventory Module (consistencia eventual vía BullMQ)
   → Carrito en Redis (TTL 24h, persistido si hay login)

3. CLIENTE inicia checkout
   → POST /api/checkout/start
   → Orders Module crea Order (status: PENDING)
   → Inventory Module reserva stock (evento: stock.reserved)

4. CLIENTE paga
   → Integración con proveedor de pago (Mercado Pago / Stripe)
   → Webhook de confirmación → Finances Module registra transacción
   → Orders Module cambia status: CONFIRMED
   → Evento: order.confirmed → Inventory Module descuenta stock definitivo
   → Evento: order.confirmed → CRM Module crea/actualiza cliente
   → BullMQ jobs: email de confirmación, notificación admin

5. ADMIN prepara pedido
   → Dashboard Admin (Next.js CSR) → Orders Module
   → Cambio de status: PREPARING → SHIPPED → DELIVERED
   → Cada cambio → evento → notificaciones + CRM + actualización de stock si hay devolución

6. CIERRE CONTABLE (diario)
   → Job cron (BullMQ) → Finances Module
   → Cierra caja del día (si aplica)
   → Registra ingresos/egresos por SKU
   → Actualiza rentabilidad en Reports Module

7. REPORTES (bajo demanda o schedule)
   → Reports Module consulta datos agregados (vistas materializadas o tablas de reporte)
   → Caché con TTL según criticidad
   → Dashboard los consume via TanStack Query con staleTime
```

---

## 8. Estrategia de Caché

| Capa | Tecnología | Estrategia | TTL |
|------|-----------|-----------|-----|
| **Productos (público)** | Redis + ISR (Next.js) | Cache-aside con invalidación por evento | 5 min (ISR: on-demand) |
| **Carrito** | Redis | Write-through, persistencia opcional | 24h / hasta compra |
| **Sesiones** | Redis | Write-through | 7 días (refresh token) |
| **Catálogos completos** | Redis | Cache-aside con invalidation tag | 10 min |
| **Reportes agregados** | Redis + Tabla materializada | Cache-aside | 1h / 24h según reporte |
| **Permisos/Roles** | Redis | Cache-aside, invalidación al modificar rol | 1h |
| **Configuración** | Redis | Cache-aside, invalidación manual | 1h |
| **Rate Limiting** | Redis | Sliding window | 1 min |
| **Páginas SSR** | Next.js CDN (ISR) | On-demand revalidation | Hasta evento de cambio |

Todas las invalidaciones se disparan via eventos BullMQ. Un cambio de precio → evento `product.updated` → invalida caché de producto y páginas relacionadas.

---

## 9. Estrategia de Base de Datos

### Lectura / Escritura

```
Escritura → Primary (single writer)
Lectura   → Read Replicas (N réplicas según carga)
```

En Prisma:

```typescript
// schema.prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")          // Primary (escritura)
  directUrl = env("DATABASE_URL_REPLICA") // Read replica (lectura)
}
```

### Particionamiento (futuro)

```sql
-- Particionamiento por tenant para tablas grandes:
CREATE TABLE inventory_movements (
  id UUID, tenant_id TEXT, sku TEXT, ...
) PARTITION BY LIST (tenant_id);
```

### Vistas Materializadas para Reportes

```sql
CREATE MATERIALIZED VIEW mv_daily_sales_by_sku AS
SELECT
  tenant_id,
  sku,
  DATE(created_at) as sale_date,
  SUM(quantity) as total_units,
  SUM(total) as total_revenue,
  SUM(profit) as total_profit
FROM sale_lines
GROUP BY tenant_id, sku, DATE(created_at)
-- Refresh via cron BullMQ
```

---

## 10. Convención de Carpetas Raíz

```
/
├── apps/
│   ├── backend/          # NestJS API
│   └── frontend/         # Next.js App Router
├── packages/
│   ├── shared/           # Tipos, constantes, validators (Zod), interfaces
│   ├── database/         # Prisma schema, migrations, seeds
│   ├── ui/               # shadcn/ui components base
│   ├── config/           # ESLint, TypeScript, Tailwind configs compartidas
│   ├── queue/            # BullMQ job definitions
│   └── utils/            # Helpers genéricos
├── docker/
│   ├── dev/              # Docker Compose desarrollo
│   └── prod/             # Docker Compose / K8s producción
├── docs/
│   └── architecture/     # Documentación de arquitectura
├── scripts/
│   ├── setup.sh
│   └── seed.sh
├── .github/
│   └── workflows/        # CI/CD pipelines
├── turbo.json            # Turborepo config
├── package.json          # Workspaces raíz
└── pnpm-workspace.yaml   # Pnpm workspaces
```
