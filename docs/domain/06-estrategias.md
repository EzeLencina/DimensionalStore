# ESTRATEGIAS: AUDITORÍA, SOFT DELETE, VERSIONADO Y ESCALABILIDAD

---

## 1. Estrategia de Auditoría

### 1.1 Qué se Audita

| Tipo de Operación | Entidades Auditables | NO se Audita |
|------------------|---------------------|-------------|
| **CREATE** | Product, ProductVariant, Order, PurchaseOrder, Customer, Supplier, User, Role, Coupon, Campaign, Page, Invoice, Transaction, CashMovement, InventoryMovement | Carrito, Wishlist, Notificaciones, Logs internos |
| **UPDATE** | Product (precio, status), Order (status), Customer, Supplier, User, Role, Coupon, Config | ProductImage (simple), PageSection (orden), Contactos |
| **DELETE** | Soft delete de cualquier entidad con soft delete | Hard delete de entidades temporales (cart, temp) |
| **SPECIAL** | Login exitoso, cambio de contraseña, exportación de datos, cambios de permisos | Lecturas (GET), errores de validación |

### 1.2 Estructura del Registro de Auditoría

```json
{
  "id": "aud_clx...",
  "tenantId": "tenant_abc",
  "userId": "usr_xyz",
  "action": "PRODUCT.PRICE_CHANGED",
  "entityType": "product",
  "entityId": "prod_123",
  "oldValue": {
    "price": 100.00,
    "costPrice": 70.00
  },
  "newValue": {
    "price": 120.00,
    "costPrice": 75.00
  },
  "diff": {
    "price": { "from": 100.00, "to": 120.00 },
    "costPrice": { "from": 70.00, "to": 75.00 }
  },
  "metadata": {
    "reason": "Actualización por inflación",
    "source": "admin.dashboard"
  },
  "ipAddress": "192.168.1.1",
  "userAgent": "Mozilla/5.0...",
  "createdAt": "2026-07-29T10:30:00Z"
}
```

### 1.3 Convención de Actions

```
Formato: {ENTITY}.{ACTION}

Ejemplos:
  PRODUCT.CREATED
  PRODUCT.UPDATED
  PRODUCT.PRICE_CHANGED
  PRODUCT.STATUS_CHANGED
  PRODUCT.DELETED
  ORDER.CREATED
  ORDER.STATUS_CHANGED
  ORDER.CANCELLED
  ORDER.REFUNDED
  CUSTOMER.CREATED
  CUSTOMER.UPDATED
  CUSTOMER.TIER_CHANGED
  USER.LOGIN_SUCCESS
  USER.LOGIN_FAILED
  USER.PASSWORD_CHANGED
  ROLE.PERMISSIONS_UPDATED
  STOCK.ADJUSTED
  STOCK.TRANSFERRED
  EXPORT.DATA_EXPORTED
```

### 1.4 Almacenamiento y Retención

| Volumen estimado | ~500.000 logs/mes (100 ops/día hábil * 30 días * 150 entidades) |
|-----------------|----------------------------------------------------------------|
| **Almacenamiento** | Tabla `audit_logs` en PostgreSQL (particionada por mes) |
| **Retención** | 2 años en DB principal. Luego archive a S3/R2 en formato Parquet. |
| **Limpieza** | Job mensual: mover logs > 12 meses a cold storage. Eliminar de DB activa. |
| **Índice principal** | (tenantId, entityType, entityId, createdAt DESC) |
| **Índice secundario** | (createdAt) — para limpieza por fecha |

### 1.5 Implementación Técnica

```
Capa de aplicación:
  AuditInterceptor (NestJS) captura toda request POST/PUT/PATCH/DELETE.
  Encola en BullMQ cola 'audit' (procesamiento asíncrono).
  No bloquea la response del usuario.

Capa de dominio:
  Domain Events con datos de auditoría.
  El handler del evento persiste el audit log.

Capa manual:
  Métodos específicos marcan @Audit() para operaciones especiales.
```

---

