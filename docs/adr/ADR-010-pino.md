# ADR-010: Pino para Logging

## Contexto

La plataforma necesita logging estructurado, eficiente y con buen soporte para JSON.

## Problema

Elegir un logger que sea rápido, estructurado (JSON), y con buen ecosistema NestJS.

## Alternativas

| Alternativa | Pros | Contras |
|-------------|------|---------|
| **Pino** | Más rápido, JSON nativo, ecosistema | Configuración verbosa |
| **Winston** | Popular, transports flexibles | Más lento, configuración compleja |
| **Bunyan** | JSON nativo | Mantenimiento reducido |
| **console.log** | Simple, sin dependencias | Sin estructura, sin niveles |

## Decisión

Pino 9+ como logger principal, envuelto en módulo NestJS.

## Consecuencias

- `@tienda/logger` package con `LOGGER_TOKEN` Symbol
- LoggerModule re-exporta desde packages
- Salida JSON estructurada (production) o pretty-print (dev)
- Niveles: fatal, error, warn, info, debug, trace
- Request logging via interceptor con requestId y correlationId
- Contexto automático (módulo, clase, método)
- Compatible con NestJS Logger y Pino
