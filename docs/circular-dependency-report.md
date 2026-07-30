# Reporte: Dependencia Circular Resuelta

## Problema encontrado
Dependencia circular entre `@tienda/schemas` y `@tienda/validators`:

```
@tienda/schemas → @tienda/validators → @tienda/schemas
```

Turbo detectaba el ciclo y fallaba al intentar determinar el orden de compilación.

## Causa raíz

El `package.json` de `@tienda/schemas` declaraba:

```json
"dependencies": {
  "@tienda/validators": "workspace:*",
  "zod": "^3.24.1"
}
```

**Ningún archivo en `packages/schemas/src/` importaba realmente de `@tienda/validators`.** Era una dependencia muerta (vestigial).

Mientras tanto, `@tienda/validators` SÍ importa de `@tienda/schemas` en 3 archivos:
- `pipes/pagination.pipe.ts` → `import { paginationSchema } from '@tienda/schemas'`
- `pipes/sorting.pipe.ts` → `import { sortingSchema } from '@tienda/schemas'`
- `pipes/search.pipe.ts` → `import { searchSchema } from '@tienda/schemas'`

## Archivos modificados

| Archivo | Cambio |
|---------|--------|
| `packages/schemas/package.json` | Eliminada línea `"@tienda/validators": "workspace:*"` de dependencies |
| `packages/ui/src/components/commerce/rating/rating.tsx` | Agregado `'use client'` (renderiza `<button>` con `onClick`) |
| `packages/ui/src/components/ui/alert/alert.tsx` | Agregado `'use client'` (renderiza `<button>` con `onClick` condicional) |
| `packages/ui/src/components/commerce/product-card/product-card.tsx` | Agregado `'use client'` (renderiza `<button>` con `onClick` condicional) |

## Cambios realizados

### 1. Corrección principal
Se eliminó la dependencia `@tienda/validators` de `packages/schemas/package.json` porque:
- No hay imports desde schemas hacia validators en ningún archivo de código.
- La dependencia era muerta y generaba el ciclo.
- `validators → schemas` es la dirección arquitectónicamente correcta (validators usan los schemas de Zod para validar).

### 2. Correcciones secundarias (UI package)
Se agregó `'use client'` a 3 componentes del DS que renderizan elementos interactivos pero carecían de la directiva, causando error de prerenderizado en `next build`:
- **Rating**: siempre renderiza `<button>` con `onClick` (aunque sea `readOnly`)
- **Alert**: renderiza `<button>` condicional cuando se pasa `onClose`
- **ProductCard**: renderiza `<button>` condicional cuando se pasa `onAddToCart`

## Nueva arquitectura de dependencias

```
@tienda/schemas (sin dependencias de @tienda/*)
  └── zod

@tienda/validators
  ├── @tienda/schemas  ← correcto: validators usan schemas
  ├── @tienda/constants
  └── zod
```

El grafo de Turbo ahora es acíclico:

```
@tienda/schemas#build → eslint-config, tsconfig
@tienda/validators#build → constants, schemas, eslint-config, tsconfig
```

## Validaciones ejecutadas

| Verificación | Resultado |
|-------------|-----------|
| `pnpm install` | ✓ Already up to date |
| `pnpm build` (turbo) | ✓ 2/2 successful |
| Next.js build (25 páginas) | ✓ Static + SSG generadas |
| `@tienda/frontend typecheck` | ✓ 0 errores |
| `@tienda/ui typecheck` | ✓ 0 errores |
| `@tienda/schemas typecheck` | ✓ 0 errores |
| `@tienda/validators typecheck` | ✓ 0 errores |
| `turbo build --graph` | ✓ Sin ciclos |

## Riesgos futuros detectados

1. **Dependencias muertas**: No hay un mecanismo actual para detectar dependencias declaradas en `package.json` que no se usan en código. Considerar tooling como `depcheck` o `pnpm dedupe --check`.
2. **`@tienda/ui` sin `'use client'` consistente**: Algunos componentes del DS que renderizan interactividad carecían de `'use client'`. Esto solo se manifiesta en `next build` (prerenderizado), no en `turbo dev`. Recomendación: agregar una regla ESLint o un script CI que verifique que todo componente con `onClick`/`onChange`/etc tenga `'use client'`.
