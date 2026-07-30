# Frontend — Next.js

## Stack

- **Framework**: Next.js 15, App Router
- **Language**: TypeScript Strict
- **Styling**: TailwindCSS 3.4, shadcn/ui
- **State**: TanStack Query v5 (server), Zustand v5 (client)
- **Forms**: React Hook Form + Zod
- **Charts**: Recharts
- **Testing**: Vitest

## Estructura

```
src/
├── app/                    # App Router
│   ├── (public)/           # Site público
│   ├── (admin)/            # Panel admin
│   ├── (auth)/             # Login/Register
│   ├── (vendor)/           # Portal vendedor
│   ├── api/health/         # Health endpoint
│   ├── layout.tsx          # Root layout + providers
│   ├── page.tsx            # Home
│   └── ...                 # SEO, loading, error, 404
├── components/             # UI components
│   └── ui/                 # shadcn/ui
├── features/               # Business features
│   ├── auth/
│   ├── products/
│   ├── sales/
│   └── ...
├── providers/              # Global providers
├── services/               # API, HTTP, Storage, Auth
├── lib/                    # Utilities (formatters, helpers)
├── config/                 # App, API, theme config
├── hooks/                  # Custom hooks
├── stores/                 # Zustand stores
└── types/                  # Shared types
```

## Ruteo

| Ruta | Layout | Tipo |
|------|--------|------|
| `/` | public | Static |
| `/admin/*` | admin | Dynamic |
| `/auth/*` | auth | Dynamic |
| `/vendor/*` | vendor | Dynamic |
| `/api/*` | - | API routes |

## Provider Tree

```
<ThemeProvider>        ← next-themes (class strategy)
  <QueryProvider>      ← TanStack Query + DevTools
    <ModalProvider>    ← Modales globales
      {children}
      <ToastProvider /> ← Sonner
```

## Path Aliases

| Alias | Path |
|-------|------|
| `@/*` | `./src/*` |
| `@components/*` | `./src/components/*` |
| `@features/*` | `./src/features/*` |
| `@providers/*` | `./src/providers/*` |
| `@services/*` | `./src/services/*` |
| `@lib/*` | `./src/lib/*` |
| `@config/*` | `./src/config/*` |
| `@types/*` | `./src/types/*` |

## Performance

- Server Components por defecto
- Lazy loading con `next/dynamic`
- Imágenes optimizadas con `next/image` (AVIF/WebP)
- TanStack Query staleTime: 60s
- Code splitting automático por ruta

## SEO

- Metadata API con `generateMetadata()`
- Open Graph image dinámica
- Sitemap dinámico
- Robots.txt (desindexa admin, vendor, api)
- PWA manifest

## Comandos

```bash
pnpm --filter @tienda/frontend dev       # Desarrollo
pnpm --filter @tienda/frontend build     # Producción
pnpm --filter @tienda/frontend test      # Tests
pnpm --filter @tienda/frontend typecheck # TypeScript
```
