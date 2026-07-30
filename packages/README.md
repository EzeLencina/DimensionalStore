# Paquetes Compartidos

Diagrama de dependencias y propósito de cada paquete en el monorepo.

---

## Árbol de Paquetes

```
packages/
├── config/           # Configuración base (API_PREFIX, defaults)
├── eslint-config/    # ESLint compartido (base, react)
├── tsconfig/         # TypeScript configs (base, node, react, nest)
├── types/            # Tipos genéricos (Pagination, ApiResponse, UUID)
├── constants/        # Constantes (timeouts, regex, headers, limits)
├── utils/            # Utilidades puras (date, string, number, array)
├── logger/           # Abstracción de logging (Pino-ready)
├── validators/       # Validaciones Zod genéricas (email, sku, price)
├── schemas/          # Schemas Zod compuestos
├── shared/           # Código transversal (version, build info)
└── ui/               # Componentes React compartidos (estructura base)
```

---

## Diagrama de Dependencias

```
                    sin dependencias internas
    ┌───────┬────────┬───────┬────────┬──────┐
    │config │eslint  │tsconfig│ types  │shared│
    └───────┴────────┴───────┴────────┴──────┘
        │                        │
        │                        ▼
        │                 ┌───────────┐
        │                 │ constants │
        │                 └─────┬─────┘
        │                       │
        │                 ┌─────▼─────┐
        │                 │  utils    │
        │                 └─────┬─────┘
        │                       │
        │                 ┌─────▼──────┐
        │                 │ validators │─── zod
        │                 └─────┬──────┘
        │                       │
        │                 ┌─────▼────┐
        │                 │ schemas  │─── zod
        │                 └──────────┘
        │
        ▼
  ┌──────────┐
  │  logger  │
  └──────────┘

  ┌──────────┐
  │    ui    │─── react (peer)
  └──────────┘
```

---

## Propósito de Cada Paquete

| Paquete | Propósito | Dependencias Internas | Dependencias Externas |
|---------|-----------|----------------------|----------------------|
| **config** | Constantes de configuración base del sistema | — | — |
| **eslint-config** | Reglas ESLint reutilizables | — | eslint, typescript-eslint |
| **tsconfig** | Base TypeScript configs para apps/packages | — | — |
| **types** | Tipos genéricos globales (Pagination, ApiResponse, etc.) | — | — |
| **constants** | Constantes de sistema (timeouts, regex, limits) | — | — |
| **utils** | Funciones puras (date, string, number, object, array) | — | — |
| **logger** | Interfaces y contratos de logging | config (opcional) | — |
| **validators** | Schemas Zod atómicos (email, sku, price) | constants | zod |
| **schemas** | Schemas Zod compuestos | validators | zod |
| **shared** | Código transversal (versión, metadatos de build) | — | — |
| **ui** | Componentes React base | — | react (peer) |

---

## Convenciones de Nombres

| Elemento | Convención | Ejemplo |
|----------|-----------|---------|
| **Nombre del paquete** | `@tienda/{nombre}` | `@tienda/types` |
| **Carpeta del paquete** | kebab-case | `eslint-config/` |
| **Archivos fuente** | kebab-case | `date-utils.ts` |
| **Exportaciones** | camelCase | `formatDate`, `emailSchema` |
| **Tipos/Interfaces** | PascalCase | `PaginatedResult<T>` |
| **Constantes** | UPPER_SNAKE_CASE | `MAX_PAGE_SIZE` |
| **Índice** | `src/index.ts` | Barrel export |

## Estrategia de Reutilización

1. **Paquetes atómicos**: types/, constants/, utils/ — sin dependencias internas, reutilizables en cualquier contexto.
2. **Paquetes compuestos**: validators/ → schemas/ — construyen sobre los atómicos.
3. **Paquetes de infraestructura**: logger/ — abstracción que permite cambiar implementación sin afectar consumidores.
4. **Paquetes de UI**: ui/ — componentes puramente visuales, sin lógica de negocio.
5. **Paquetes de configuración**: config/, eslint-config/, tsconfig/ — config dev, no código de runtime.

## Estrategia para Evitar Acoplamiento

| Regla | Descripción |
|-------|-------------|
| **Sin dependencias circulares** | types → utils → types está prohibido. El linter de import lo verifica. |
| **Dependencias unidireccionales** | Solo hacia abajo en la jerarquía. validators → constants ✓, constants → validators ✗ |
| **Paquetes hoja sin deps** | types, constants, config, tsconfig — no dependen de ningún otro paquete |
| **API pública explícita** | Solo `src/index.ts` es importable. Archivos internos en `src/` no se exponen. |
| **Peer dependencies** | react, zod — no se instalan como dependencia directa. Cada app gestiona su versión. |

## Recomendaciones para Futuros Paquetes

1. **No crear paquetes sin necesidad**. Si el código solo se usa en una app, queda en esa app.
2. **Extraer a paquete compartido** cuando 2+ apps lo necesiten.
3. **Mantener la atomicidad**: un paquete, una responsabilidad.
4. **Versionar independientemente** si se publica a npm.
5. **Documentar breaking changes** en cada paquete con changelog.
