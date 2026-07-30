# Queue Module — Infraestructura de Colas BullMQ

Módulo completamente desacoplado para la gestión de colas de procesamiento basado en BullMQ + Redis.

---

## 1. Árbol del Módulo

```
src/core/queue/
├── index.ts                          # Barrel export público
├── queue.module.ts                   # Módulo NestJS @Global()
├── README.md                         # Documentación
│
├── config/
│   └── index.ts                      # QueueConfigurationFactory
│
├── bull/
│   ├── index.ts                      # Barrel
│   ├── bull-connection.factory.ts    # Conexión Redis para BullMQ
│   ├── bull-queue.adapter.ts         # Adaptador BullMQ → IQueueAdapter
│   ├── bull-job.adapter.ts           # Adaptador BullMQ → IJobAdapter
│   └── bull-worker.adapter.ts        # Adaptador BullMQ → IWorkerAdapter
│
├── providers/
│   └── index.ts                      # Factory providers para DI
│
├── interfaces/
│   ├── index.ts                      # Barrel
│   ├── queue-adapter.interface.ts    # IQueueAdapter
│   ├── job-adapter.interface.ts      # IJobAdapter<T>
│   ├── worker-adapter.interface.ts   # IWorkerAdapter
│   ├── processor.interface.ts        # IProcessor<T, R>
│   ├── queue-manager.interface.ts    # IQueueManager
│   ├── queue-service.interface.ts    # IQueueService
│   ├── retry-strategy.interface.ts   # IRetryStrategy
│   └── bull-connection.interface.ts  # IBullConnectionFactory
│
├── services/
│   ├── index.ts                      # Barrel
│   ├── queue-manager.service.ts      # Gestión del ciclo de vida de colas
│   ├── queue.service.ts              # Fachada de alto nivel para operaciones
│   └── worker-manager.service.ts     # Gestión del ciclo de vida de workers
│
├── processors/
│   ├── index.ts                      # Barrel
│   └── base.processor.ts             # Procesador base abstracto
│
├── workers/
│   ├── index.ts                      # Barrel
│   └── base.worker.ts                # Worker base abstracto
│
├── jobs/
│   ├── index.ts                      # Barrel
│   └── abstract.job.ts               # Job abstracto
│
├── health/
│   ├── index.ts                      # Barrel
│   └── queue-health.service.ts       # Health checks de colas
│
├── constants/
│   ├── index.ts                      # Barrel
│   ├── queue-tokens.ts               # Tokens de DI
│   ├── queue-defaults.ts             # Valores por defecto
│   └── queue-error-codes.ts          # Códigos de error
│
├── exceptions/
│   ├── index.ts                      # Barrel
│   ├── queue-unavailable.exception.ts
│   ├── job-timeout.exception.ts
│   ├── job-failed.exception.ts
│   ├── serialization-error.exception.ts
│   ├── worker-error.exception.ts
│   └── configuration-error.exception.ts
│
├── types/
│   ├── index.ts                      # Barrel
│   ├── queue.types.ts                # Tipos de cola y opciones
│   ├── job.types.ts                  # Tipos de job
│   ├── worker.types.ts               # Tipos de worker
│   ├── retry.types.ts                # Tipos de reintentos
│   └── health.types.ts               # Tipos de health check
│
└── utils/
    ├── index.ts                      # Barrel
    ├── retry-strategy.ts             # Estrategias de reintento
    ├── backoff-strategy.ts           # Estrategias de backoff
    └── job-metadata.decorator.ts     # Decorador de metadatos para jobs
```

---

## 2. Explicación de cada carpeta

