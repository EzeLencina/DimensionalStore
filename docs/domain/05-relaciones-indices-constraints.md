# RELACIONES, ÍNDICES Y RESTRICCIONES

---

## 1. Diagrama Entidad-Relación (ERD)

```
TENANT 1──N SUCURSAL
TENANT 1──N USER
TENANT 1──N ROLE
TENANT 1──N CATEGORY
TENANT 1──N BRAND
TENANT 1──N PRODUCT
TENANT 1──N CUSTOMER
TENANT 1──N SUPPLIER
TENANT 1──N CONFIG
TENANT 1──N TAX
TENANT 1──N PAYMENT_METHOD

PRODUCT 1──N PRODUCT_VARIANT
PRODUCT 1──N PRODUCT_IMAGE
PRODUCT 1──N PRODUCT_PRICE_HISTORY
PRODUCT N──N CATEGORY (via PRODUCT_CATEGORY)
PRODUCT N──N SUPPLIER (via PRODUCT_SUPPLIER)
PRODUCT 1──1 BRAND (nullable)
PRODUCT 1──1 CATEGORY (nullable, primary)

SKU (Product.sku / ProductVariant.sku) 1──1 STOCK
SKU 1──N INVENTORY_MOVEMENT
SKU 1──N ORDER_LINE
SKU 1──N PURCHASE_ORDER_LINE
SKU 1──N CART_ITEM
SKU 1──N RETURN_LINE
SKU 1──1 STOCK_ALERT

SUCURSAL 1──N STOCK
SUCURSAL 1──N CASH_REGISTER
SUCURSAL 1──N ORDER
SUCURSAL 1──N PURCHASE_ORDER

CUSTOMER 1──N CUSTOMER_ADDRESS
CUSTOMER 1──N ORDER
CUSTOMER 1──N CUSTOMER_NOTE
CUSTOMER N──N CUSTOMER_SEGMENT (via SEGMENT_MEMBER)

SUPPLIER 1──N SUPPLIER_CONTACT
SUPPLIER 1──N SUPPLIER_PRICE_LIST
SUPPLIER 1──N PURCHASE_ORDER

ORDER 1──N ORDER_LINE
ORDER 1──N ORDER_PAYMENT
ORDER 1──1 ORDER_SHIPMENT (nullable)
ORDER 1──N ORDER_HISTORY
ORDER 0──1 RETURN

RETURN 1──N RETURN_LINE

PURCHASE_ORDER 1──N PURCHASE_ORDER_LINE

CASH_REGISTER 1──N CASH_MOVEMENT

INVOICE 1──N INVOICE_LINE
INVOICE 0──1 ORDER

USER 1──N USER_ROLE
ROLE 1──N ROLE_PERMISSION
ROLE 1──N USER_ROLE
PERMISSION 1──N ROLE_PERMISSION

PAGE 1──N PAGE_SECTION

WEBHOOK 1──N WEBHOOK_EVENT

COUPON 0──1 CAMPAIGN
CAMPAIGN 0──1 CUSTOMER_SEGMENT
```

---

## 2. Relaciones Detalladas

### 2.1 Uno a Uno (1:1)

| Entidad A | Entidad B | Tipo | Justificación |
|-----------|-----------|------|---------------|
| **Product** | Brand | 1:1 opcional | Un producto tiene una marca. Una marca tiene muchos productos. |
| **Product** | Category (primary) | 1:1 opcional | Un producto tiene una categoría principal. Relación de navegación. |
| **Order** | Shipment | 1:1 opcional | Una orden tiene un envío. Un envío pertenece a una orden. |
| **Invoice** | Order | 1:1 opcional | Una factura pertenece a una orden. Una orden puede tener una factura. |
| **Campaign** | Coupon | 1:1 opcional | Una campaña puede tener un cupón asociado. |
| **Campaign** | CustomerSegment | 1:1 opcional | Una campaña puede estar dirigida a un segmento. |
| **Stock** | StockAlert | 1:1 opcional | Un SKU+sucursal puede tener configuración de alerta. |

### 2.2 Uno a Muchos (1:N)

