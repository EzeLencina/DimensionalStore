# ARQUITECTURA DEL BACKEND

> NestJS + TypeScript + Prisma + Clean Architecture + DDD + Vertical Slices

---

## 1. Capas de Clean Architecture por Módulo

Cada módulo de negocio sigue estrictamente 4 capas:

```
┌──────────────────────────────────────────────────────────────────┐
│                    PRESENTATION LAYER                             │
│  Controllers · DTOs · Guards · Interceptors · Pipes · Filters   │
│  Propósito: Recibir requests, validar entrada, devolver respuesta│
│  Depende de: Application Layer                                    │
│  NO depende de: Domain, Infrastructure                            │
├──────────────────────────────────────────────────────────────────┤
│                    APPLICATION LAYER                              │
│  Commands · Queries · Handlers · Ports · DTOs de aplicación      │
│  Propósito: Orquestar casos de uso, coordinar eventos            │
│  Depende de: Domain Layer (interfaces)                            │
│  NO depende de: Infrastructure, Presentation                      │
├──────────────────────────────────────────────────────────────────┤
│                    DOMAIN LAYER (CORE)                            │
│  Entities · Value Objects · Aggregates · Domain Events            │
│  Repository Interfaces · Domain Services · Business Rules         │
│  Propósito: Corazón del negocio, sin dependencias externas        │
│  NO depende de: NADA externo (ni NestJS, ni Prisma, ni Express)  │
├──────────────────────────────────────────────────────────────────┤
│                    INFRASTRUCTURE LAYER                           │
│  Prisma Repositories · Cache · Queue · External APIs             │
│  Propósito: Implementar interfaces definidas en Domain/App       │
│  Depende de: Domain Layer (interfaces)                            │
└──────────────────────────────────────────────────────────────────┘
```

**Regla de oro:** Las dependencias apuntan hacia adentro. Domain no importa nada de Infrastructure. Application solo conoce interfaces de Domain.

---

## 2. Estructura Interna de un Módulo

### Ejemplo: Módulo Catalog

```
modules/catalog/
├── catalog.module.ts                  # NestJS Module (importa, exporta, registra)
│
├── domain/                            # DOMAIN LAYER — sin dependencias externas
│   ├── entities/
│   │   ├── product.entity.ts          # Aggregate Root
│   │   ├── product-variant.entity.ts  # Child Entity
│   │   ├── category.entity.ts
│   │   └── brand.entity.ts
│   ├── value-objects/
│   │   ├── sku.value-object.ts        # Validación + formato SKU
│   │   ├── price.value-object.ts      # Money con moneda
│   │   ├── product-status.enum.ts
│   │   └── weight.value-object.ts
│   ├── repositories/
│   │   ├── product-repository.interface.ts   # Puerto (outbound)
│   │   ├── category-repository.interface.ts
│   │   └── brand-repository.interface.ts
│   ├── events/
│   │   ├── product-created.event.ts
│   │   ├── product-updated.event.ts
│   │   ├── product-price-changed.event.ts
│   │   └── product-stock-alert.event.ts
│   ├── services/
│   │   └── sku-generator.service.ts   # Domain Service
│   └── errors/
│       ├── product-not-found.error.ts
│       ├── duplicate-sku.error.ts
│       └── invalid-product-status.error.ts
│
├── application/                       # APPLICATION LAYER — orquesta casos de uso
│   ├── commands/                      # Comandos (CQRS: escritura)
│   │   ├── create-product/
│   │   │   ├── create-product.command.ts     # Datos del comando
│   │   │   ├── create-product.handler.ts     # Caso de uso
│   │   │   └── create-product.dto.ts         # Validación de entrada
│   │   ├── update-product/
│   │   ├── update-product-price/
│   │   ├── change-product-status/
│   │   └── import-products/
│   ├── queries/                       # Consultas (CQRS: lectura)
│   │   ├── get-product-by-sku/
│   │   │   ├── get-product-by-sku.query.ts
│   │   │   └── get-product-by-sku.handler.ts
│   │   ├── list-products/
│   │   ├── search-products/
│   │   └── get-product-history/
│   └── ports/                         # Puertos de entrada (inbound)
│       ├── catalog-search.port.ts     # Interface para búsqueda externa
│       └── product-cache.port.ts      # Interface para caché
│
├── infrastructure/                    # INFRASTRUCTURE LAYER — implementaciones
│   ├── persistence/
│   │   ├── prisma-product.repository.ts      # Implementa ProductRepository
│   │   ├── prisma-category.repository.ts
│   │   └── prisma-brand.repository.ts
│   ├── cache/
│   │   └── redis-product-cache.ts            # Implementa ProductCache
│   ├── search/
│   │   └── meilisearch-adapter.ts            # Implementa CatalogSearch (futuro)
│   └── queue/
│       └── catalog-queue.service.ts          # BullMQ jobs
│
└── presentation/                      # PRESENTATION LAYER — HTTP handlers
    ├── controllers/
    │   ├── products.controller.ts
    │   ├── categories.controller.ts
    │   └── brands.controller.ts
    ├── dto/
    │   ├── create-product.dto.ts              # Request validation
    │   ├── update-product.dto.ts
    │   ├── product-response.dto.ts            # Response serialization
    │   ├── product-list-query.dto.ts          # Query params (pagination, filters)
    │   └── product-list-response.dto.ts
    ├── guards/
    │   └── product-owner.guard.ts
    ├── interceptors/
    │   └── product-cache.interceptor.ts
    └── decorators/
        └── product.decorator.ts
```

