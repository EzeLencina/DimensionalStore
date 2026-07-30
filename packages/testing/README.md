# @tienda/testing — Infraestructura Compartida de Testing

Paquete compartido que provee utilidades de testing reutilizables para toda la plataforma Tienda. Diseñado para ser usado tanto con Jest (backend) como con Vitest (frontend).

---

## 1. Árbol Completo del Sistema de Testing

```
packages/testing/src/
├── index.ts                  # Barrel export público
├── README.md                 # Documentación
│
├── factories/
│   └── index.ts              # BaseFactory, ObjectFactory, FactoryBuilder, FactoryManager
│
├── fixtures/
│   └── index.ts              # FixtureLoader, FixtureBuilder, saveFixture
│
├── mocks/
│   ├── index.ts              # MockRegistry
│   ├── http.mock.ts          # HttpMockServer (simulador HTTP)
│   ├── logger.mock.ts        # LoggerMock (captura logs en memoria)
│   ├── clock.mock.ts         # ClockMock (tiempo controlado)
│   ├── config.mock.ts        # ConfigMock (configuración en memoria)
│   ├── queue.mock.ts         # QueueMock (simulador de colas)
│   └── uuid.mock.ts          # UuidMock (UUIDs deterministas)
│
├── helpers/
│   └── index.ts              # TestHelper (wait, retry, waitForCondition, etc.)
│
├── utils/
│   └── index.ts              # createPaginationParams, createApiResponse, buildQueryString, etc.
│
├── assertions/
│   └── index.ts              # Assertions (assertSuccessResponse, assertPaginatedResponse, etc.)
│
├── matchers/
│   └── index.ts              # Custom matchers (toBeUuid, toBeIsoDate, toBeInRange, toBeSorted)
│
├── generators/
│   └── index.ts              # DataGenerator (uuid, integer, string, email, url, date, etc.)
│
├── contracts/
│   └── index.ts              # ContractValidator (registro y validación de contratos API)
│
├── setup/
│   └── index.ts              # TestEnvironment (global setup/teardown, withEnv)
│
├── constants/
│   └── index.ts              # TEST_DEFAULTS, TEST_ERROR_CODES, HTTP_STATUS
│
└── types/
    └── index.ts              # Tipos compartidos (FactoryConfig, ApiTestResponse, etc.)
```

---

## 2. Arquitectura de Testing

```
                    ┌─────────────────────────────┐
                    │     @tienda/testing          │
                    │  (utilidades compartidas)    │
                    └───────────┬─────────────────┘
                                │
            ┌───────────────────┼───────────────────┐
            │                   │                   │
            ▼                   ▼                   ▼
┌─────────────────────┐ ┌─────────────────┐ ┌──────────────────┐
│  apps/backend/test  │ │ apps/frontend/  │ │ packages/*/test  │
│  (Jest + Supertest) │ │ tests (Vitest)  │ │   (future)       │
└─────────────────────┘ └─────────────────┘ └──────────────────┘
```

**Backend** (apps/backend/test/):
- `unit/` — Tests unitarios con Jest
- `integration/` — Tests de integración con NestJS testing module
- `e2e/` — Tests end-to-end con Supertest
- `helpers/` — TestRequestHelper (wrappers supertest)
- `fixtures/` — Fixtures reutilizables para tests
- `setup/` — Setup y teardown global

**Frontend** (apps/frontend/tests/):
- `unit/` — Tests unitarios con Vitest
- `components/` — Tests de componentes
- `integration/` — Tests de integración
- `e2e/` — Tests end-to-end con Playwright (future)
- `helpers/` — Helpers para tests
- `fixtures/` — Fixtures reutilizables
- `setup/` — Configuración global de Vitest

---

## 3. Estrategia Unit Testing

**Runner**: Jest (backend) / Vitest (frontend)

**Patrón**: `*.spec.ts` (backend), `*.test.ts` (frontend)

**Ubicación**: Colocated con el código fuente o en `test/unit/`

**Backend (Jest)**:
```typescript
import { Test } from '@nestjs/testing';
import { LoggerMock } from '@tienda/testing';

describe('MyService', () => {
  let service: MyService;
  const loggerMock = new LoggerMock();

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        MyService,
        { provide: LOGGER_TOKEN, useValue: loggerMock },
      ],
    }).compile();

    service = module.get(MyService);
  });

  it('should do something', () => {
    const result = service.doSomething();
    expect(result).toBeDefined();
  });
});
```

**Frontend (Vitest)**:
```typescript
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MyComponent } from './MyComponent';

describe('MyComponent', () => {
  it('should render', () => {
    render(<MyComponent />);
    expect(screen.getByText('Hello')).toBeDefined();
  });
});
```

---

## 4. Estrategia Integration Testing

**Runner**: Jest (backend) / Vitest (frontend)

**Ubicación**: `test/integration/`

**Backend**: Usa `@nestjs/testing` para crear módulos NestJS reales, conectando a servicios reales o mockeados.

```typescript
import { Test } from '@nestjs/testing';
import { HttpModule } from '@core/http';
import { HttpMockServer } from '@tienda/testing';

describe('Http Integration', () => {
  let httpMock: HttpMockServer;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [HttpModule],
    }).compile();
  });
});
```

---

## 5. Estrategia E2E

**Runner**: Supertest (backend) / Playwright (frontend future)

**Ubicación**: `test/e2e/`

**Backend**:
```typescript
import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { AppModule } from '../../src/app.module';

describe('API E2E', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = module.createNestApplication();
    await app.init();
  });

  it('GET /health', () => {
    return request(app.getHttpServer())
      .get('/health')
      .expect(200);
  });
});
```

