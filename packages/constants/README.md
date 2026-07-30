# @tienda/constants

Constantes reutilizables compartidas entre todas las aplicaciones del monorepo.

## Categorías

| Exportación | Descripción |
|------------|-------------|
| `TIMEOUTS` | Tiempos de espera en ms (SHORT, MEDIUM, LONG, VERY_LONG) |
| `LIMITS` | Límites de negocio (tamaños, cantidades, intentos) |
| `HEADERS` | Nombres de headers HTTP estándar |
| `REGEX` | Expresiones regulares validadas (email, UUID, slug, SKU) |
| `HTTP_STATUS` | Códigos de estado HTTP |
| `ERROR_CODES` | Códigos de error estandarizados |
| `ENVIRONMENTS` | Entornos válidos del sistema |
| `ROLES` | Roles base del sistema |

## Uso

```typescript
import { REGEX, LIMITS, HTTP_STATUS } from '@tienda/constants';

if (!REGEX.EMAIL.test(email)) throw new Error('Email inválido');
```

## Reglas

- No contiene constantes de dominio específico (precios, impuestos, etc.).
- Sin dependencias de otros paquetes del monorepo.
- Todo `as const` para type narrowing.
