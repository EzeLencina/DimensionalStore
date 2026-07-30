# @tienda/tsconfig

Configuración base de TypeScript para todas las aplicaciones y paquetes del monorepo.

## Variantes

| Archivo | Uso |
|---------|-----|
| `base.json` | Configuración base con strict mode |
| `node.json` | Paquetes Node.js |
| `react.json` | Frontend React/Next.js |
| `nest.json` | Backend NestJS |

## Uso

```json
{
  "extends": "@tienda/tsconfig/src/node.json"
}
```

## Principios

- Strict mode obligatorio en todo el proyecto
- `noUncheckedIndexedAccess` para evitar accesos undefined
- `exactOptionalPropertyTypes: false` para flexibilidad controlada
- Declaraciones y source maps habilitados por defecto