---

## 6. Estrategia Factories

**BaseFactory** — Clase abstracta para crear factories tipados:

```typescript
import { BaseFactory, DataGenerator } from '@tienda/testing';

interface User {
  id: string;
  name: string;
  email: string;
}

class UserFactory extends BaseFactory<User> {
  protected define(): User {
    return {
      id: DataGenerator.uuid(),
      name: DataGenerator.string(10),
      email: DataGenerator.email(),
    };
  }
}

const factory = new UserFactory();
const user = factory.build({ name: 'Fixed Name' });
const users = factory.buildMany(5);
```

**factoryBuilder** — API fluida para casos simples:

```typescript
import { factoryBuilder, DataGenerator } from '@tienda/testing';

const user = factoryBuilder({
  id: DataGenerator.uuid(),
  name: 'Default',
  email: DataGenerator.email(),
})
.with({ name: 'Override' })
.build();
```

**FactoryManager** — Registro centralizado de factories:

```typescript
import { factoryManager, createFactory } from '@tienda/testing';

factoryManager.register('user', createFactory(() => ({
  id: DataGenerator.uuid(),
  name: DataGenerator.string(),
})));

const user = factoryManager.build('user');
```

---

## 7. Estrategia Fixtures

**FixtureLoader** — Carga archivos JSON, CSV, binarios, imágenes, PDFs:

```typescript
import { FixtureLoader } from '@tienda/testing';

const loader = new FixtureLoader('/path/to/fixtures');
const data = loader.loadJson<MyType>('my-fixture');
const csv = loader.loadCsv('data');
const image = loader.loadImage('logo');
```

**FixtureBuilder** — Construcción programática de fixtures:

```typescript
import { FixtureBuilder } from '@tienda/testing';

const builder = new FixtureBuilder();
const fixture = builder
  .set('name', 'Test')
  .setNested('address.city', 'Madrid')
  .merge({ extra: 'data' })
  .build();
```

---

## 8. Estrategia Mocking

| Mock | Propósito | API Principal |
|---|---|---|
| `HttpMockServer` | Simular peticiones HTTP | `onGet(url, response)`, `request(method, url)` |
| `LoggerMock` | Capturar logs en memoria | `info()`, `error()`, `getByLevel()`, `hasMessage()` |
| `ClockMock` | Tiempo controlado | `now()`, `advance(ms)`, `setTime(date)` |
| `ConfigMock` | Configuración en memoria | `set(key, value)`, `get(key)`, `all()` |
| `QueueMock` | Simular colas de trabajo | `add(queue, data)`, `getJobs()`, `setFailure()` |
| `UuidMock` | UUIDs deterministas | `setFixed(uuids)`, `generate()` |
| `MockRegistry` | Registro centralizado de mocks | `register(name, mock)`, `enable/disable` |

```typescript
import { HttpMockServer, LoggerMock, ClockMock } from '@tienda/testing';

const httpMock = new HttpMockServer();
httpMock.onGet('/api/products', { status: 200, headers: {}, body: [] });

const logger = new LoggerMock();
logger.info('test');
logger.hasMessage('test'); // true

const clock = new ClockMock(new Date('2026-01-01'));
clock.advanceDays(1);
clock.nowISO(); // '2026-01-02T...'
```

---

## 9. Cobertura Objetivo

| Métrica | Objetivo Mínimo |
|---|---|
| Statements | 90% |
| Branches | 90% |
| Functions | 90% |
| Lines | 90% |

Configuración en `apps/backend/package.json` (Jest) y `apps/frontend/vitest.config.ts` (Vitest).

---

## 10. Recomendaciones

1. **Mocking global**: Usar `MockRegistry` para registrar mocks en el setup global y controlarlos desde helpers de test.
2. **Factories para modelos**: Crear factories para cada modelo de dominio usando `BaseFactory` en los tests de integración.
3. **Determinismo**: Usar `DataGenerator.setSeed()` para tests deterministas — mismo seed produce mismos datos.
4. **ClockMock**: Reemplazar `Date.now()` y `new Date()` en servicios con `ClockMock` para evitar tests dependientes del tiempo real.
5. **UuidMock**: Reemplazar `randomUUID()` con `UuidMock` para IDs predecibles en tests.
6. **Contract testing**: Registrar contratos en `ContractValidator` para verificar que las respuestas API siguen el esquema esperado.
7. **TestContainers**: Para tests de integración reales con PostgreSQL, Redis, MinIO, usar la infraestructura de `packages/testing` con contenedores Docker (Testcontainers) cuando esté disponible.
8. **Playwright**: Configurar E2E frontend cuando se añada la dependencia playwright.

---

## 11. Riesgos Detectados

1. **`process.env.NODE_ENV` read-only**: En TypeScript strict, `NODE_ENV` es read-only. Se usa `(process.env as Record<string, string>)` para evitarlo.
2. **Compatibilidad Jest/Vitest**: Las aserciones en `@tienda/testing` no usan `expect` directamente para ser compatibles con ambos runners.
3. **Sin Testcontainers**: La infraestructura para PostgreSQL, Redis, MinIO está preparada pero no implementada. Los tests de integración real requieren contenedores.
4. **Sin Playwright**: La estructura E2E frontend existe pero no tiene configuración de Playwright instalada.
5. **Cobertura**: El threshold de 90% está configurado pero no se aplica hasta que existan tests reales.
6. **Dependencia circular**: `packages/testing` no debe depender de `apps/backend` ni `apps/frontend`. Solo depende de `@tienda/tsconfig`, `@types/node` y TypeScript.
