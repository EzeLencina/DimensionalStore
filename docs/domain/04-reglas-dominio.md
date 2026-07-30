# REGLAS DE DOMINIO

> 50+ reglas de negocio que gobiernan el comportamiento del sistema. Organizadas por Bounded Context.

---

## 1. Catalog — Reglas de Producto

| # | Regla | Tipo | Violación |
|---|-------|------|-----------|
| R01 | El SKU debe ser único por tenant. Nunca pueden existir dos productos con el mismo SKU en el mismo tenant. | Invariante | `DUPLICATE_SKU` |
| R02 | El SKU es inmutable después de que el producto tiene movimientos de inventario, ventas o compras. | Guard | `SKU_IMMUTABLE` |
| R03 | El slug debe ser único por tenant. | Invariante | `DUPLICATE_SLUG` |
| R04 | Un producto con status DISCONTINUED no puede cambiar a ACTIVE. | Transición | `INVALID_STATUS_TRANSITION` |
| R05 | Un producto no puede eliminarse (soft delete) si tiene stock > 0, ventas activas o compras pendientes. | Guard | `PRODUCT_HAS_ACTIVITY` |
| R06 | El precio base de un producto debe ser >= 0. Un producto no puede tener precio negativo. | Invariante | `NEGATIVE_PRICE` |
| R07 | El costo de un producto no puede ser negativo. | Invariante | `NEGATIVE_COST` |
| R08 | El código de barras (barcode) debe ser único por tenant. | Invariante | `DUPLICATE_BARCODE` |
| R09 | Una categoría no puede ser padre de sí misma. | Invariante | `SELF_PARENT_CATEGORY` |
| R10 | Una categoría no puede eliminarse si tiene productos asociados. | Guard | `CATEGORY_HAS_PRODUCTS` |
| R11 | Un producto de tipo SERVICE no tiene control de stock ni variantes. | Invariante | `SERVICE_NO_STOCK` |
| R12 | Un producto VARIANTEABLE debe tener al menos una variante activa para estar ACTIVE. | Invariante | `VARIANTEABLE_NO_VARIANTS` |
| R13 | El SKU de una variante debe heredar el SKU del padre + sufijo único por tenant. | Invariante | `INVALID_VARIANT_SKU` |
| R14 | Un producto SIMPLE no puede tener variantes. | Invariante | `SIMPLE_HAS_VARIANTS` |
| R15 | El precio de una variante puede anular el precio base, pero no puede ser negativo. | Invariante | `NEGATIVE_VARIANT_PRICE` |

---

## 2. Inventory — Reglas de Stock

| # | Regla | Tipo | Violación |
|---|-------|------|-----------|
| R16 | El stock disponible (quantity) nunca puede ser negativo. | Invariante | `NEGATIVE_STOCK` |
| R17 | El stock reservado (reservedQuantity) nunca puede ser mayor que el stock disponible (quantity). | Invariante | `INSUFFICIENT_STOCK` |
| R18 | Un movimiento de inventario es INMUTABLE. No puede modificarse ni eliminarse una vez creado. | Política | `MOVEMENT_IMMUTABLE` |
| R19 | Una reserva de stock expira automáticamente si la orden no se confirma en N minutos (configurable por tenant). | Política | `RESERVATION_EXPIRED` |
| R20 | Al confirmar una venta, la reserva debe convertirse en salida definitiva de stock. | Regla de proceso | `STOCK_MUST_BE_DECREASED` |
| R21 | Al cancelar una venta confirmada, el stock debe liberarse (devolverse al disponible). | Regla de proceso | `STOCK_MUST_BE_RESTORED` |
| R22 | Al recibir una compra, el stock debe incrementarse automáticamente. | Regla de proceso | `STOCK_MUST_BE_INCREASED` |
| R23 | Una transferencia de stock entre sucursales genera dos movimientos: TRANSFER_OUT (origen) y TRANSFER_IN (destino). | Regla de proceso | `TRANSFER_MUST_BE_PAIRED` |
| R24 | El stockAfter debe ser siempre igual a stockBefore + quantity (consistencia del movimiento). | Invariante | `STOCK_CALCULATION_MISMATCH` |
| R25 | Un ajuste de stock requiere una razón obligatoria. | Invariante | `ADJUSTMENT_REASON_REQUIRED` |
| R26 | Un SKU sin registro de stock se asume con quantity = 0 y reservedQuantity = 0. | Default | — |
| R27 | Cuando stock actual < minThreshold, se debe disparar la alerta low_stock.alert. | Regla de proceso | `LOW_STOCK_ALERT` |

