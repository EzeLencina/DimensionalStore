# Testing — Estrategia de Tests

## Stack

| Tipo | Backend | Frontend |
|------|---------|----------|
| Unit | Jest | Vitest |
| Integration | Jest + NestJS Testing | Vitest |
| E2E | Supertest | Playwright (future) |
| Coverage | 90% (statements, branches, functions, lines) |
| Mocks | @tienda/testing | @tienda/testing |

## @tienda/testing Package

### Factories

- `BaseFactory<T>` — Clase abstracta para crear objetos de test
- `factoryBuilder()` — API fluida para factories simples
- `FactoryManager` — Registro centralizado de factories
- `DataGenerator` — Generación de datos (uuid, string, email, etc.)

### Mocks

| Mock | Propósito |
|------|-----------|
| `HttpMockServer` | Simular respuestas HTTP |
| `LoggerMock` | Capturar logs en memoria |
| `ClockMock` | Tiempo controlado |
| `ConfigMock` | Config en memoria |
| `QueueMock` | Simular colas |
| `UuidMock` | UUIDs deterministas |
| `MockRegistry` | Registro centralizado |

### Fixtures

- `FixtureLoader` — Carga JSON, CSV, binarios, imágenes
- `FixtureBuilder` — Construcción programática de fixtures

### Assertions

- `assertSuccessResponse(response)`
- `assertPaginatedResponse(response)`
- `assertErrorResponse(response, statusCode, errorCode)`
- 10+ assertions para respuestas API estandarizadas

### Custom Matchers

- `toBeUuid()` — Valida formato UUID
- `toBeIsoDate()` — Valida formato ISO date
- `toBeInRange(min, max)` — Rango numérico
- `toBeSorted(direction)` — Orden ascendente/descendente

## Estrategia

### Unit Tests

```typescript
// Backend: junto al código *.spec.ts
it('should calculate total', () => {
  const result = calculator.calculateTotal(items);
  expect(result).toBe(100);
});
```

### Integration Tests

```typescript
// Backend: test/integration/
const module = await Test.createTestingModule({
  imports: [ProductsModule],
}).compile();
const service = module.get(ProductService);
```

### E2E Tests

```typescript
// Backend: test/e2e/
const response = await request(app.getHttpServer())
  .get('/api/v1/products')
  .expect(200);
```

## Cobertura

| Métrica | Mínimo |
|---------|--------|
| Statements | 90% |
| Branches | 90% |
| Functions | 90% |
| Lines | 90% |

Configuración en `apps/backend/package.json` (Jest) y `apps/frontend/vitest.config.ts` (Vitest).

## Ejecución

```bash
# Todos los tests
pnpm test

# Backend
pnpm --filter @tienda/backend test
pnpm --filter @tienda/backend test:e2e

# Frontend
pnpm --filter @tienda/frontend test

# Coverage
pnpm test -- --coverage
```
