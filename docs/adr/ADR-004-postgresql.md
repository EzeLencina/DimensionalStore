# ADR-004: PostgreSQL como Base de Datos

## Contexto

Se necesita una base de datos relacional para la plataforma empresarial.

## Problema

Elegir una base de datos que soporte transacciones ACID, datos relacionales complejos, y escalabilidad.

## Alternativas

| Alternativa | Pros | Contras |
|-------------|------|---------|
| **PostgreSQL** | ACID, JSONB, índices avanzados, RLS, pgvector | Configuración |
| **MySQL** | Popular, rendimiento lectura | Features menos avanzados |
| **SQLite** | Zero-config, embebida | Sin concurrencia, sin RLS |
| **MongoDB** | Esquema flexible, escalabilidad horizontal | Sin joins, sin ACID cross-document |

## Decisión

PostgreSQL 16 con extensiones (pgvector futuro).

## Consecuencias

- Soporte nativo de Row-Level Security (multi-tenant)
- Índices GIN para búsqueda full-text español
- Particionamiento por fecha para tablas grandes (audit_logs)
- JSONB para metadata flexible
- Enums nativos para status (OrderStatus, PaymentStatus)
- Trigram indexes para búsqueda parcial
- Read replicas planificadas para escalar
