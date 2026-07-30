# ADR-006: BullMQ para Colas de Procesamiento

## Contexto

La plataforma requiere procesamiento asíncrono (emails, reportes, notificaciones).

## Problema

Elegir un sistema de colas que funcione sobre Redis, con soporte de workers, reintentos, y scheduling.

## Alternativas

| Alternativa | Pros | Contras |
|-------------|------|---------|
| **BullMQ** | Redis-based, workers, scheduling, rate-limit | Dependencia de Redis |
| **RabbitMQ** | Routing maduro | Infraestructura adicional |
| **In-process** | Simple, sin dependencias | Sin persistencia, sin workers |
| **SQS** | Serverless, escalable | Vendor lock-in AWS |

## Decisión

BullMQ 5+ con adaptadores desacoplados.

## Consecuencias

- BullMQ aislado tras interfaces en `bull/` directory
- `BaseWorker`, `BaseProcessor`, `AbstractJob` como clases base
- Estrategias de retry: exponential, fixed, custom
- Backoff configurable por cola/job
- Conexión Redis dedicada (no compartida con cache)
- `QueueHealthService` para monitoreo
- 7 colas planificadas: emails, notifications, reports, exports, imports, audit, webhooks
- Sin dead letter queue aún (planificado para fase posterior)
