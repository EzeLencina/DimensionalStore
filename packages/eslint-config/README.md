# @tienda/eslint-config

Configuración ESLint compartida para todo el monorepo.

## Variantes

| Archivo | Uso |
|---------|-----|
| `src/base.js` | Configuración base (Node.js, paquetes) |
| `src/react.js` | Configuración para frontend React/Next.js |

## Uso

```js
// .eslintrc.js — para paquetes Node
module.exports = {
  extends: ['@tienda/eslint-config'],
};

// .eslintrc.js — para frontend React
module.exports = {
  extends: ['@tienda/eslint-config/src/react'],
};
```

## Reglas incluidas

- TypeScript strict mode
- Consistent type imports
- Import order con grupos
- No unused vars (con prefijo _ permitido)
- No console (warn, error permitido)
- Prettier integrado