| Carpeta | Propósito |
|---------|-----------|
| `config/` | Fábrica de configuración. Lee `@tienda/config` y expone `QueueConfigurationFactory`. |
| `bull/` | **Único punto de contacto con BullMQ.** Contiene adaptadores que implementan las interfaces del módulo. Aislar BullMQ aquí permite reemplazarlo sin modificar el resto. |
| `providers/` | Proveedores NestJS para registrar conexiones y dependencias en el contenedor DI. |
| `interfaces/` | Contratos abstractos. Ningún servicio fuera de `bull/` depende de BullMQ. |
| `services/` | Servicios inyectables: `QueueManager` (crear/obtener/eliminar colas), `QueueService` (fachada de operaciones), `WorkerManager` (crear/detener workers). |
| `processors/` | `BaseProcessor<T,R>` — clase base abstracta para implementar procesadores de jobs. |
| `workers/` | `BaseWorker` — clase base abstracta para implementar workers con soporte de ciclo de vida. |
| `jobs/` | `AbstractJob<T>` — clase base abstracta para definir jobs sin implementar lógica de negocio. |
| `health/` | `QueueHealthService` — verifica Redis, colas y workers. |
| `constants/` | Tokens de DI, valores por defecto, códigos de error. |
| `exceptions/` | Jerarquía de excepciones del módulo Queue que extienden `AppException`. |
| `types/` | Tipos compartidos: opciones de cola, job, worker, retry, health. |
| `utils/` | Utilidades: fábricas de retry/backoff, decorador de metadatos. |

---

## 3. Flujo de ejecución de Jobs

```
1. Defines un Job con AbstractJob<T>
2. Defines un Processor con BaseProcessor<T,R>
3. Registras la Cola en QueueManager
4. Registras el Worker en WorkerManager (usa el Processor)
5. Encolas con QueueService.add('cola', 'jobName', data)
6. BullMQ Worker recoge el job y ejecuta Processor.process()
7. El resultado se persiste en Redis
8. QueueHealthService monitorea el estado
```

```
[QueueService] → [QueueManager] → [BullQueueAdapter] → [BullMQ Queue] → [Redis]
                                                                              ↓
[WorkerManager] → [BullWorkerAdapter] → [BullMQ Worker] → [BaseProcessor.process()]
```

La infraestructura NO implementa jobs concretos. Los pasos 1-4 corresponden a fases posteriores.

---

## 4. Estrategia de Workers

- **BaseWorker**: clase abstracta que implementa `start()`, `stop()`, `pause()`, `resume()`.
- **WorkerManager**: gestiona el ciclo de vida de múltiples workers.
- **Configuración**: cada worker define su `queueName` y `concurrency`.
- **Adaptador**: `BullWorkerAdapter` envuelve `BullMQ.Worker` y expone solo `IWorkerAdapter`.
- **Parada graceful**: `WorkerManagerService.onApplicationShutdown()` detiene todos los workers.

Los workers se crean bajo demanda mediante:

```typescript
workerManager.createWorker('emails', processor, { concurrency: 5 });
```

O mediante extensiones de BaseWorker:

```typescript
class EmailWorker extends BaseWorker {
  queueName = 'emails';
  concurrency = 5;
  process(job: IJobAdapter) { ... }
}
```

---

## 5. Estrategia de Retries

Configurable mediante `IRetryStrategy`:

- **ExponentialBackoffStrategy**: retardos exponenciales `delay * factor^(attempt-1)` con `maxDelay`.
- **FixedBackoffStrategy**: retardo constante entre reintentos.
- **CustomRetryStrategy**: control total mediante `RetryOptions`.
- **createRetryStrategy(config)**: fábrica que selecciona la estrategia según `config.backoff.type`.

Valores por defecto:
- `maxAttempts: 3`
- `backoff.type: 'exponential'`
- `backoff.delay: 1000ms`
- `maxDelay: 30_000ms`
- `factor: 2`

Todos estos valores son reemplazables por cola o por job individual.

```typescript
const strategy = new ExponentialBackoffStrategy({ delay: 2000, maxDelay: 60_000 });
queue.add('job', data, { attempts: 5, backoff: strategy.getBackoff() });
```

---

## 6. Estrategia de Backoff

BullMQ soporta `fixed` y `exponential` nativamente:

```typescript
export interface BackoffOptions {
  type: 'fixed' | 'exponential';
  delay: number;
}
```

El módulo expone utilidades:

- `calculateBackoffDelay(backoff, attempt)` — cálculo manual del delay.
- `createBullBackoff(config)` — transforma `BackoffStrategyConfig` a formato BullMQ.
- `resolveBackoff(backoff?)` — helper seguro con `undefined`.

Estrategia por defecto: exponencial con delay inicial de 1s, duplicando en cada intento hasta 30s máximo.

---

## 7. Estrategia de Concurrencia

