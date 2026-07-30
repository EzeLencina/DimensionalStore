# ADR-001: NestJS como Framework Backend

## Contexto

Se necesita un framework backend para construir una plataforma empresarial con múltiples módulos, inyección de dependencias, y soporte para Clean Architecture.

## Problema

Elegir un framework Node.js que soporte:
- Dependency Injection nativa
- Módulos globales y por contexto
- Guards, Interceptors, Pipes, Filters
- OpenAPI/Swagger integrado
- TypeScript first-class
- Ecosistema maduro para empresas

## Alternativas

| Alternativa | Pros | Contras |
|-------------|------|---------|
| **NestJS** | DI nativa, modularidad, decoradores, ecosistema | Curva de aprendizaje |
| **Express** | Simple, lightweight, popular | Sin estructura, sin DI, todo manual |
| **Fastify** | Performance, schema-based | Menos ecosistema empresarial |
| **Hono** | Edge-ready, lightweight | Muy nuevo, ecosistema pequeño |

## Decisión

NestJS 10 con Express platform.

## Consecuencias

- Provee DI, Guards, Interceptors, Pipes nativos
- Módulos @Global() para infraestructura cross-cutting
- Integración nativa con Swagger/OpenAPI, Throttler, BullMQ
- Curva de aprendizaje controlada con Clean Architecture
- TypeScript strict desde el día 1
