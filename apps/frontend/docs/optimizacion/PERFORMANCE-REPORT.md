# Informe de Performance

## Resumen
Optimización de performance orientada a Core Web Vitals y buenas prácticas de Next.js.

## Mejoras Aplicadas

### Server Components
Se convirtieron **10 componentes** de Client Components a Server Components, eliminando `'use client'` innecesario:

| Componente | Archivo |
|------------|---------|
| Breadcrumb | `breadcrumb.tsx` |
| Footer | `footer.tsx` |
| Skip To Content | `skip-to-content.tsx` |
| Progress Indicator | `progress-indicator.tsx` |
| Catalog Pagination | `catalog-pagination.tsx` |
| Active Filters | `active-filters.tsx` |
| FAQ | `faq.tsx` |
| Benefits | `benefits.tsx` |
| Testimonials | `testimonials.tsx` |
| Featured Products | `featured-products.tsx` |

Impacto: Reduce JavaScript bundles, mejora TTFB y FCP, disminuye hydration cost.

### Metadata
- **Root page** (`/app/page.tsx`): Agregado `export const metadata` con `title: 'Inicio'` y `robots: index/follow`.
- **404 page** (`/app/not-found.tsx`): Agregado `title: 'Página no encontrada'` y `robots: noindex/nofollow`.

### Imágenes
- `next.config.ts` ya configurado con `formats: ['image/avif', 'image/webp']`, `deviceSizes: [640, 768, 1024, 1280, 1536]`, y `minimumCacheTTL: 2592000` (30 días).
- Pendiente: Migrar `<img>` a `next/image` cuando las imágenes reales estén disponibles (actualmente usa placeholders mock).

### Bundle Optimization
- `experimental.optimizePackageImports` configurado para `lucide-react`, `recharts`, `@radix-ui/react-icons`.
- `transpilePackages` configurado para todos los paquetes del monorepo.
- `removeConsole` en producción.

## Pendientes Futuros

### Imágenes
- Migrar 8 archivos de `<img>` a `next/image`:
  - `warranty-card.tsx`, `order-card.tsx`, `cart-item.tsx`, `order-confirmation.tsx`, `order-summary.tsx`, `product-gallery.tsx`, `orders/[id]/page.tsx`, `reviews/page.tsx`
- Agregar `remotePatterns` a `next.config.ts` cuando se usen imágenes externas.

### Core Web Vitals Targets
| Métrica | Target | Estado |
|---------|--------|--------|
| LCP | < 2.5s | Preparado (next/image pendiente) |
| FID / INP | < 200ms | Preparado (server components + bundle splitting) |
| CLS | < 0.1 | Preparado (sticky elements con z-index, tamaños definidos) |
| TTFB | < 800ms | Preparado (server components + edge-ready) |

### Lighthouse
Para alcanzar scores >95:
- Performance: Migrar imágenes a next/image, lazy loading, WebP/AVIF.
- Accessibility: Correcciones aplicadas (ver informe de accesibilidad).
- Best Practices: Sin issues detectados.
- SEO: Metadata agregada en páginas faltantes.
