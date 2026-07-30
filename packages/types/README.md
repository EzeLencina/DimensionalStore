# @tienda/types

Tipos genéricos y utilitarios compartidos entre todas las aplicaciones y paquetes del monorepo.

## Contenido

| Exportación | Descripción |
|------------|-------------|
| `UUID` | Alias para string con formato UUID |
| `Nullable<T>` | T \| null |
| `DeepPartial<T>` | Partial recursivo |
| `PaginationParams` | Parámetros de paginación |
| `PaginationMeta` | Metadatos de paginación |
| `PaginatedResult<T>` | Resultado paginado genérico |
| `ApiResponse<T>` | Envoltorio de respuesta API (éxito o error) |
| `Result<T, E>` | Resultado tipo Rust (ok o err) |
| `Identifiable` | Entidad con id |
| `Timestampable` | Entidad con createdAt/updatedAt |
| `SoftDeletable` | Entidad con deletedAt |
| `TenantScoped` | Entidad con tenantId |
| `DateRange` | Rango de fechas |

## Uso

```typescript
import type { PaginatedResult, UUID } from '@tienda/types';

function fetchPage(): PaginatedResult<Product> { ... }
```

## Reglas

- No contiene tipos de negocio (productos, órdenes, clientes).
- No tiene dependencias de otros paquetes del monorepo.
- Es 100% type-only (sin runtime).