---

## 3. Sales — Reglas de Órdenes y Ventas

| # | Regla | Tipo | Violación |
|---|-------|------|-----------|
| R28 | El número de orden debe ser único por tenant y auto-generado secuencialmente. | Invariante | `DUPLICATE_ORDER_NUMBER` |
| R29 | Una orden solo puede avanzar a ciertos estados según la máquina de estados: | Transición | `INVALID_STATUS_TRANSITION` |
| | `PENDING → CONFIRMED → PREPARING → SHIPPED → DELIVERED` | | |
| | `PENDING → CANCELLED` | | |
| | `CONFIRMED → CANCELLED` | | |
| | `CONFIRMED → REFUNDED` | | |
| | `SHIPPED → DELIVERED` | | |
| | `DELIVERED → REFUNDED` | | |
| | Cualquier transición no listada está prohibida. | | |
| R30 | Una orden confirmada no puede modificarse en sus líneas (solo estado y dirección). | Guard | `ORDER_LOCKED` |
| R31 | Una orden PENDING expira automáticamente si no se confirma en N minutos (configurable). | Política | `ORDER_EXPIRED` |
| R32 | El total de una orden debe ser igual a subtotal - descuento + envío + impuestos. | Invariante | `ORDER_TOTAL_MISMATCH` |
| R33 | El descuento de una orden no puede exceder el subtotal. | Invariante | `DISCOUNT_EXCEEDS_SUBTOTAL` |
| R34 | Una orden no puede tener líneas duplicadas del mismo SKU. | Invariante | `DUPLICATE_ORDER_LINE` |
| R35 | No se puede confirmar una orden sin al menos una línea. | Invariante | `ORDER_WITHOUT_LINES` |
| R36 | Solo se puede devolver una orden DELIVERED, dentro del período de garantía o política de devolución. | Guard | `ORDER_NOT_ELIGIBLE_FOR_RETURN` |
| R37 | Una orden REFUNDED no puede volver a ningún otro estado. | Invariante | `REFUNDED_IS_FINAL` |
| R38 | El total devuelto en una devolución no puede exceder el total de la orden original. | Invariante | `REFUND_EXCEEDS_ORDER` |
| R39 | Un cupón solo puede usarse una vez por orden. | Invariante | `COUPON_ALREADY_APPLIED` |
| R40 | El stock se reserva al crear la orden (PENDING) y se descuenta al confirmar (CONFIRMED). | Regla de proceso | — |

---

## 4. Purchasing — Reglas de Compras

| # | Regla | Tipo | Violación |
|---|-------|------|-----------|
| R41 | El número de orden de compra debe ser único por tenant. | Invariante | `DUPLICATE_PO_NUMBER` |
| R42 | No se puede recibir más cantidad de la ordenada en una línea de compra. | Invariante | `OVER_RECEIVED` |
| R43 | Una compra RECEIVED no puede modificarse ni cancelarse. | Guard | `PURCHASE_LOCKED` |
| R44 | Al recibir una compra, se debe generar automáticamente un movimiento de inventario INCREMENTAL. | Regla de proceso | — |
| R45 | El costo registrado en la compra actualiza el costo promedio del producto. | Regla de proceso | — |
| R46 | Una compra no puede tener líneas duplicadas del mismo SKU. | Invariante | `DUPLICATE_PO_LINE` |

---

## 5. Finance — Reglas Financieras

| # | Regla | Tipo | Violación |
|---|-------|------|-----------|
| R47 | Toda transacción financiera debe tener un type y un referenceType obligatorios para trazabilidad. | Invariante | `TRANSACTION_INCOMPLETE` |
| R48 | El monto de una transacción nunca puede ser cero. | Invariante | `ZERO_AMOUNT_TRANSACTION` |
| R49 | Una transacción financiera registrada no puede modificarse ni eliminarse (inmutable). | Política | `TRANSACTION_IMMUTABLE` |
| R50 | Cada venta CONFIRMED debe generar una transacción financiera de ingreso. | Regla de proceso | — |
| R51 | Cada compra RECEIVED debe generar una transacción financiera de egreso. | Regla de proceso | — |
| R52 | Cada devolución debe generar una transacción financiera inversa. | Regla de proceso | — |
| R53 | El número de factura debe ser único y secuencial por tenant y tipo de factura. | Invariante | `DUPLICATE_INVOICE_NUMBER` |

---

## 6. Cash — Reglas de Caja