| Entidad | Relación | Entidad | Justificación |
|---------|----------|---------|---------------|
| **Tenant** | → | Sucursal | Un tenant tiene N sucursales. Una sucursal pertenece a un tenant. |
| **Tenant** | → | User | Un tenant tiene N usuarios. |
| **Tenant** | → | Category | Un tenant tiene N categorías. |
| **Tenant** | → | Brand | Un tenant tiene N marcas. |
| **Tenant** | → | Product | Un tenant tiene N productos. |
| **Tenant** | → | Customer | Un tenant tiene N clientes. |
| **Tenant** | → | Supplier | Un tenant tiene N proveedores. |
| **Tenant** | → | Tax | Un tenant tiene N impuestos. |
| **Tenant** | → | PaymentMethod | Un tenant tiene N métodos de pago. |
| **Product** | → | ProductVariant | Un producto tiene N variantes. |
| **Product** | → | ProductImage | Un producto tiene N imágenes. |
| **Product** | → | ProductPriceHistory | Un producto tiene N registros de cambio de precio. |
| **Category** | → | Category (self) | Una categoría tiene N subcategorías. |
| **Customer** | → | CustomerAddress | Un cliente tiene N direcciones. |
| **Customer** | → | CustomerNote | Un cliente tiene N notas. |
| **Customer** | → | Order | Un cliente tiene N órdenes. |
| **Supplier** | → | PurchaseOrder | Un proveedor tiene N órdenes de compra. |
| **Supplier** | → | SupplierContact | Un proveedor tiene N contactos. |
| **Supplier** | → | SupplierPriceList | Un proveedor tiene N listas de precio. |
| **Order** | → | OrderLine | Una orden tiene N líneas. |
| **Order** | → | OrderPayment | Una orden tiene N pagos. |
| **Order** | → | OrderHistory | Una orden tiene N registros de cambio de estado. |
| **PurchaseOrder** | → | PurchaseOrderLine | Una OC tiene N líneas. |
| **CashRegister** | → | CashMovement | Una caja tiene N movimientos. |
| **Invoice** | → | InvoiceLine | Una factura tiene N líneas. |
| **Role** | → | UserRole | Un rol tiene N asignaciones a usuarios. |
| **Role** | → | RolePermission | Un rol tiene N permisos asignados. |
| **User** | → | UserRole | Un usuario tiene N roles. |
| **Page** | → | PageSection | Una página tiene N secciones. |
| **Webhook** | → | WebhookEvent | Un webhook tiene N eventos enviados. |
| **Sucursal** | → | Stock | Una sucursal tiene N registros de stock. |
| **Sucursal** | → | CashRegister | Una sucursal tiene N cajas (una abierta a la vez). |
| **Sucursal** | → | Order | Una sucursal procesa N órdenes. |
| **Sucursal** | → | PurchaseOrder | Una sucursal genera N OC. |

### 2.3 Muchos a Muchos (N:N)

| Entidad A | Entidad B | Tabla Puente | Justificación |
|-----------|-----------|-------------|---------------|
| **Product** | Category | ProductCategory | Un producto puede estar en N categorías. Una categoría tiene N productos. |
| **Product** | Supplier | ProductSupplier | Un producto puede ser provisto por N proveedores. Un proveedor provee N productos. |
| **Role** | Permission | RolePermission | Un rol tiene N permisos. Un permiso puede estar en N roles. |
| **User** | Role | UserRole | Un usuario puede tener N roles. Un rol puede tener N usuarios. |
| **Customer** | CustomerSegment | SegmentMember | Un cliente puede pertenecer a N segmentos. Un segmento tiene N clientes. |
| **ProductVariant** | OrderLine | (directo en OrderLine) | No requiere tabla puente; la relación está en OrderLine por SKU. |

---

## 3. Estrategia de Índices

### 3.1 Índices Primarios (PKs)

Todas las tablas usan `id` como PK con índice único (default en PostgreSQL).

### 3.2 Índices Únicos Compuestos

| Tabla | Columnas | Propósito |
|-------|----------|-----------|
| **Product** | (tenantId, sku) | SKU único por tenant |
| **Product** | (tenantId, slug) | Slug único por tenant |
| **Product** | (tenantId, barcode) | Código de barras único por tenant |
| **ProductVariant** | (tenantId, sku) | SKU de variante único por tenant |
| **ProductVariant** | (tenantId, barcode) | Código de barras único por tenant |
| **Category** | (tenantId, slug) | Slug único por tenant |
| **Brand** | (tenantId, slug) | Slug único por tenant |
| **Customer** | (tenantId, email) | Email único por tenant |
| **User** | (tenantId, email) | Email único por tenant |
| **Supplier** | (tenantId, code) | Código único por tenant |
| **Order** | (tenantId, number) | Número de orden único |
| **PurchaseOrder** | (tenantId, number) | Número de OC único |
| **Invoice** | (tenantId, number) | Número fiscal único |
| **Coupon** | (tenantId, code) | Código de cupón único |
| **Page** | (tenantId, slug) | Slug único por tenant |
| **Sucursal** | (tenantId, code) | Código único por tenant |
| **Stock** | (tenantId, sku, sucursalId) | Stock único por SKU+sucursal |
| **StockAlert** | (tenantId, sku, sucursalId) | Alerta única por SKU+sucursal |
| **SystemConfig** | (tenantId, key) | Config única por tenant |
| **Permission** | (code) | Código de permiso único global |
| **Tenant** | (slug) | Slug de tenant único global |

