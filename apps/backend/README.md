# @tienda/backend

Backend NestJS con Clean Architecture + DDD para plataforma ERP + Ecommerce.

---

## Árbol del Backend

```
src/
├── main.ts                    # Bootstrap: global prefix, CORS, versioning, graceful shutdown
├── app.module.ts              # Módulo raíz: importa CoreModule + HealthModule
│
├── config/                    # Configuración modular (NestJS ConfigModule)
│   ├── app.config.ts          # Puerto, entorno, prefijo
│   ├── database.config.ts     # PostgreSQL conexiones
│   ├── redis.config.ts        # Redis conexión
│   ├── jwt.config.ts          # JWT + refresh tokens
│   ├── storage.config.ts      # Cloudflare R2 / S3
│   ├── mail.config.ts         # SMTP
│   ├── queue.config.ts        # BullMQ Redis
│   └── cache.config.ts        # Cache TTL
│
├── core/                      # Núcleo técnico (infraestructura global)
│   ├── core.module.ts         # Módulo @Global que exporta todos los submódulos
│   ├── logger/                # Sistema de logging (Pino-ready)
│   ├── database/              # PrismaService + DatabaseModule
│   ├── cache/                 # CacheModule (Redis)
│   ├── events/                # EventBusModule (domain events)
│   ├── queues/                # QueueModule (BullMQ)
│   ├── storage/               # StorageModule (R2/S3)
│   ├── mail/                  # MailModule (email)
│   └── security/              # SecurityModule (encryption, hashing)
│
├── common/                    # Recursos reutilizables entre capas
│   ├── decorators/            # Custom decorators
│   ├── guards/                # Guards (auth, roles, permissions)
│   ├── filters/               # Exception filters (HttpException, DomainError)
│   ├── interceptors/          # Interceptors (logging, transform, timeout)
│   ├── middlewares/           # Middlewares (tenant, logging)
│   ├── pipes/                 # Pipes (ZodValidation)
│   ├── exceptions/            # DomainError base
│   ├── constants/             # Constantes de la app
│   ├── interfaces/            # Interfaces genéricas
│   ├── types/                 # Tipos compartidos
│   └── utils/                 # Utilidades
│
├── domain/                    # Capa de dominio (DDD Core)
│   ├── entities/              # Entidades de dominio
│   ├── value-objects/         # Value Objects inmutables
│   ├── repositories/          # Interfaces de repositorios (ports)
│   ├── services/              # Servicios de dominio
│   ├── events/                # Domain events
│   ├── exceptions/            # Excepciones de dominio
│   ├── specifications/        # Specifications pattern
│   └── factories/             # Domain factories
│
├── application/               # Capa de aplicación (casos de uso)
│   ├── commands/              # Comandos CQRS
│   ├── queries/               # Consultas CQRS
│   ├── handlers/              # Command/Query handlers
│   ├── dto/                   # Data Transfer Objects
│   ├── mappers/               # Mappers entre capas
│   ├── services/              # Servicios de aplicación
│   ├── ports/                 # Puertos de entrada/salida
│   └── use-cases/             # Casos de uso (orquestación)
│
├── infrastructure/            # Implementaciones concretas
│   ├── database/              # Prisma repositories
│   ├── repositories/          # Repositorios concretos
│   ├── cache/                 # Redis cache implementations
│   ├── storage/               # R2/S3 file storage
│   ├── http/                  # HTTP clients (axios, etc.)
│   ├── messaging/             # Messaging (RabbitMQ, etc.)
│   └── persistence/           # DB migrations, seeds
│
├── modules/                   # Módulos de negocio (Bounded Contexts)
│   ├── auth/                  # Autenticación y autorización
│   ├── users/                 # Gestión de usuarios
│   ├── products/              # Catálogo de productos
│   ├── inventory/             # Stock y movimientos
│   ├── purchases/             # Compras a proveedores
│   ├── sales/                 # Ventas y pedidos
│   ├── customers/             # Clientes
│   ├── suppliers/             # Proveedores
│   ├── finance/               # Finanzas y contabilidad
│   ├── cash/                  # Caja diaria
│   ├── crm/                   # CRM y segmentación
│   ├── cms/                   # Páginas y contenido
│   ├── marketing/             # Cupones y campañas
│   ├── analytics/             # Reportes y métricas
│   ├── notifications/         # Notificaciones
│   ├── audit/                 # Auditoría
│   ├── settings/              # Configuración del sistema
│   └── integrations/          # Integraciones externas
│
├── shared/                    # Código compartido entre módulos
│
└── modules/health/            # Health check (endpoint /health)
    ├── health.module.ts
    └── health.controller.ts
```

