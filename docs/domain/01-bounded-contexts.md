# BOUNDED CONTEXTS — DOMAIN DRIVEN DESIGN

> 18 contextos completamente independientes. Cada uno con su propio lenguaje ubicuo, sus propias entidades y sus propias reglas.

---

## 1. Diagrama de Contextos y Dependencias

```
┌────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                        CORE DOMAIN                                                       │
│                                                                                                          │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐                     │
│  │ Catalog  │  │Inventory │  │  Sales   │  │Purchasing│  │ Finance  │  │   Cash   │                     │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘                     │
│       │             │             │             │             │             │                            │
└───────┼─────────────┼─────────────┼─────────────┼─────────────┼─────────────┼────────────────────────────┘
        │             │             │             │             │             │
        │             │             │             │             │             │
┌───────┼─────────────┼─────────────┼─────────────┼─────────────┼─────────────┼────────────────────────────┐
│       │             │             │             │             │             │    SUPPORTING DOMAINS       │
│       ▼             ▼             ▼             ▼             ▼             ▼                             │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌───────────────┐  ┌──────────┐  ┌──────────┐                  │
│  │Identity  │  │Customers │  │Suppliers │  │Configuration  │  │   CRM    │  │Marketing │                  │
│  └──────────┘  └──────────┘  └──────────┘  └───────────────┘  └──────────┘  └──────────┘                  │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐                                    │
│  │   CMS    │  │Analytics │  │Audit     │  │Storage   │  │  Notif.  │                                    │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘  └──────────┘                                    │
│  ┌──────────┐                                                                                            │
│  │Integrat. │                                                                                            │
│  └──────────┘                                                                                            │
└──────────────────────────────────────────────────────────────────────────────────────────────────────────┘
                                    GENERIC / SUPPORTING
```

---

## 2. Clasificación de Contextos

### Core Domain (Ventaja Competitiva)

| Contexto | Razón |
|----------|-------|
| **Catalog** | Gestión de productos con SKU, variantes, precios. Corazón del negocio. |
| **Inventory** | Stock en tiempo real, movimientos, alertas. Diferenciador operativo. |
| **Sales** | Órdenes, carrito, checkout, state machine de pedidos. Flujo de ingresos. |
| **Purchasing** | Órdenes de compra, recepción, relación con proveedores. |
| **Finance** | Libro diario, rentabilidad por SKU, cierre contable. |
| **Cash** | Caja diaria, arqueo, control de efectivo. |

### Supporting Domain (Soporte al Negocio)

| Contexto | Razón |
|----------|-------|
| **Identity** | Usuarios, roles, permisos, autenticación. |
| **Customers** | Gestión de clientes, direcciones, segmentos. |
| **Suppliers** | Gestión de proveedores, condiciones comerciales. |
| **CRM** | Scoring, historial de interacciones, campañas. |
| **Configuration** | Impuestos, métodos de pago, config del sistema. |

### Generic Domain (Comodity, sin ventaja competitiva)

| Contexto | Razón |
|----------|-------|
| **CMS** | Páginas, banners, SEO. Solución conocida, sin magia. |
| **Marketing** | Cupones, campañas, newsletters. Usar herramientas existentes. |
| **Analytics** | Reportes, métricas, dashboards. Consume eventos. |
| **Notifications** | Email, WhatsApp, notificaciones push. |
| **Audit** | Trazabilidad de cambios. Infraestructura pura. |
| **Storage** | Archivos, imágenes. Cloudflare R2 / S3. |
| **Integrations** | Webhooks, APIs externas, sync. |

---

## 3. Lenguaje Ubicuo por Contexto

### Identity
| Término | Significado |
|---------|-------------|
| Usuario | Persona que accede al sistema (staff o admin) |
| Rol | Conjunto de permisos asignable a usuarios |
| Permiso | Acción específica dentro del sistema |
| Empresa | Entidad legal que posee una o más sucursales |
| Sucursal | Unidad operativa dentro de una empresa |

### Catalog
| Término | Significado |
|---------|-------------|
| Producto | Bien tangible con SKU único para la venta |
| Variante | Versión específica de un producto (talle, color) |
| SKU | Identificador único del producto/variante para todo el sistema |
| Categoría | Agrupación jerárquica de productos |
| Marca | Fabricante o marca del producto |
| Precio | Valor monetario de venta de un producto |
| Costo | Valor monetario de adquisición del producto |

### Inventory
| Término | Significado |
|---------|-------------|
| Stock | Cantidad disponible de un SKU en una sucursal |
| Movimiento | Registro de entrada o salida de stock |
| Reserva | Stock apartado para una orden no confirmada |
| Alerta | Notificación cuando stock cae por debajo del mínimo |
| Ajuste | Corrección manual de stock por diferencia |

### Sales
| Término | Significado |
|---------|-------------|
| Venta | Transacción comercial donde un cliente adquiere productos |
| Pedido | Solicitud de compra con estado tracked |
| Presupuesto | Cotización sin compromiso de compra |
| Carrito | Lista temporal de productos a comprar |
| EstadoPedido | Etapa del ciclo de vida del pedido |
| Devolución | Reversión parcial o total de una venta |
| Línea | Item individual dentro de una venta o compra |

