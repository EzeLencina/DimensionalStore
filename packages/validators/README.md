# @tienda/validators

Infraestructura de validación: motor, helpers, pipes NestJS, transformadores y mapeo de errores.

---

## Árbol completo

```
packages/validators/
├── package.json
├── tsconfig.json
│
└── src/
    ├── index.ts                 # Barrel export (incluye legacy schemas)
    │
    ├── common.ts                # Legacy: uuid, pagination, boolean (backward compat)
    ├── string.ts                # Legacy: email, slug, phone (backward compat)
    ├── number.ts                # Legacy: price, percentage (backward compat)
    ├── date.ts                  # Legacy: date, futureDate (backward compat)
    │
    ├── core/
    │   ├── index.ts
    │   └── validate.ts          # validate() + validateObject()
    │
    ├── helpers/
    │   └── index.ts             # isEmail, isUUID, isURL, isPhone, isSlug, etc.
    │
    ├── pipes/
    │   ├── index.ts
    │   ├── zod-validation.pipe.ts   # ZodValidationPipe
    │   ├── parse-uuid.pipe.ts       # ParseUUIDPipe
    │   ├── parse-date.pipe.ts       # ParseDatePipe
    │   ├── pagination.pipe.ts       # PaginationPipe (+ skip compute)
    │   ├── sorting.pipe.ts          # SortingPipe
    │   └── search.pipe.ts           # SearchPipe
    │
    ├── transformers/
    │   └── index.ts             # trim, lowercase, uppercase, normalize, sanitize, parseNumber, parseBoolean, parseDate
    │
    ├── mappers/
    │   ├── index.ts
    │   └── zod-error.mapper.ts  # ZodError → ValidationError[], formatZodErrors
    │
    ├── constants/
    │   └── index.ts             # VALIDATION_ERROR_CODES, defaults
    │
    └── types/
        └── index.ts             # ValidationResult, ValidationError, ValidationMode
```

---

## Uso

### Validación básica

```ts
import { validate } from '@tienda/validators';
import { emailSchema } from '@tienda/schemas';

const result = validate(emailSchema, 'not-an-email');
// → { success: false, errors: [{ field: '', message: 'Invalid email', code: 'VALIDATION_002' }] }
```

### Helpers

```ts
import { isEmail, isUUID } from '@tienda/validators';

isEmail('user@example.com');  // → true
isUUID('not-a-uuid');         // → false
```

### Transformers

```ts
import { sanitize, parseNumber } from '@tienda/validators';

sanitize('<script>alert("xss")</script>');
// → '&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;'

parseNumber('42');  // → 42
```

### NestJS Pipes

```ts
import { ZodValidationPipe, PaginationPipe } from '@tienda/validators';
import { emailSchema, paginationSchema } from '@tienda/schemas';

@Controller()
export class UsersController {
  @Post()
  create(@Body(new ZodValidationPipe(emailSchema)) data: unknown) {}

  @Get()
  findAll(@Query(new PaginationPipe()) pagination: PaginationOutput) {
    // pagination = { page, perPage, sortBy, sortOrder, skip }
  }
}
```

### Mapeo de errores

```ts
import { mapZodErrorToValidationErrors } from '@tienda/validators';

try {
  schema.parse(data);
} catch (error) {
  const errors = mapZodErrorToValidationErrors(error);
  // → [{ field: 'email', message: 'Invalid email', code: 'VALIDATION_002' }]
}
```