## 2. Estrategia de Soft Delete

### 2.1 Entidades con Soft Delete

| Entidad | ¿Soft Delete? | Razón |
|---------|--------------|-------|
| **Product** | **SÍ** | No se puede eliminar físicamente por referencias históricas (ventas, compras). El soft delete permite reactivación. |
| **ProductVariant** | **SÍ** | Misma razón que Product. |
| **Category** | **SÍ** | Puede tener productos asociados. Soft delete preserva integridad. |
| **Brand** | **SÍ** | Puede tener productos asociados. |
| **Customer** | **SÍ** | No perder historial de ventas si el cliente solicita baja. |
| **Supplier** | **SÍ** | Puede tener compras asociadas. |
| **User** | **SÍ** | No perder trazabilidad (audit_logs references userId). |
| **Order** | **NO** (excepto casos extremos) | Una orden es un documento legal/fiscal. Solo soft delete por razones excepcionales con auditoría. |
| **PurchaseOrder** | **NO** | Documento interno. Se cancela (status = CANCELLED), no se elimina. |
| **Invoice** | **NO** | Documento fiscal. Nunca se elimina. Se anula. |
| **Page** | **SÍ** | Se puede despublicar o eliminar lógicamente. |
| **Sucursal** | **SÍ** | Se desactiva, no se elimina (referencias históricas). |
| **Coupon** | **SÍ** | Se puede desactivar. |
| **Campaign** | **SÍ** | Se puede archivar. |
| **Return** | **NO** | Documento legal. Nunca se elimina. |

### 2.2 Entidades SIN Soft Delete (Hard Delete)

| Entidad | Razón |
|---------|-------|
| **InventoryMovement** | Inmutable. No se elimina nunca. |
| **AuditLog** | Inmutable. No se elimina nunca. |
| **OrderLine** | Pertenece a Order. Si Order no se elimina, OrderLine tampoco. |
| **PurchaseOrderLine** | Misma razón que OrderLine. |
| **ProductImage** | No tiene referencias externas. Se elimina en cascada con Product. |
| **ProductPriceHistory** | Histórico inmutable. No se elimina. |
| **OrderHistory** | Histórico inmutable. No se elimina. |
| **Cart** | Temporal. Se elimina por expiración o hard delete. |
| **CartItem** | Temporal. Se elimina en cascada con Cart. |
| **WishlistItem** | Temporal. Hard delete. |
| **Notification** | Se purga periódicamente. Hard delete. |
| **WebhookEvent** | Se purga periódicamente. Hard delete. |

### 2.3 Reglas de Soft Delete

| Regla | Descripción |
|-------|-------------|
| **No borrar con actividad** | No se puede soft-delete un Product con stock > 0, ventas activas o compras pendientes. |
| **No borrar último admin** | No se puede soft-delete el único usuario con rol ADMIN en un tenant. |
| **No borrar cliente con ventas activas** | Customer con órdenes en estados PENDING, CONFIRMED, PREPARING, SHIPPED no puede eliminarse. |
| **Cascada lógica** | Soft delete de Product debe propagar a ProductVariant. |
| **Filtrado por defecto** | Todas las queries de negocio deben filtrar `deletedAt IS NULL` por defecto. |
| **Restauración** | Las entidades soft-deleted pueden restaurarse (set deletedAt = NULL). |
| **Visibilidad en UI** | Las entidades eliminadas deben marcarse visualmente (tachadas, con badge "Eliminado"). |

### 2.4 Impacto en Índices

```sql
-- Índices parciales para excluir registros eliminados
CREATE INDEX idx_active_products ON products (tenant_id, status, created_at DESC)
  WHERE deleted_at IS NULL;

CREATE INDEX idx_active_customers ON customers (tenant_id, email)
  WHERE deleted_at IS NULL;
```

---

## 3. Estrategia de Versionado

### 3.1 Versionado de la Base de Datos

