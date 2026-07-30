# VALUE OBJECTS — CATÁLOGO COMPLETO

> Inmutables · Auto-validantes · Sin identidad · Igualdad por valor

---

## 1. Value Objects de Identidad

| Value Object | Tipo | Atributos | Reglas de Validación |
|-------------|------|-----------|---------------------|
| **Sku** | String | `value: string` | Formato: `XXX-XXX-XXXX-XXX`. Máx 20 chars. Sin espacios ni caracteres especiales. |
| **Slug** | String | `value: string` | URL-safe. Sin acentos ni espacios. |
| **Barcode** | String | `value: string` | EAN-13 o CODE-128. Opcional. |
| **Code** | String | `value: string` | Código interno alfanumérico. |

---

## 2. Value Objects Financieros

| Value Object | Tipo | Atributos | Reglas de Validación |
|-------------|------|-----------|---------------------|
| **Money** | Objeto | `amount: Decimal`, `currency: Currency` | amount > 0 (en contextos que obligan). Hasta 4 decimales. |
| **Price** | Objeto | `value: Decimal`, `currency: Currency` | value >= 0. No puede ser negativo. |
| **Cost** | Objeto | `value: Decimal`, `currency: Currency` | value >= 0. No puede ser negativo. |
| **TaxRate** | Decimal | `value: Decimal` | 0 <= value <= 100. Hasta 2 decimales. |
| **Discount** | Objeto | `type: DiscountType`, `value: Decimal` | Porcentaje: 0-100. Monto: > 0. |
| **Currency** | Enum | `code: String` | ISO 4217: ARS, USD, EUR, BRL. |
| **ExchangeRate** | Decimal | `value: Decimal` | > 0. Hasta 6 decimales. |
| **ProfitMargin** | Decimal | `value: Decimal` | Calculado: ((price - cost) / price) * 100. |

---

## 3. Value Objects de Personas y Contacto

| Value Object | Tipo | Atributos | Reglas de Validación |
|-------------|------|-----------|---------------------|
| **Email** | String | `value: string` | RFC 5322 válido. Normalizado a minúsculas. |
| **Phone** | String | `value: string` | Formato E.164: +5491123456789. |
| **TaxId** | String | `value: string` | Validación según país: CUIT (Argentina), RUT (Chile), CPF/CNPJ (Brasil). |
| **Dni** | String | `value: string` | Formato según país. |
| **FullName** | Objeto | `firstName: String`, `lastName: String` | No vacío. |
| **PasswordHash** | String | `hash: string`, `algorithm: string` | Mínimo 60 chars (bcrypt). |
| **Token** | String | `value: string` | JWT válido. |
| **RefreshToken** | String | `value: string` | UUID v4 opaco. |

---

## 4. Value Objects de Dirección

| Value Object | Tipo | Atributos | Reglas de Validación |
|-------------|------|-----------|---------------------|
| **Address** | Objeto | `street: String`, `number: String`, `complement: String?`, `city: String`, `province: String`, `zipCode: String`, `country: String` | ZipCode según país. |
| **GeoLocation** | Objeto | `lat: Decimal`, `lng: Decimal` | Lat: -90 a 90. Lng: -180 a 180. |
| **ZipCode** | String | `value: string` | Formato según país. |

---

## 5. Value Objects de Producto

| Value Object | Tipo | Atributos | Reglas de Validación |
|-------------|------|-----------|---------------------|
| **Weight** | Objeto | `value: Decimal`, `unit: WeightUnit` | value > 0. |
| **Dimensions** | Objeto | `length: Decimal`, `width: Decimal`, `height: Decimal`, `unit: LengthUnit` | Todos > 0. |
| **ImageUrl** | String | `value: string` | URL válida con extensiones de imagen. |
| **StockQuantity** | Int | `value: int` | >= 0. |
| **ReservedQuantity** | Int | `value: int` | >= 0. <= StockQuantity en el aggregate. |
| **SkuList** | Array | `values: Sku[]` | 1 a N SKUs. |

---

## 6. Value Objects de Tiempo

| Value Object | Tipo | Atributos | Reglas de Validación |
|-------------|------|-----------|---------------------|
| **DateRange** | Objeto | `start: DateTime`, `end: DateTime` | end > start. |
| **YearMonth** | Objeto | `year: Int`, `month: Int` | month: 1-12. |
| **TimeWindow** | Objeto | `start: Time`, `end: Time` | end > start. |
| **LeadTime** | Int | `days: Int` | > 0. |

