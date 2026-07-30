# ADR-005: Redis como Cache + Colas

## Contexto

La plataforma necesita caching, colas de procesamiento, y pub/sub.

## Problema

Elegir una solución que unifique cache, colas y mensajería.

## Alternativas

| Alternativa | Pros | Contras |
|-------------|------|---------|
| **Redis** | Multipropósito (cache, colas, pub/sub), rápido, popular | En memoria (RAM) |
| **Memcached** | Simple, rápido | Solo cache, sin persistencia |
| **RabbitMQ** | Colas maduras, routing complejo | Infraestructura separada |
| **Kafka** | Streaming, persistencia, escalabilidad | Overkill para el proyecto actual |

## Decisión

Redis 7 para los tres propósitos, con conexiones separadas.

## Consecuencias

- Conexión Redis dedicada para BullMQ (aislada de cache)
- ioredis como cliente con retry exponencial
- Namespaces con prefijo (`tienda:cache:`, `tienda:queue:`, etc.)
- Estrategias de expiración: TTL, sliding, absolute, none
- 7 namespaces definidos: app, cache, queue, session, lock, config, rate-limit, pubsub
- Health check con PING + latencia