```
Migraciones de Prisma:

  packages/database/prisma/migrations/
    ├── 20260701_init/                    # Esquema inicial
    ├── 20260715_add_supplier_price_list/ # Nueva entidad
    ├── 20260801_add_metadata_to_product/ # Nuevo campo opcional
    └── ...

Reglas:
  1. Las migraciones son siempre hacia adelante (no se modifican migraciones del pasado).
  2. Los cambios destructivos (DROP COLUMN, DROP TABLE) se hacen en 2 pasos:
     Paso 1: Marcar como deprecated, mantener compatibilidad.
     Paso 2: Eliminar en migración futura (semana 2+).
  3. Las columnas nuevas deben tener DEFAULT o ser NULLable para no romper código existente.
```

### 3.2 Versionado de la API

```
/api/v1/products        → Versión actual
/api/v2/products        → Breaking changes (futuro)

Headers de compatibilidad:
  Accept: application/vnd.tienda.v1+json
  Accept: application/vnd.tienda.v2+json

Política:
  - Mantener cada versión por mínimo 12 meses después del lanzamiento de la siguiente.
  - Deprecar con header Warning y documentación.
```

### 3.3 Versionado de Eventos (Domain Events)

```typescript
// Cada evento tiene un eventVersion para evolucionar el schema sin romper consumidores
{
  "event": "order.confirmed",
  "eventVersion": 2,           // <-- versión del schema del evento
  "tenantId": "tenant_abc",
  "data": { ... }
}

// Cuando el schema cambia:
// v1: { orderId, total }
// v2: { orderId, total, discountApplied, shippingCost }
//    → los consumidores antiguos siguen funcionando con v1
//    → se elimina v1 cuando todos los consumidores migraron
```

### 3.4 Versionado del Esquema de Base de Datos (Schema Evolution)

| Técnica | Cuándo usarla |
|---------|---------------|
| **Columnas NULLable** | Nuevos campos opcionales. No rompe nada. |
| **Default values** | Nuevos campos con valor por defecto. Código antiguo sigue funcionando. |
| **Vistas** | Cuando se necesita renombrar tabla. Crear vista con nombre viejo. |
| **Triggers / Sync** | Cuando se divide una tabla. Mantener sincronización temporal. |
| **JSONB (metadata)** | Atributos dinámicos que pueden cambiar frecuentemente sin migración. |

---

## 4. Estrategia de Escalabilidad

### 4.1 Volumen Proyectado

| Medida | Valor | Pico Esperado |
|--------|-------|---------------|
| Productos | 100.000 | 200.000 |
| Variantes | 300.000 | 600.000 |
| Clientes | 500.000 | 1.000.000 |
| Órdenes/mes | 50.000 | 100.000 |
| Movimientos inventario/mes | 200.000 | 500.000 |
| Transacciones financieras/mes | 100.000 | 250.000 |
| Audit logs/mes | 500.000 | 1.000.000 |
| Usuarios simultáneos | 50 | 200 |
| Sucursales | 10 | 50 |

### 4.2 Estrategia por Tabla

| Volumen | Estrategia |
|---------|-----------|
| **Bajo** (< 1M rows) | Tabla normal, índices B-tree. |
| **Medio** (1-10M rows) | Índices parciales, particionamiento por mes si aplica. |
| **Alto** (10-100M rows) | Particionamiento por tenant + por fecha. Read replicas. |
| **Histórico** (> 100M rows) | Vistas materializadas con refresco periódico. Archivado a cold storage. |

### 4.3 Particionamiento

```sql
-- Estrategia de particionamiento por mes para tablas transaccionales grandes

-- InventoryMovements: 5M rows/mes → particionar por mes
CREATE TABLE inventory_movements (
  id UUID, tenant_id TEXT, sku TEXT, type TEXT,
  created_at TIMESTAMPTZ, ...
) PARTITION BY RANGE (created_at);

-- Partition mensual
CREATE TABLE inventory_movements_202607 PARTITION OF inventory_movements
  FOR VALUES FROM ('2026-07-01') TO ('2026-08-01');

-- AuditLogs: particionar por mes
CREATE TABLE audit_logs (
  id UUID, tenant_id TEXT, action TEXT,
  created_at TIMESTAMPTZ, ...
) PARTITION BY RANGE (created_at);
```

