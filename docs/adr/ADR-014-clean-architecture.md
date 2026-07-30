# ADR-014: Clean Architecture + DDD

## Contexto

La plataforma necesita una arquitectura mantenible, testeable, y escalable para múltiples módulos de negocio.

## Problema

Elegir un estilo arquitectónico que soporte DDD, separación de concerns, y evolución independiente de módulos.

## Alternativas

| Alternativa | Pros | Contras |
|-------------|------|---------|
| **Clean Architecture + DDD** | Separación en capas, dominio puro, testeable | Overhead inicial, más archivos |
| **Layered Architecture** | Simple, familiar | Acoplamiento, anemic domain |
| **Modular Monolith** | Simple, un deploy | Puede degenerar en big ball of mud |
| **Microservices** | Escalamiento independiente | Complejidad operativa, redes |

## Decisión

Clean Architecture (4 capas) + DDD (Bounded Contexts, Aggregates, Value Objects) en un monolith modular.

## Consecuencias

- **Domain Layer**: Entities, Value Objects, Repository interfaces, Domain Events
- **Application Layer**: Commands, Queries, Handlers, DTOs, Mappers
- **Infrastructure Layer**: Prisma repositories, external integrations
- **Presentation Layer**: Controllers, Pipes, Guards, Interceptors
- **Bounded Contexts**: 14 contextos (Catalog, Inventory, Sales, etc.)
- **Comunicación**: Eventos de dominio entre contextos
- **Vertical Slices**: Cada módulo contiene sus 4 capas
- **Repository Pattern**: Domain define interfaces, Infrastructure implementa
- **CQRS Ready**: Commands y queries separados