---

## 3. Flujo de una Request Completa

```
Request HTTP
  │
  ▼
[NestJS Middleware] → TenantMiddleware (inyecta tenant_id)
  │
  ▼
[Guards Globales] → JwtAuthGuard, ThrottlerGuard
  │
  ▼
[NestJS Pipes] → ValidationPipe (Zod / class-validator)
  │
  ▼
[Controller] → ProductsController.create()
  │  Recibe DTO validado, delega en Handler
  │
  ▼
[Command Handler] → CreateProductHandler.execute()
  │  1. Valida reglas de negocio (SKU único, precio > 0)
  │  2. Crea entidad Product (domain)
  │  3. Persiste via Repository interface
  │  4. Publica evento ProductCreated
  │  5. Devuelve resultado
  │
  ▼
[Repository (Interface)] → ProductRepository.save(product)
  │  (llamada polimórfica a la implementación concreta)
  │
  ▼
[Prisma Repository] → PrismaProductRepository.save()
  │  Usa Prisma Client para persistir en PostgreSQL
  │
  ▼
[Event Bus] → ProductCreated event → BullMQ queue
  │  Dispara jobs asíncronos (invalidar caché, notificar, etc.)
  │
  ▼
[Controller] → Envía response HTTP
```

---

## 4. Inyección de Dependencias (NestJS DI)

```typescript
// 1. Interface en Domain (puerto)
// modules/catalog/domain/repositories/product-repository.interface.ts
export interface ProductRepository {
  save(product: Product): Promise<void>;
  findBySku(sku: Sku): Promise<Product | null>;
  findAll(query: ProductQuery): Promise<PaginatedResult<Product>>;
  delete(id: string): Promise<void>;
}

// 2. Implementación en Infrastructure
// modules/catalog/infrastructure/persistence/prisma-product.repository.ts
@Injectable()
export class PrismaProductRepository implements ProductRepository {
  constructor(private prisma: PrismaService) {}

  async save(product: Product): Promise<void> {
    await this.prisma.product.upsert({ ... });
  }
  // ...
}

// 3. Registro en Módulo
// modules/catalog/catalog.module.ts
@Module({
  controllers: [ProductsController],
  providers: [
    CreateProductHandler,
    GetProductBySkuHandler,
    { provide: 'ProductRepository', useClass: PrismaProductRepository },
  ],
})
export class CatalogModule {}
```

---

## 5. Módulos del Backend (Lista Completa)

