# Coding Standards

## Nomenclatura

| Elemento | Convención | Ejemplo |
|----------|-----------|---------|
| Archivos | `kebab-case` | `http-client.ts` |
| Clases | `PascalCase` | `HttpClient` |
| Interfaces | `I` + PascalCase | `IHttpClient` |
| Tipos | `PascalCase` | `HttpMethod` |
| Funciones | `camelCase` | `buildUrl()` |
| Variables | `camelCase` | `requestBody` |
| Constantes | `UPPER_SNAKE_CASE` | `DEFAULT_TIMEOUT` |
| Enums | `PascalCase` | `HttpMethod` |
| Enum values | `UPPER_SNAKE_CASE` | `HttpMethod.GET` |
| Decoradores | `@` + PascalCase | `@ApiPagination` |
| Archivos de test | `*.spec.ts` o `*.test.ts` | `http-client.spec.ts` |
| Directorios | `kebab-case` | `rate-limit/` |

## Imports

```typescript
// 1. Node built-in
import { randomUUID } from 'node:crypto';

// 2. External packages
import { Injectable } from '@nestjs/common';
import { z } from 'zod';

// 3. Internal packages
import { LOGGER_TOKEN } from '@tienda/logger';

// 4. Core modules
import { HttpService } from '@core/http';
import { PrismaService } from '@core/database/prisma.service';

// 5. Common
import { AppException } from '@common/exceptions/app.exception';

// 6. Modules
import { ProductService } from '@modules/products/services/product.service';

// 7. Relative (solo cuando es necesario)
import { MyHelper } from './my.helper';
```

Orden: `node:*` → externos → `@tienda/*` → `@core/*` → `@common/*` → `@modules/*` → relativos.

## Exports

```typescript
// Barrel exports con index.ts
export { MyClass } from './my.class';
export type { MyType } from './my.types';

// Default exports: NO usar (preferir named exports)

// Re-export ordenado
export * from './config';
export * from './services';
export * from './types';
```

## Estructura de Carpetas

**Backend (por módulo):**
```
module-name/
├── module-name.module.ts
├── index.ts
├── domain/
├── application/
├── infrastructure/
└── presentation/
```

**Frontend (por feature):**
```
feature-name/
├── index.ts
├── components/
├── hooks/
├── services/
└── types/
```

**Packages:**
```
package-name/
├── package.json
├── tsconfig.json
├── src/
│   ├── index.ts
│   └── ...
└── README.md
```

## TypeScript

```typescript
// Strict mode (tsconfig.json)
{
  "strict": true,
  "noUncheckedIndexedAccess": true,
  "noImplicitOverride": true,
  "noPropertyAccessFromIndexSignature": true,
  "exactOptionalPropertyTypes": true,
  "forceConsistentCasingInFileNames": true
}

// Prefer type sobre interface para objetos simples
type User = { id: string; name: string };

// Interface para objetos extensibles
interface IUserRepository {
  findById(id: string): Promise<User | null>;
}

// Readonly por defecto
type Point = { readonly x: number; readonly y: number };

// Union types sobre enums cuando sea posible
type Status = 'active' | 'inactive' | 'archived';
```

## Errores

```typescript
// Usar AppException como base
export class AppException extends Error {
  constructor(
    public readonly code: string,
    public readonly message: string,
    public readonly httpStatus: number,
    public readonly details?: Record<string, unknown>,
  ) {
    super(message);
  }
}

// Excepciones específicas extienden AppException
export class NotFoundException extends AppException {
  constructor(resource: string, id: string) {
    super('NOT_FOUND', `${resource} with id ${id} not found`, 404);
  }
}
```

## Logging

```typescript
// Inyectar logger vía DI
@Injectable()
export class MyService {
  constructor(
    @Inject(LOGGER_TOKEN) private readonly logger: Logger,
  ) {}

  doSomething() {
    this.logger.info('Doing something', { context: 'MyService', id: '123' });
    this.logger.error('Failed', { error: err.message });
  }
}
```

## Testing

```typescript
// Unit: mockear dependencias
const mockRepo = { findById: jest.fn() };
const service = new MyService(mockRepo);

// Integration: NestJS TestingModule
const module = await Test.createTestingModule({
  imports: [MyModule],
}).compile();

// E2E: Supertest
const response = await request(app.getHttpServer())
  .get('/api/v1/products')
  .expect(200);
```

## Commits

```
feat(scope): description

Tipos: feat, fix, chore, docs, refactor, test, ci, perf, style
Scope: module name (products, inventory, auth, core, etc.)
```