---

## 7. Value Objects de Estado y Clasificación

| Value Object | Tipo | Atributos | Posibles Valores |
|-------------|------|-----------|-----------------|
| **OrderStatus** | Enum | `value: string` | PENDING, CONFIRMED, PREPARING, SHIPPED, DELIVERED, CANCELLED, REFUNDED |
| **PaymentStatus** | Enum | `value: string` | PENDING, APPROVED, REJECTED, REFUNDED |
| **ShipmentStatus** | Enum | `value: string` | PENDING, PICKED_UP, IN_TRANSIT, DELIVERED, FAILED |
| **ProductStatus** | Enum | `value: string` | DRAFT, ACTIVE, INACTIVE, DISCONTINUED |
| **CustomerTier** | Enum | `value: string` | REGULAR, SILVER, GOLD, PLATINUM |
| **MovementType** | Enum | `value: string` | ENTRY, EXIT, RESERVATION, RELEASE, ADJUSTMENT, TRANSFER_IN, TRANSFER_OUT |
| **DocumentType** | Enum | `value: string` | DNI, CUIT, CUIL, PASSPORT, RUT, CPF, CNPJ |
| **InvoiceType** | Enum | `value: string` | A, B, C, E, M |
| **ProductType** | Enum | `value: string` | SIMPLE, VARIANTEABLE, SERVICE |
| **DiscountType** | Enum | `value: string` | PERCENTAGE, FIXED_AMOUNT, FREE_SHIPPING |
| **CouponAppliesTo** | Enum | `value: string` | ALL, CATEGORY, PRODUCT |
| **ReturnCondition** | Enum | `value: string` | GOOD, DAMAGED, DEFECTIVE |

---

## 8. Value Objects de Configuración

| Value Object | Tipo | Atributos | Reglas de Validación |
|-------------|------|-----------|---------------------|
| **Percentage** | Decimal | `value: Decimal` | 0 <= value <= 100. |
| **Ratio** | Decimal | `value: Decimal` | 0 <= value <= 1. |
| **SortOrder** | Int | `value: int` | >= 0. |
| **Version** | String | `value: string` | Semver: X.Y.Z. |
| **Color** | String | `hex: string` | Regex: /^#[0-9A-Fa-f]{6}$/ |
| **ThemeConfig** | Json | `config: Json` | Validación de estructura. |
| **SeoMetadata** | Objeto | `title: String?`, `description: String?`, `keywords: String?`, `ogImage: String?` | Title max 60 chars. Description max 160 chars. |

---

## 9. Value Objects de Auditoría

| Value Object | Tipo | Atributos | Propósito |
|-------------|------|-----------|-----------|
| **AuditAction** | String | `value: string` | "PRODUCT.CREATED", "ORDER.STATUS_CHANGED" |
| **IpAddress** | String | `value: string` | IPv4 o IPv6 válido |
| **UserAgent** | String | `value: string` | Raw user-agent string |
| **ChangeDiff** | Json | `old: Json?`, `new: Json?` | Diferencia entre valores |

---

## 10. Value Objects Compuestos

| Value Object | Atributos | Propósito |
|-------------|-----------|-----------|
| **MoneyWithTax** | `net: Money`, `tax: Money`, `taxRate: TaxRate`, `total: Money` | Precio con IVA desglosado |
| **PriceHistoryPoint** | `price: Money`, `date: DateTime`, `reason: String?` | Punto en historial de precio |
| **StockLevel** | `sku: Sku`, `quantity: StockQuantity`, `reserved: ReservedQuantity`, `available: StockQuantity` | Nivel de stock disponible (available = quantity - reserved) |
| **OrderSummary** | `orderId: String`, `number: String`, `status: OrderStatus`, `total: Money`, `itemsCount: Int`, `customerName: String` | Resumen de orden para listados |
| **AddressSnapshot** | (todos los campos de Address) | Snapshot de dirección para órdenes (no se actualiza si el cliente cambia su dirección después) |
| **PaymentResult** | `success: Boolean`, `gatewayTransactionId: String?`, `status: PaymentStatus`, `error: String?`, `rawResponse: Json?` | Resultado de pago en gateway |
| **ReportPeriod** | `start: Date`, `end: Date`, `type: Enum (DAILY, MONTHLY, YEARLY, CUSTOM)` | Período para reportes |
| **Pagination** | `page: Int`, `perPage: Int`, `total: Int`, `totalPages: Int` | Metadata de paginación |