| Módulo | Bounded Context | Aggregate Root Principal |
|--------|----------------|------------------------|
| **Auth** | Autenticación y autorización | User |
| **Catalog** | Productos, categorías, marcas, SKU | Product |
| **Inventory** | Stock, movimientos, almacenes | Stock, InventoryMovement |
| **Orders** | Ventas, carrito, checkout, envíos | Order |
| **Purchases** | Compras a proveedores | PurchaseOrder |
| **CRM** | Clientes, segmentos, scoring | Customer |
| **Finances** | Caja, transacciones, facturación | CashRegister, Transaction |
| **CMS** | Páginas, SEO, temas, banners | Page |
| **Marketing** | Cupones, campañas, descuentos | Coupon, Campaign |
| **Analytics** | Reportes, dashboards, métricas | (solo lectura) |
| **Configuration** | Impuestos, métodos pago, settings | Config |
| **Users** | Usuarios del sistema (staff) | SystemUser |
| **Roles** | Roles y permisos granulares | Role, Permission |
| **Integrations** | Webhooks, APIs externas, sync | Integration |

---

## 6. Domain Events (Event Bus)

### Arquitectura de Eventos

```
Command Handler → Domain Event → Event Bus → Handlers
                                              │
                          ┌───────────────────┼───────────────────┐
                          ▼                   ▼                   ▼
                    ┌────────────┐     ┌────────────┐     ┌────────────┐
                    │  Invalidate │     │  Send      │     │  Update     │
                    │  Cache     │     │  Email     │     │  Analytics  │
                    └────────────┘     └────────────┘     └────────────┘
```

### Eventos por Módulo

| Módulo | Evento | Disparadores |
|--------|-------|-------------|
| **Catalog** | `ProductCreated` | Creación de producto |
| | `ProductUpdated` | Modificación de datos |
| | `ProductPriceChanged` | Cambio de precio |
| | `ProductStatusChanged` | Activación/desactivación |
| **Inventory** | `StockReserved` | Checkout iniciado |
| | `StockConfirmed` | Pago confirmado |
| | `StockDecreased` | Venta completada |
| | `StockIncreased` | Devolución o compra |
| | `LowStockDetected` | Stock por debajo del mínimo |
| | `StockAlertTriggered` | Alerta de stock |
| **Orders** | `OrderCreated` | Nueva orden |
| | `OrderConfirmed` | Pago recibido |
| | `OrderShipped` | Envío registrado |
| | `OrderDelivered` | Entrega confirmada |
| | `OrderCancelled` | Cancelación |
| | `OrderRefunded` | Reembolso |
| **CRM** | `CustomerCreated` | Nuevo registro |
| | `CustomerTierChanged` | Cambio de nivel |
| | `CustomerActivity` | Compra, login, etc. |
| **Finances** | `PaymentReceived` | Cobro registrado |
| | `PaymentRefunded` | Reembolso |
| | `CashRegisterOpened` | Apertura de caja |
| | `CashRegisterClosed` | Cierre de caja |
| **Purchases** | `PurchaseOrderCreated` | Nueva orden de compra |
| | `PurchaseOrderReceived` | Recepción de mercadería |

---

## 7. Manejo de Errores (Domain Errors)

### Jerarquía de errores

```
DomainError (abstract)
├── BusinessRuleViolation
│   ├── DuplicateSkuError
│   ├── InsufficientStockError
│   ├── InvalidOrderStatusTransitionError
│   ├── NegativePriceError
│   └── InvalidDiscountError
├── NotFoundError
│   ├── ProductNotFoundError
│   ├── CustomerNotFoundError
│   ├── OrderNotFoundError
│   └── SkuNotFoundError
└── UnauthorizedError
    ├── InsufficientPermissionsError
    └── InvalidTenantError
```

### Flujo de error

```
Domain Service lanza DomainError
  → Handler captura y convierte a HttpException
  → Exception Filter global captura y formatea response
  → Audit Interceptor registra en log
```

### Formato de respuesta de error

```json
{
  "success": false,
  "error": {
    "code": "DUPLICATE_SKU",
    "message": "El SKU ELE-SAM-WIRE-001 ya existe para este tenant",
    "details": {
      "sku": "ELE-SAM-WIRE-001",
      "existingProductId": "prod_abc123"
    }
  },
  "timestamp": "2026-07-29T10:30:00Z",
  "requestId": "req_xyz789"
}
```