### 4.4 Read Replicas

```
Escritura → Primary (único writer)
Lecturas → Read replicas (N réplicas, escalado horizontal)

Distribución de queries:
  Primary:    Transacciones (crear orden, ajustar stock, pagar)
  Replica 1:  Catálogo público, productos
  Replica 2:  Dashboard, reportes, analytics
  Replica 3:  API pública
```

### 4.5 Caché

| Cache | Qué cachea | TTL | Invalidación |
|-------|-----------|-----|-------------|
| **Redis** | Productos activos (público) | 5 min | Evento product.updated |
| **Redis** | Categorías + brands | 1 h | Evento category/brand.updated |
| **Redis** | Stock disponible | 30 s | Evento stock.changed |
| **Redis** | Configuración del tenant | 1 h | Cambio manual |
| **Redis** | Sesiones | 7 días | Logout |
| **Redis** | Permisos del usuario | 1 h | Cambio de rol/permiso |
| **CDN (Cloudflare)** | Imágenes de productos | 1 día | Purga manual |
| **ISR (Next.js)** | Páginas públicas (home, producto) | On-demand | Webhook de contenido |

### 4.6 Conexiones a Base de Datos

```yaml
Pool de conexiones (PgBouncer / Prisma):
  Max conexiones: 50 (dev) / 200 (prod)
  Timeout: 10s
  Modo: Transaction pooling (reducir conexiones ociosas)

Por servicio:
  Catalog:      10 conexiones
  Orders:       15 conexiones
  Inventory:    10 conexiones
  Finance:      5 conexiones
  Reports:      5 conexiones (usa réplica)
```

---

## 5. Estrategia de Consistencia

### 5.1 Consistencia Fuerte (Transaccional)

| Operación | Contexto | Mecanismo |
|-----------|----------|-----------|
| Crear orden + reservar stock | Sales + Inventory | Saga coreografiada o transacción distribuida con compensación |
| Confirmar orden + descontar stock | Sales + Inventory | Evento atómico (o transacción DB si están en el mismo módulo) |
| Recibir compra + incrementar stock | Purchasing + Inventory | Transacción o evento con exactly-once |
| Registrar pago + actualizar orden | Finance + Sales | Evento con idempotencia |

### 5.2 Consistencia Eventual

| Operación | Contexto | Ventana de inconsistencia |
|-----------|----------|--------------------------|
| Actualizar producto → Reflejar en tienda | Catalog → Frontend | < 5 min (ISR on-demand) |
| Nueva orden → Notificar cliente | Orders → Notifications | < 1 min |
| Actualizar cliente → Reflejar en CRM | Customers → CRM | < 1 min |
| Cambio de precio → Recalcular rentabilidad | Catalog → Analytics | < 1 h (batch) |
| Cerrar caja → Actualizar finanzas | Cash → Finance | < 1 min |

---

## 6. Estrategia de Migración de Datos (Futura)

```
Escenario: Migrar un tenant de shared DB a DB dedicada

1. Lock de escritura en tenant origen (read-only mode)
2. Exportar datos del tenant (pg_dump con WHERE tenant_id = 'X')
3. Importar en nueva base de datos
4. Verificar integridad (conteo de registros, checksums)
5. Actualizar mapping de tenant → DB en el gateway
6. Release lock
7. Downtime: < 5 minutos
```

```
Escenario: Agregar columna a tabla con 10M rows

1. Agregar columna como NULLable (sin DEFAULT, operación instantánea en PostgreSQL 11+)
2. Actualizar código para escribir el nuevo campo
3. Backfill batch de datos antiguos (job BullMQ, 10k rows por batch)
4. Una vez completado el backfill, agregar NOT NULL si corresponde
5. Agregar índice si necesario (CONCURRENTLY para no bloquear)
```