- **Por worker**: `BaseWorker.concurrency` define el número de jobs simultáneos.
- **Rate limiting**: `WorkerOptions.limiter = { max: number, duration: number }` limita la tasa.
- **Prioridades**: `JobOptions.priority` (0-2,097,151) permite priorización.
- **Valor por defecto**: `concurrency: 5`.

```typescript
manager.createWorker('exports', processor, {
  concurrency: 3,
  limiter: { max: 10, duration: 1000 },
});
```

BullMQ gestiona internamente la concurrencia mediante Redis. No se requiere infraestructura adicional.

---

## 8. Integración con Redis

- **Conexión dedicada**: `BullConnectionFactory` crea un cliente `ioredis` exclusivo para BullMQ.
- **Configuración**: hereda de `@tienda/config/queueConfig()` (redis URL, prefix).
- **Health check**: `QueueHealthService.checkRedis()` verifica conectividad y latencia.
- **Graceful shutdown**: `BullConnectionFactory.onApplicationShutdown()` cierra la conexión.
- **Reintentos de conexión**: retryStrategy exponencial hasta 10 intentos.
- **Aislamiento**: las colas BullMQ usan Redis DB separada (configurable via `QUEUE_REDIS_URL`).

No comparte la conexión Redis con el módulo cache para evitar interferencias.

---

## 9. Recomendaciones

1. **Usar `QUEUE_REDIS_URL`** para aislar la base de datos Redis de colas de la de cache.
2. **Configurar `removeOnComplete` y `removeOnFail`** para evitar acumulación de jobs en Redis.
3. **Monitorear con `QueueHealthService.checkAll()`** periódicamente.
4. **Definir `concurrency`** según el tipo de job (I/O intensivo > alto, CPU intensivo > bajo).
5. **Usar `BaseWorker`** en lugar de `WorkerManager.createWorker()` cuando se necesite inyección de dependencias.
6. **Configurar `lockDuration`** igual al timeout esperado del job más un margen.
7. **No registrar colas de negocio en el módulo Queue** — hacerlo en los módulos de dominio correspondientes.
8. **Ejecutar `initialize()`** de `QueueManagerService` durante el bootstrap de la aplicación.

---

## 10. Riesgos detectados

| Riesgo | Impacto | Mitigación |
|--------|---------|------------|
| Redis no disponible | Caída total de colas | `QueueUnavailableException` con HTTP 503. Health check alerta temprana. |
| Jobs huérfanos por worker caído | Procesamiento incompleto | BullMQ stalled interval detection + reintentos automáticos. |
| Acumulación de jobs en Redis | Memoria agotada | `removeOnComplete`/`removeOnFail` configurados por defecto. |
| Contención de conexión Redis | Degradación de performance | Conexión dedicada para BullMQ, no compartida con cache. |
| Dead letter queue no implementada | Jobs fallidos sin registro | Previsto para fase posterior mediante patrón DLQ. |
| Sin autenticación en colas | Acceso no autorizado | Redis ACL + TLS preparados para activación futura. |
| Timeout de jobs | Jobs bloqueados indefinidamente | `lockDuration` (por defecto 30s) + `lockRenewTime` (15s). |
| Dependencia de ioredis | Vendor lock-in en Redis | Abstraído tras `IBullConnectionFactory`. Reemplazable. |
| Sin límite de reintentos | Jobs fallidos reintentando infinitamente | `maxAttempts: 3` por defecto, configurable por cola/job. |
| Escalado horizontal | Múltiples instancias procesando mismos jobs | BullMQ maneja coordinación via Redis (sin duplicados). |

---

## Notas de implementación

- **BullMQ está aislado en `bull/`**. Toda interacción externa con colas usa interfaces (`IQueueAdapter`, `IJobAdapter`, etc.).
- **No hay jobs del negocio implementados**. Esta fase es exclusivamente infraestructura.
- **El módulo es `@Global()`** y está importado en `CoreModule`.
- **TypeScript strict** habilitado: `noUncheckedIndexedAccess`, `noImplicitOverride`, `noPropertyAccessFromIndexSignature`.
- **Logger**: usa `Logger` de `@nestjs/common` por consistencia con el resto del core.
- **Errores**: todas las excepciones heredan de `AppException` y son capturadas por `GlobalExceptionFilter`.