---

## 8. Casos de Uso (Commands & Queries)

### Patrón Command

```typescript
// Command
export class CreateProductCommand {
  constructor(
    public readonly sku: string,
    public readonly name: string,
    public readonly description: string,
    public readonly price: number,
    public readonly categoryId: string,
    public readonly brandId: string,
    public readonly weight: number,
    public readonly tenantId: string,
    public readonly userId: string,
  ) {}
}

// Handler
@Injectable()
export class CreateProductHandler implements ICommandHandler<CreateProductCommand> {
  constructor(
    @Inject('ProductRepository')
    private readonly productRepository: ProductRepository,
    @Inject('SkuGenerator')
    private readonly skuGenerator: SkuGeneratorService,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: CreateProductCommand): Promise<ProductResponse> {
    const sku = Sku.create(command.sku);  // Value Object con validación
    const price = Price.create(command.price, 'USD');

    // Validar negocio
    const existing = await this.productRepository.findBySku(sku);
    if (existing) throw new DuplicateSkuError(sku);

    // Crear entidad
    const product = Product.create({
      sku,
      name: command.name,
      price,
      categoryId: command.categoryId,
      brandId: command.brandId,
      tenantId: command.tenantId,
    });

    // Persistir
    await this.productRepository.save(product);

    // Publicar evento
    this.eventBus.publish(new ProductCreatedEvent(product));

    return ProductResponse.fromEntity(product);
  }
}
```

### Patrón Query

```typescript
@Injectable()
export class GetProductBySkuHandler implements IQueryHandler<GetProductBySkuQuery> {
  constructor(
    @Inject('ProductRepository')
    private readonly productRepository: ProductRepository,
    @Inject('ProductCache')
    private readonly cache: ProductCachePort,
  ) {}

  async execute(query: GetProductBySkuQuery): Promise<ProductResponse> {
    const cached = await this.cache.get(query.sku);
    if (cached) return cached;

    const sku = Sku.create(query.sku);
    const product = await this.productRepository.findBySku(sku);
    if (!product) throw new ProductNotFoundError(sku);

    const response = ProductResponse.fromEntity(product);
    await this.cache.set(query.sku, response, 300); // TTL 5 min
    return response;
  }
}
```

---

## 9. Colas y Procesamiento Asíncrono (BullMQ)

### Colas Definidas

| Cola | Propósito | Jobs | Prioridad |
|------|-----------|------|-----------|
| `notifications` | Emails, WhatsApp, SMS | `order-confirmation`, `password-reset`, `stock-alert` | Alta |
| `inventory` | Operaciones de stock | `reserve-stock`, `confirm-stock`, `release-stock` | Crítica |
| `cache` | Invalidación de caché | `invalidate-product-cache`, `invalidate-page-cache` | Alta |
| `reports` | Generación de reportes | `generate-daily-sales`, `generate-monthly-report` | Baja |
| `integrations` | Sincronización externa | `sync-with-erp`, `sync-with-shipping` | Media |
| `audit` | Registro de auditoría | `log-audit-entry` | Baja |
| `default` | Tareas generales | `cleanup-temp-files`, `process-import` | Baja |

### Ejemplo de Job

```typescript
// infrastructure/queue/orders-queue.service.ts
@Injectable()
export class OrdersQueueService {
  constructor(@InjectQueue('notifications') private queue: Queue) {}

  async sendOrderConfirmation(order: Order): Promise<void> {
    await this.queue.add(
      'order-confirmation',
      {
        orderId: order.id,
        tenantId: order.tenantId,
        customerEmail: order.customerEmail,
      },
      {
        attempts: 3,
        backoff: { type: 'exponential', delay: 2000 },
        removeOnComplete: true,
      },
    );
  }
}
```

---

## 10. Middlewares Globales

| Middleware | Propósito | Orden |
|-----------|-----------|-------|
| **TenantMiddleware** | Resuelve tenant_id del subdominio/header, lo inyecta en Prisma y contexto | 1 |
| **LoggingMiddleware** | Registra request method, path, duración, tenant | 2 |
| **CorsMiddleware** | Configura CORS | 0 |
| **HelmetMiddleware** | Seguridad de headers | 0 |

