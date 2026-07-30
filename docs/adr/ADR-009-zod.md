# ADR-009: Zod para Validación

## Contexto

La plataforma necesita validación de datos en runtime con type-safety.

## Problema

Elegir una librería de validación TypeScript-first que genere tipos inferidos.

## Alternativas

| Alternativa | Pros | Contras |
|-------------|------|---------|
| **Zod** | TypeScript-first, inferencia, composición | Popular pero nueva |
| **Joi** | Madura, mensajes de error | Sin type inference nativa |
| **Yup** | Similar a Joi, React-friendly | Inferencia limitada |
| **class-validator** | Decoradores NestJS | Atributos, sin inferencia de tipos |

## Decisión

Zod 3+ para toda validación de entrada.

## Consecuencias

- Schemas inferidos para tipos TypeScript
- `ZodValidationPipe` global (configurable en módulos)
- Validación en controllers, DTOs, y config
- Composición de schemas para reutilización
- Integración con React Hook Form via `@hookform/resolvers`
- Validación de variables de entorno en `packages/config`