### Purchasing
| Término | Significado |
|---------|-------------|
| Compra | Adquisición de productos a un proveedor |
| OrdenCompra | Documento formal de compra a proveedor |
| Recepción | Proceso de ingreso de mercadería comprada |
| LíneaCompra | Producto individual en una orden de compra |

### Finance
| Término | Significado |
|---------|-------------|
| Transacción | Movimiento financiero (ingreso o egreso) |
| Factura | Comprobante fiscal de una venta |
| Rentabilidad | Diferencia entre precio de venta y costo |
| Cierre | Balance de un período contable |

### Cash
| Término | Significado |
|---------|-------------|
| Caja | Registro de efectivo físico en una sucursal |
| Arqueo | Conteo físico de efectivo vs. registro |
| MovimientoCaja | Ingreso o egreso de efectivo de una caja |

---

## 4. Dependencias Permitidas entre Contextos

### Reglas de dependencia:

1. **Core domains** pueden depender de supporting domains via interfaces
2. **Supporting domains** NO dependen de core domains
3. **Generic domains** NO dependen de ningún otro dominio (independientes)
4. Todas las dependencias apuntan hacia adentro (Clean Architecture)
5. La comunicación entre contextos es por **Domain Events** (nunca llamadas directas)

### Matriz de Dependencias

| Contexto | Depende de | Via | Nunca debe depender de |
|----------|-----------|-----|----------------------|
| **Identity** | — | — | Cualquier dominio de negocio |
| **Catalog** | Identity (usuarios) | Interface | Sales, Finance, Inventory |
| **Inventory** | Catalog (SKU) | Value Object | Sales, Finance |
| **Sales** | Catalog (SKU), Inventory (stock), Customers, Finance | Interfaces + Events | CMS, Marketing |
| **Purchasing** | Catalog (SKU), Inventory (stock), Suppliers | Interfaces + Events | Sales, CRM |
| **Finance** | Sales (ventas), Purchasing (compras) | Events | CMS, Marketing |
| **Cash** | Finance | Interface | Catalog |
| **Customers** | Sales (historial) | Events (lectura) | Inventory, Catalog |
| **Suppliers** | Purchasing (historial) | Events (lectura) | Sales, Catalog |
| **CRM** | Customers, Sales | Events (lectura) | Inventory, Purchasing |
| **Configuration** | — | — | Cualquier dominio de negocio |
| **CMS** | Catalog (lectura), Storage (imágenes) | Interfaces | Finance, Inventory |
| **Marketing** | Catalog, Customers, Sales | Events | Inventory, Purchasing |
| **Notifications** | — | — | Todos (recibe eventos) |
| **Audit** | — | — | Todos (recibe eventos) |
| **Analytics** | Todos (lectura) | Events | Ninguno (solo lee) |
| **Storage** | — | — | Ninguno |
| **Integrations** | Todos | Events + API | Ninguno |

### Ejemplo de comunicación por eventos:

```
Catalog.ProductCreated ──→ Inventory (crear registro de stock)
Sales.OrderConfirmed   ──→ Inventory (descontar stock definitivo)
                         ──→ Finance (registrar transacción)
                         ──→ Customers (actualizar historial)
                         ──→ Notifications (enviar email)
                         ──→ Analytics (registrar métrica)
```

---

## 5. Diagrama de Flujo de Eventos entre Contextos

```
CATALOG ──→ product.created ──────→ Inventory, Analytics, Integrations
CATALOG ──→ product.updated ──────→ Analytics, Integrations
CATALOG ──→ product.price_changed ─→ Analytics, Integrations

INVENTORY ──→ stock.reserved ──────→ Sales (confirmar disponibilidad)
INVENTORY ──→ stock.confirmed ─────→ Sales (liberar reserva)
INVENTORY ──→ stock.decreased ─────→ Analytics
INVENTORY ──→ stock.increased ─────→ Purchasing (confirmar recepción), Analytics
INVENTORY ──→ low_stock.alert ─────→ Notifications, Analytics

SALES ──→ order.created ──────────→ Inventory (reservar), Analytics, Notifications
SALES ──→ order.confirmed ────────→ Inventory (descontar), Finance, CRM, Marketing, Analytics, Notifications
SALES ──→ order.shipped ──────────→ Customers, Analytics, Notifications
SALES ──→ order.delivered ────────→ Customers, Analytics, Notifications
SALES ──→ order.cancelled ────────→ Inventory (liberar stock), Finance, Analytics, Notifications
SALES ──→ order.refunded ─────────→ Inventory (reingresar), Finance, Analytics, Notifications

PURCHASING ──→ purchase.created ──→ Analytics, Notifications
PURCHASING ──→ purchase.received ──→ Inventory (incrementar), Finance, Analytics, Notifications

FINANCE ──→ payment.received ─────→ Sales (confirmar pago), Analytics
FINANCE ──→ invoice.generated ────→ Sales, Analytics

CUSTOMERS ──→ customer.created ───→ CRM, Analytics, Marketing
CUSTOMERS ──→ customer.activity ───→ CRM, Analytics
```