### Tenant Middleware (detalle)

```typescript
@Injectable()
export class TenantMiddleware implements NestMiddleware {
  constructor(
    private prisma: PrismaService,
    private cache: CacheService,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    // 1. Extraer tenant del subdominio
    const host = req.headers.host;
    const subdomain = host.split('.')[0];

    // 2. Buscar en caché o DB
    const cacheKey = `tenant:${subdomain}`;
    let tenant = await this.cache.get(cacheKey);
    if (!tenant) {
      tenant = await this.prisma.tenant.findUnique({ where: { slug: subdomain } });
      if (tenant) await this.cache.set(cacheKey, tenant, 3600);
    }

    if (!tenant) throw new NotFoundException('Tenant not found');

    // 3. Inyectar en request para uso posterior
    req['tenant'] = tenant;

    // 4. Inyectar en Prisma via middleware (RLS)
    await this.prisma.$executeRawUnsafe(
      `SELECT set_config('app.tenant_id', $1, true)`, [tenant.id]
    );

    next();
  }
}
```

---

## 11. Prisma Service + Middleware Multi-Tenant

```typescript
// core/infrastructure/database/prisma.service.ts
@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor() {
    super({
      log: ['query', 'info', 'warn', 'error'],
    });

    // Middleware global: inyecta tenant_id en toda operación
    this.$use(async (params, next) => {
      const tenantId = getCurrentTenantId(); // De AsyncLocalStorage

      if (tenantId && params.model && this.isTenantScoped(params.model)) {
        if (params.action === 'create') {
          params.args.data['tenantId'] = tenantId;
        } else if (params.action === 'findUnique' || params.action === 'findMany') {
          params.args.where = { ...params.args.where, tenantId };
        }
      }

      return next(params);
    });
  }

  private tenantScopedModels = ['Product', 'Order', 'Customer', 'Stock', /* ... */];

  private isTenantScoped(model: string): boolean {
    return this.tenantScopedModels.includes(model);
  }
}
```

---

## 12. Manejo de Transacciones

```typescript
// application/commands/create-order/create-order.handler.ts
async execute(command: CreateOrderCommand): Promise<OrderResponse> {
  return this.prisma.$transaction(async (tx) => {
    // 1. Validar stock (vía domain service)
    const stockValidation = await this.stockValidator.validate(
      command.items.map((i) => ({ sku: i.sku, quantity: i.quantity })),
    );
    if (!stockValidation.isValid) throw new InsufficientStockError(stockValidation);

    // 2. Crear orden
    const order = Order.create(command);

    // 3. Reservar stock (evento)
    this.eventBus.publish(new StockReservedEvent(order));

    // 4. Persistir orden
    await tx.order.create({ data: order.toPersistence() });

    return OrderResponse.fromEntity(order);
  });
}
```

---

## 13. Configuración (Environment Variables)

```env
# .env.example

# App
NODE_ENV=development
PORT=4000
API_PREFIX=/api/v1

# Database
DATABASE_URL=postgresql://user:pass@localhost:5432/tienda
DATABASE_URL_REPLICA=postgresql://user:pass@replica:5432/tienda

# Redis
REDIS_URL=redis://localhost:6379

# JWT
JWT_SECRET=
JWT_EXPIRES_IN=15m
JWT_REFRESH_SECRET=
JWT_REFRESH_EXPIRES_IN=7d

# Storage
R2_ENDPOINT=
R2_ACCESS_KEY=
R2_SECRET_KEY=
R2_BUCKET=tienda-assets

# Email
SMTP_HOST=
SMTP_PORT=587
SMTP_USER=
SMTP_PASS=

# Rate Limiting
THROTTLE_TTL=60
THROTTLE_LIMIT=100

# BullMQ
REDIS_QUEUE_URL=redis://localhost:6379/1

# Monitoring
SENTRY_DSN=
OTEL_EXPORTER_OTLP_ENDPOINT=
```
