# @tienda/shared

Código transversal compartido entre todas las aplicaciones. Actúa como punto de entrada único para código que debe estar disponible en frontend y backend.

## Contenido

- `version.ts` — Versión del proyecto y fecha de build
- Código transversal que no pertenece a un paquete específico

## Uso

```typescript
import { VERSION } from '@tienda/shared';
```

## Reglas

- No contiene lógica de negocio.
- No re-exporta otros paquetes (cada paquete se importa directamente).
- Sirve como contenedor para código compartido que no encaja en types/, utils/, o constants/.