### 3.3 Índices por Búsqueda

| Tabla | Columnas | Tipo | Propósito |
|-------|----------|------|-----------|
| **Product** | (tenantId, status, createdAt DESC) | B-tree | Listado de productos por estado |
| **Product** | (tenantId, categoryId) | B-tree | Productos por categoría |
| **Product** | (tenantId, brandId) | B-tree | Productos por marca |
| **Product** | (tenantId, name) | GIN (trgm) | Búsqueda textual por nombre |
| **Product** | (tenantId, description) | GIN (trgm) | Búsqueda textual por descripción |
| **Order** | (tenantId, status, createdAt DESC) | B-tree | Órdenes por estado |
| **Order** | (tenantId, customerId, createdAt DESC) | B-tree | Órdenes de un cliente |
| **Order** | (tenantId, createdAt DESC) | B-tree | Órdenes recientes |
| **OrderLine** | (tenantId, sku, createdAt DESC) | B-tree | Líneas de venta por SKU (reportes) |
| **OrderLine** | (tenantId, orderId) | B-tree | Líneas de una orden |
| **InventoryMovement** | (tenantId, sku, createdAt DESC) | B-tree | Historial de movimientos por SKU |
| **InventoryMovement** | (tenantId, type, createdAt DESC) | B-tree | Movimientos por tipo |
| **InventoryMovement** | (tenantId, referenceType, referenceId) | B-tree | Búsqueda por documento origen |
| **CashMovement** | (tenantId, cashRegisterId, createdAt DESC) | B-tree | Movimientos de una caja |
| **Transaction** | (tenantId, createdAt DESC) | B-tree | Transacciones financieras |
| **Transaction** | (tenantId, referenceType, referenceId) | B-tree | Transacción vinculada a un documento |
| **AuditLog** | (tenantId, entityType, entityId, createdAt DESC) | B-tree | Auditoría de una entidad |
| **AuditLog** | (tenantId, action, createdAt DESC) | B-tree | Auditoría por acción |
| **AuditLog** | (tenantId, userId, createdAt DESC) | B-tree | Auditoría por usuario |
| **Stock** | (tenantId, quantity) | B-tree | Productos con bajo stock (quantity < minStock) |
| **Customer** | (tenantId, tier) | B-tree | Clientes por segmento |
| **Customer** | (tenantId, name) | GIN (trgm) | Búsqueda por nombre |
| **Customer** | (tenantId, createdAt DESC) | B-tree | Clientes recientes |
| **Coupon** | (tenantId, code, isActive) | B-tree | Búsqueda rápida de cupón válido |
| **PaymentMethod** | (tenantId, code) | B-tree | Método de pago por código |
| **Supplier** | (tenantId, businessName) | GIN (trgm) | Búsqueda por nombre |
| **Sucursal** | (tenantId, isActive) | B-tree | Sucursales activas |

### 3.4 Índices para Búsqueda Full-Text (PostgreSQL)

```sql
-- Búsqueda de texto completo en español
CREATE INDEX idx_product_fulltext ON products
  USING GIN (to_tsvector('spanish', name || ' ' || COALESCE(description, '')));

-- Búsqueda con trigramas (similarity)
CREATE INDEX idx_product_name_trgm ON products
  USING GIN (name gin_trgm_ops);
CREATE INDEX idx_product_sku_trgm ON products
  USING GIN (sku gin_trgm_ops);
```

### 3.5 Índices de Mantenimiento

| Tabla | Columnas | Propósito |
|-------|----------|-----------|
| **AuditLog** | (createdAt) | Limpieza de logs antiguos |
| **InventoryMovement** | (createdAt) | Archivado de movimientos antiguos |
| **Notification** | (status, createdAt) | Limpieza de notificaciones enviadas |
| **Cart** | (expiresAt) | Limpieza de carritos expirados |

---

## 4. Restricciones de Base de Datos

### 4.1 CHECK Constraints