| # | Regla | Tipo | Violación |
|---|-------|------|-----------|
| R54 | Solo puede haber UNA caja abierta por sucursal a la vez. | Invariante | `CASH_REGISTER_ALREADY_OPEN` |
| R55 | No se puede registrar un movimiento en una caja cerrada. | Guard | `CASH_REGISTER_CLOSED` |
| R56 | No se puede cerrar una caja con saldo discrepante sin registrar la diferencia. | Guard | `CASH_REGISTER_DISCREPANCY` |
| R57 | Al cerrar la caja, el currentBalance debe coincidir con la suma de movimientos. Si no, registrar discrepancy. | Regla de proceso | — |

---

## 7. Customers — Reglas de Clientes

| # | Regla | Tipo | Violación |
|---|-------|------|-----------|
| R58 | El email del cliente debe ser único por tenant. | Invariante | `DUPLICATE_CUSTOMER_EMAIL` |
| R59 | Un cliente no puede eliminarse (soft delete) si tiene ventas activas o saldo pendiente. | Guard | `CUSTOMER_HAS_ACTIVITY` |
| R60 | Un cliente con más de N compras o N monto acumulado debe ascender de tier automáticamente. | Regla de proceso (futuro) | — |

---

## 8. Marketing — Reglas de Cupones

| # | Regla | Tipo | Violación |
|---|-------|------|-----------|
| R61 | El código de cupón debe ser único por tenant. | Invariante | `DUPLICATE_COUPON_CODE` |
| R62 | Un cupón no puede usarse si ha excedido su maxUsageCount. | Guard | `COUPON_EXHAUSTED` |
| R63 | Un cupón no puede usarse fuera de su fecha de vigencia. | Guard | `COUPON_EXPIRED` |
| R64 | Un cupón de tipo FREE_SHIPPING no puede tener valor monetario. | Invariante | `INVALID_COUPON_CONFIG` |
| R65 | Un cupón de tipo PERCENTAGE debe tener valor entre 1 y 100. | Invariante | `INVALID_DISCOUNT_PERCENTAGE` |

---

## 9. Identity — Reglas de Usuarios

| # | Regla | Tipo | Violación |
|---|-------|------|-----------|
| R66 | El email del usuario debe ser único por tenant. | Invariante | `DUPLICATE_USER_EMAIL` |
| R67 | Un usuario no puede eliminarse si es el único administrador del tenant. | Guard | `LAST_ADMIN` |
| R68 | Un rol del sistema (isSystem = true) no puede modificarse ni eliminarse. | Guard | `SYSTEM_ROLE_IMMUTABLE` |
| R69 | Un usuario debe tener al menos un rol para acceder al dashboard. | Invariante | `USER_WITHOUT_ROLE` |
| R70 | Las contraseñas deben tener una antigüedad máxima configurable (password expiration). | Política | `PASSWORD_EXPIRED` |

---

## 10. Audit — Reglas de Auditoría

| # | Regla | Tipo | Violación |
|---|-------|------|-----------|
| R71 | Todo comando de escritura (create, update, delete) sobre entidades de negocio DEBE generar un registro de auditoría. | Política | `MISSING_AUDIT_LOG` |
| R72 | Los registros de auditoría son INMUTABLES. No pueden modificarse ni eliminarse. | Política | `AUDIT_IMMUTABLE` |
| R73 | Las lecturas (GET) no generan auditoría, excepto exportaciones de datos. | Política | — |

---

## 11. Reglas Transversales

| # | Regla | Tipo | Violación |
|---|-------|------|-----------|
| R74 | Toda operación de escritura debe estar autenticada (usuario válido y sesión activa). | Política | `UNAUTHORIZED` |
| R75 | Toda operación debe respetar el aislamiento de tenant. Un usuario de tenant A no puede acceder a datos de tenant B. | Política | `TENANT_MISMATCH` |
| R76 | Las operaciones de escritura sobre datos sensibles (precios, costos, descuentos) requieren permisos específicos. | Política | `INSUFFICIENT_PERMISSIONS` |
| R77 | Los identificadores internos (IDs) nunca se exponen al cliente final. Solo SKU y números de orden. | Política | — |
| R78 | Los precios y costos se almacenan con 4 decimales para precisión, pero se muestran con 2. | Política | — |
| R79 | Toda fecha se almacena en UTC y se convierte a la zona horaria del tenant para visualización. | Política | — |
| R80 | Las operaciones que afectan stock (ventas, compras, ajustes) deben ejecutarse en una transacción de base de datos. | Política | `OPERATION_REQUIRES_TRANSACTION` |
