# Frontend — Tienda

Aplicación Next.js 15 con App Router, TypeScript Strict, TailwindCSS, shadcn/ui y Clean Architecture.

---

## Árbol completo

```
apps/frontend/
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
├── postcss.config.js
├── components.json          # shadcn/ui
├── .env
├── .env.example
│
└── src/
    ├── app/                  # App Router
    │   ├── (public)/         # Sitio público (layout)
    │   ├── (admin)/          # Panel admin (layout)
    │   ├── (vendor)/         # Portal vendedor (layout)
    │   ├── (auth)/           # Login/Register (layout)
    │   ├── api/health/       # Health endpoint
    │   ├── layout.tsx        # Root layout + Providers
    │   ├── loading.tsx       # Loading global
    │   ├── error.tsx         # Error boundary
    │   ├── not-found.tsx     # 404
    │   ├── page.tsx          # Home
    │   ├── globals.css       # Tailwind + CSS vars
    │   ├── sitemap.ts        # Sitemap dinámico
    │   ├── robots.ts         # Robots.txt
    │   ├── manifest.ts       # PWA manifest
    │   └── opengraph-image.tsx
    │
    ├── components/           # Componentes reutilizables
    │   ├── ui/               # shadcn/ui (futuros)
    │   ├── common/           # Componentes comunes
    │   ├── forms/            # Formularios
    │   ├── tables/           # Tablas
    │   ├── charts/           # Gráficos
    │   ├── navigation/       # Navbars, Sidebars, Breadcrumbs
    │   ├── feedback/         # Alertas, Modales, Toasts
    │   ├── layout/           # Contenedores, Secciones
    │   └── icons/            # Iconos
    │
    ├── features/             # Módulos de negocio (cada uno vacío)
    │   ├── auth/
    │   ├── dashboard/
    │   ├── products/
    │   ├── inventory/
    │   ├── sales/
    │   ├── purchases/
    │   ├── customers/
    │   ├── suppliers/
    │   ├── finance/
    │   ├── crm/
    │   ├── cms/
    │   ├── marketing/
    │   ├── analytics/
    │   ├── settings/
    │   └── notifications/
    │
    ├── providers/            # Providers globales
    │   ├── theme-provider.tsx
    │   ├── query-provider.tsx
    │   ├── session-provider.tsx
    │   ├── toast-provider.tsx
    │   ├── modal-provider.tsx
    │   └── index.ts
    │
    ├── services/             # Capa de servicios
    │   ├── api/              # ApiService
    │   ├── http/             # HttpService (fetch wrapper)
    │   ├── storage/          # StorageService (local/session)
    │   ├── cache/            # CacheService
    │   └── auth/             # AuthService
    │
    ├── stores/               # Zustand stores (futuro)
    ├── hooks/                # Custom hooks (futuro)
    │
    ├── lib/                  # Utilidades
    │   ├── helpers/          # cn() y helpers generales
    │   ├── formatters/       # date, currency, number
    │   ├── parsers/          # JSON seguro
    │   ├── date/             # Re-export de date
    │   ├── currency/         # Re-export de currency
    │   └── strings/          # slugify, truncate, capitalize
    │
    ├── config/               # Configuración
    │   ├── app.config.ts     # Nombre, versión, entorno
    │   ├── api.config.ts     # URL, timeout, retries
    │   ├── theme.config.ts   # Temas disponibles
    │   ├── routes.config.ts  # Rutas del sistema
    │   ├── navigation.config.ts  # Menús
    │   └── index.ts
    │
    ├── constants/            # Constantes (endpoints, HTTP status)
    ├── types/                # Tipos compartidos
    │   ├── index.ts
    │   ├── api.ts
    │   ├── theme.ts
    │   └── common.ts
    │
    ├── schemas/              # Zod schemas (futuro)
    ├── validators/           # Validators (futuro)
    │
    ├── layouts/              # Layout components reutilizables
    │   ├── public-layout.tsx
    │   ├── admin-layout.tsx
    │   ├── vendor-layout.tsx
    │   ├── auth-layout.tsx
    │   └── index.ts
    │
    ├── styles/               # Estilos adicionales
    ├── assets/               # Imágenes, fuentes, iconos
    │   └── images/
    │
    └── middleware.ts         # Next.js Middleware
```

---

## Explicación de carpetas