| Tabla | Condición | Mensaje |
|-------|-----------|---------|
| **Stock** | quantity >= 0 | `CHECK_STOCK_NON_NEGATIVE` |
| **Stock** | reservedQuantity >= 0 | `CHECK_RESERVED_NON_NEGATIVE` |
| **Stock** | reservedQuantity <= quantity | `CHECK_RESERVED_LTE_QUANTITY` |
| **Order** | total >= 0 | `CHECK_ORDER_TOTAL_NON_NEGATIVE` |
| **Order** | discountTotal >= 0 | `CHECK_DISCOUNT_NON_NEGATIVE` |
| **OrderLine** | quantity > 0 | `CHECK_LINE_QUANTITY_POSITIVE` |
| **OrderLine** | unitPrice >= 0 | `CHECK_UNIT_PRICE_NON_NEGATIVE` |
| **OrderLine** | totalPrice >= 0 | `CHECK_LINE_TOTAL_NON_NEGATIVE` |
| **PurchaseOrderLine** | receivedQuantity <= quantity | `CHECK_RECEIVED_LTE_ORDERED` |
| **CashMovement** | amount > 0 | `CHECK_CASH_MOVEMENT_POSITIVE` |
| **Coupon** | endsAt > startsAt | `CHECK_COUPON_DATE_RANGE` |
| **Coupon** | currentUsageCount >= 0 | `CHECK_COUPON_USAGE_NON_NEGATIVE` |
| **Product** | type != 'SERVICE' OR (weight IS NULL AND ...) | `CHECK_SERVICE_CONSTRAINTS` |
| **InventoryMovement** | quantity != 0 | `CHECK_MOVEMENT_NON_ZERO` |
| **InventoryMovement** | stockAfter = stockBefore + quantity | `CHECK_STOCK_CALCULATION` |
| **Category** | parentId != id | `CHECK_NO_SELF_PARENT` |
| **Invoice** | total >= 0 | `CHECK_INVOICE_TOTAL_NON_NEGATIVE` |

### 4.2 NOT NULL Constraints

| Tabla | Columnas NOT NULL | Justificación |
|-------|------------------|---------------|
| **Product** | tenantId, sku, name, slug, basePrice, status, type | Información base del producto |
| **Order** | tenantId, number, status, subtotal, total | Esenciales para la orden |
| **InventoryMovement** | tenantId, sku, type, quantity, stockBefore, stockAfter | Integridad del movimiento |
| **User** | tenantId, email, passwordHash, name | Esenciales para autenticación |
| **Customer** | tenantId, email, name | Identificación del cliente |

### 4.3 DEFAULT Values

| Tabla | Columna | Default |
|-------|---------|---------|
| **Product** | status | 'DRAFT' |
| **Product** | type | 'SIMPLE' |
| **Order** | status | 'PENDING' |
| **User** | mustChangePassword | false |
| **Stock** | quantity | 0 |
| **Stock** | reservedQuantity | 0 |
| **Stock** | minStock | 0 |
| **Coupon** | currentUsageCount | 0 |
| **AuditLog** | createdAt | now() |
| **InventoryMovement** | createdAt | now() |

### 4.4 Foreign Key Actions

| FK | Acción ON DELETE | Justificación |
|----|-----------------|---------------|
| **Order → Customer** | SET NULL | No perder la orden si el cliente se elimina |
| **OrderLine → Order** | CASCADE | Si se elimina la orden, eliminar líneas |
| **ProductImage → Product** | CASCADE | Las imágenes no existen sin el producto |
| **ProductVariant → Product** | CASCADE | Las variantes no existen sin el producto |
| **OrderLine → Order** | CASCADE | Líneas no existen sin la orden |
| **PurchaseOrderLine → PurchaseOrder** | CASCADE | Líneas no existen sin la OC |
| **CustomerAddress → Customer** | CASCADE | Direcciones no existen sin el cliente |
| **Stock → Sucursal** | RESTRICT | No eliminar sucursal con stock registrado |
| **Order → Sucursal** | RESTRICT | No eliminar sucursal con órdenes |
| **Category → Category (parent)** | SET NULL | Si se elimina categoría padre, dejar huérfanas |
| **Product → Category** | SET NULL | Si se elimina categoría, producto queda sin categoría |
| **AuditLog → User** | SET NULL | No perder log si el usuario se elimina |
| **InventoryMovement → User** | SET NULL | No perder trazabilidad |
| **Return → Order** | RESTRICT | No eliminar orden con devolución asociada |
