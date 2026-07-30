# @tienda/schemas

Zod schemas reutilizables y genéricos. Define "qué son datos válidos" — sin lógica de negocio.

---

## Árbol completo

```
packages/schemas/
├── package.json
├── tsconfig.json
│
└── src/
    ├── index.ts                     # Barrel export
    │
    ├── common/
    │   ├── index.ts
    │   ├── identifiers.ts           # uuid, id, slug
    │   ├── strings.ts               # email, password, phone, url, name
    │   ├── numbers.ts               # positive, money, percentage, quantity
    │   ├── datetime.ts              # date, future, past, range
    │   ├── primitives.ts            # boolean, color, locale, timezone, currency
    │   └── enums.ts                 # status, orderStatus, paymentStatus
    │
    └── shared/
        ├── index.ts
        ├── pagination.ts            # page, perPage, sortBy, sortOrder
        ├── sorting.ts               # sortBy, sortOrder
        └── search.ts                # q, searchFields
```

---

## Schemas disponibles

| Schema | Tipo | Descripción |
|--------|------|-------------|
| `uuidSchema` | `z.string().uuid()` | UUID v4 |
| `idSchema` | `z.string().min(1).max(50)` | ID genérico |
| `slugSchema` | `regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)` | Slug URL-friendly |
| `emailSchema` | `z.string().email()` | Email + lowercase transform |
| `passwordSchema` | `z.string().min(8).max(128)` | Contraseña |
| `phoneSchema` | `regex(/^\+?[1-9]\d{1,14}$/)` | Teléfono E.164 |
| `urlSchema` | `z.string().url()` | URL válida |
| `nameSchema` | `z.string().min(1).max(200)` | Nombre genérico |
| `descriptionSchema` | `z.string().max(2000).optional()` | Descripción opcional |
| `positiveNumberSchema` | `z.number().positive()` | Número positivo |
| `moneySchema` | `z.number().min(0).max(999_999_999.99)` | Monto monetario |
| `percentageSchema` | `z.number().min(0).max(100)` | Porcentaje |
| `integerSchema` | `z.number().int()` | Entero |
| `quantitySchema` | `z.number().int().min(0)` | Cantidad |
| `dateSchema` | `z.string().datetime()` | ISO datetime |
| `dateRangeSchema` | `{ start, end }` | Rango de fechas |
| `booleanSchema` | `z.boolean() \| 'true'/'false'` | Booleano (acepta string) |
| `colorSchema` | `regex(/^#([0-9a-f]{3}\|{6})$/)` | Hex color |
| `localeSchema` | `regex(/^[a-z]{2}(-[A-Z]{2})?$/)` | Locale (es-AR) |
| `timeZoneSchema` | `Intl.DateTimeFormat` validated | Timezone (America/Argentina/...) |
| `currencySchema` | `regex(/^[A-Z]{3}$/)` | Código de moneda (ARS, USD) |
| `statusSchema` | `enum(ACTIVE, INACTIVE, DRAFT, ARCHIVED)` | Estado genérico |
| `paginationSchema` | `{ page, perPage, sortBy, sortOrder }` | Paginación |
| `sortingSchema` | `{ sortBy, sortOrder }` | Ordenamiento |
| `searchSchema` | `{ q, searchFields }` | Búsqueda |

---

## Uso

```ts
import { emailSchema, paginationSchema } from '@tienda/schemas';

// Validar email
const email = emailSchema.parse('user@example.com');

// Validar paginación desde query params
const pagination = paginationSchema.parse({ page: '2', perPage: '10' });
// → { page: 2, perPage: 10, sortOrder: 'desc' }
```