| Carpeta | Propósito |
|---------|-----------|
| `app/` | App Router con route groups para segmentar la app (público, admin, vendor, auth) + SEO endpoints |
| `components/` | Componentes UI reutilizables organizados por tipo. Los `ui/` se poblarán con shadcn/ui. |
| `features/` | Módulos de negocio. Cada feature contiene su propio ecosistema (components, hooks, services). Vacíos por ahora. |
| `providers/` | Providers globales que envuelven la app. Orden: Theme > Query > Modal > children > Toast |
| `services/` | Capa de abstracción para comunicaciones externas (API, HTTP, storage, cache, auth) |
| `stores/` | Estado global con Zustand (futura implementación) |
| `lib/` | Utilidades puras sin dependencias del negocio. Funciones de formateo, parseo, strings. |
| `config/` | Configuración de la aplicación: rutas, API, tema, navegación. |
| `constants/` | Constantes del sistema: endpoints API, códigos HTTP. |
| `types/` | Tipos TypeScript compartidos. |
| `schemas/` `validators/` | Esquemas Zod y validadores. |
| `layouts/` | Componentes layout reutilizables para cada sección. |
| `assets/` | Archivos estáticos: imágenes, fuentes. |
| `middleware.ts` | Middleware de Next.js (protección de rutas futura). |

---

## Estrategia de Features

Cada feature sigue el patrón **Feature-Based Modular**:

```
features/products/
├── components/    # Componentes específicos del feature
├── hooks/         # Hooks del feature
├── services/      # Llamadas API del feature
├── schemas/       # Esquemas Zod del feature
├── types/         # Tipos del feature
└── index.ts       # Barrel export
```

Los features no se comunican entre sí directamente. Usan providers/services globales o eventos.

---

## Flujo de Providers

```
<html>
  <ThemeProvider>          ← next-themes (class strategy)
    <QueryProvider>        ← TanStack Query + DevTools
      <ModalProvider>      ← Modales globales
        {children}
        <ToastProvider />  ← Sonner toasts (render fuera del contenido)
      </ModalProvider>
    </QueryProvider>
  </ThemeProvider>
</html>
```

---

## Convenciones de Componentes

1. **Server Components por defecto** — Usar `'use client'` solo cuando sea necesario.
2. **Small + SRP** — Un componente, una responsabilidad.
3. **Composición** — Preferir composición sobre props gigantes.
4. **Componentes de presentación** en `components/`.
5. **Componentes de negocio** dentro de `features/<name>/components/`.
6. **shadcn/ui** en `components/ui/`, modificados via `cn()`.

---

## Convenciones de Imports

Usar siempre los path aliases configurados:

```ts
// ✅ Correcto
import { Button } from '@components/ui/button';
import { formatCurrency } from '@lib/currency';
import { apiConfig } from '@config/api.config';
import { useProducts } from '@features/products/hooks/use-products';

// ❌ Incorrecto — rutas relativas profundas
import { Button } from '../../../components/ui/button';
```

### Aliases disponibles

| Alias | Resuelve a |
|-------|-----------|
| `@/` | `./src/*` |
| `@components/*` | `./src/components/*` |
| `@features/*` | `./src/features/*` |
| `@hooks/*` | `./src/hooks/*` |
| `@providers/*` | `./src/providers/*` |
| `@services/*` | `./src/services/*` |
| `@stores/*` | `./src/stores/*` |
| `@lib/*` | `./src/lib/*` |
| `@config/*` | `./src/config/*` |
| `@schemas/*` | `./src/schemas/*` |
| `@styles/*` | `./src/styles/*` |
| `@assets/*` | `./src/assets/*` |
| `@types/*` | `./src/types/*` |
| `@constants/*` | `./src/constants/*` |
| `@layouts/*` | `./src/layouts/*` |

---

## Estrategia de Performance

- **Server Components** — Renderizado en servidor por defecto. `'use client'` solo con interactividad.
- **Lazy Loading** — Componentes pesados con `next/dynamic`.
- **Dynamic Imports** — Iconos de lucide-react, gráficos de recharts.
- **Image Optimization** — `next/image` con AVIF/WebP y deviceSizes configurados.
- **Code Splitting** — Automático por ruta en App Router.
- **Prefetch** — `<Link>` prefetch por defecto en viewport.
- **Caching** — `staleTime: 60s` en TanStack Query para evitar re-fetch innecesario.

---

## Estrategia SEO

- **Metadata API** — `generateMetadata()` por ruta.
- **Open Graph** — Imagen dinámica vía `opengraph-image.tsx` (Edge Runtime).
- **Twitter Cards** — Configurable desde metadata.
- **Sitemap** — Dinámico via `sitemap.ts`.
- **Robots** — Via `robots.ts` (desindexa `/admin/`, `/vendedor/`, `/api/`).
- **Manifest** — PWA manifest via `manifest.ts`.
- **Favicons** — En `public/`.

---

## Estado actual

✅ Compilación exitosa (`next build`)

Rutas generadas:

| Ruta | Tipo |
|------|------|
| `/` | Static |
| `/api/health` | Dynamic |
| `/robots.txt` | Static |
| `/sitemap.xml` | Static |
| `/manifest.webmanifest` | Static |
| `/opengraph-image` | Static |

---

## Comandos

```bash
pnpm dev          # Desarrollo
pnpm build        # Producción
pnpm lint         # ESLint
pnpm typecheck    # TypeScript
pnpm test         # Vitest
```