---

## Flujo de Dependencias

```
main.ts
  └── AppModule
        ├── ConfigModule (global)
        ├── CoreModule (global)
        │    ├── LoggerModule
        │    ├── DatabaseModule
        │    ├── CacheModule
        │    ├── EventBusModule
        │    ├── QueueModule
        │    ├── StorageModule
        │    ├── MailModule
        │    └── SecurityModule
        └── HealthModule
```

### Dependencia entre Capas (Clean Architecture)

```
Presentation (Controllers, DTOs)
    │  depende de
    ▼
Application (Commands, Queries, Handlers)
    │  depende de (interfaces)
    ▼
Domain (Entities, Value Objects, Repository Interfaces)
    │  implementa
    ▼
Infrastructure (Prisma Repositories, Cache, HTTP clients)
```

**Reglas:**
- Domain NO importa de Infrastructure ni Application
- Application NO importa de Infrastructure (solo interfaces)
- Infrastructure implementa interfaces de Domain
- Modules importan de Core, Common, Domain, Application, Infrastructure

---

## Convenciones de Importación

```typescript
// Preferir path aliases sobre rutas relativas
import { PrismaService } from '@core/database/prisma.service';
import { DomainError } from '@common/exceptions/domain-error.exception';
import { ZodValidationPipe } from '@common/pipes/validation.pipe';
import { ProductsModule } from '@modules/products/products.module';
```

| Alias | Path real |
|-------|-----------|
| `@core/*` | `src/core/*` |
| `@common/*` | `src/common/*` |
| `@modules/*` | `src/modules/*` |
| `@domain/*` | `src/domain/*` |
| `@application/*` | `src/application/*` |
| `@infrastructure/*` | `src/infrastructure/*` |
| `@config/*` | `src/config/*` |
| `@shared/*` | `src/shared/*` |

---

## Reglas Arquitectónicas

1. **Unidireccionalidad**: Las dependencias apuntan hacia el dominio. Infrastructure → Domain, nunca al revés.
2. **Módulos atómicos**: Cada módulo de negocio es un NestJS Module independiente. No se importan entre sí directamente; se comunican via eventos.
3. **Sin lógica en controladores**: Los controllers solo reciben requests, validan entrada y delegan en handlers.
4. **Validación con Zod**: Toda entrada de usuario se valida con ZodSchema en el controller.
5. **Repository Pattern**: Domain define interfaces, Infrastructure implementa. Domain no conoce Prisma.
6. **Domain Events**: Los módulos se comunican via eventos (EventBus). No hay imports directos entre módulos de negocio.
7. **Pruebas**: Unit tests para Domain, integration tests para Application, E2E para Presentation.

---

## Estrategia para Agregar Nuevos Módulos

1. Crear carpeta en `modules/<nombre>/`
2. Crear `<nombre>.module.ts` con decorador `@Module`
3. Definir estructura: `domain/`, `application/`, `infrastructure/`, `presentation/`
4. Agregar `controllers`, `providers` y `exports` en el módulo
5. Importar el módulo en `AppModule` solo si es necesario globalmente
6. Los módulos de negocio se cargan lazy o por feature flags (futuro)

---

## Riesgos Detectados

| Riesgo | Mitigación |
|--------|-----------|
| Acoplamiento entre módulos vía imports directos | Usar EventBus. Los módulos no se importan entre sí. |
| PrismaService como dependencia global puede crear bottleneck | Usar módulo de base de datos con pool de conexiones configurable. |
| Crecimiento de carpetas domain/application/infrastructure | Seguir vertical slices por módulo. Cada módulo tiene su propio domain/. |
| Path aliases pueden confundir a IDEs | tsconfig.json con paths. NestJS CLI respeta los aliases. |

---

## Recomendaciones

1. **Iniciar con 3 módulos core**: auth, products, sales. Los demás se agregan cuando el negocio los requiera (YAGNI).
2. **No conectar Redis/Prisma hasta tener el primer caso de uso listo**.
3. **Mantener los Value Objects inmutables** y auto-validantes desde el día 1.
4. **Documentar cada Domain Event** en un registro centralizado de eventos.
5. **No crear un módulo genérico "common" de negocio**. Cada módulo tiene su propio domain/.
