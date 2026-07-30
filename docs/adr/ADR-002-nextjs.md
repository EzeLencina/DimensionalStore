# ADR-002: Next.js como Framework Frontend

## Contexto

Se necesita un framework frontend moderno con SSR, SSG, ISR, y App Router para la plataforma Tienda.

## Problema

Elegir un framework React que soporte Server Components, SEO, múltiples layouts, y ruteo basado en archivos.

## Alternativas

| Alternativa | Pros | Contras |
|-------------|------|---------|
| **Next.js 15** | App Router, Server Components, ISR, SEO | Bundle size, complejidad |
| **Remix** | Web standards, nested routes | Menos ecosistema |
| **Vite + React Router** | Simple, rápido | Sin SSR nativo |
| **Astro** | Zero JS by default | No es SPA puro |

## Decisión

Next.js 15 con App Router, TailwindCSS, shadcn/ui.

## Consecuencias

- Server Components por defecto (mejor performance)
- Route groups para segmentar app (admin, auth, public, vendor)
- SEO nativo con Metadata API, sitemap dinámico, Open Graph
- Provider tree: Theme → Query → Modal → Toast
- Path aliases (@components, @features, @lib, etc.)
- TanStack Query para fetching + Zustand para estado global
