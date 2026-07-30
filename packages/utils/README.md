# @tienda/utils

Utilidades genéricas sin lógica de negocio. Organizadas por categoría en archivos separados.

## Módulos

| Archivo | Funciones |
|---------|-----------|
| `date.ts` | formatDate, formatDateTime, toISO, isExpired, daysBetween, addDays, startOfDay, endOfDay |
| `string.ts` | capitalize, truncate, slugify, generateId, isEmpty, maskEmail |
| `number.ts` | formatCurrency, clamp, roundTo, percentage, isPositive, isInRange |
| `object.ts` | pick, omit, isObject, merge |
| `array.ts` | groupBy, uniqueBy, paginate, sortBy |

## Uso

```typescript
import { formatCurrency, slugify, groupBy } from '@tienda/utils';

formatCurrency(1500, 'ARS'); // "$1.500,00"
slugify('Remera Azul');      // "remera-azul"
```

## Reglas

- No importa de otros paquetes del monorepo (excepto types si es estrictamente necesario para typing).
- Sin dependencias externas.
- Cada función es pura (sin side effects).
