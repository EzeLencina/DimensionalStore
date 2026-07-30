# @tienda/ui — Design System

Design System oficial de la plataforma Tienda. Construido con Next.js 15, React 19, TailwindCSS, Radix UI, shadcn/ui y Lucide Icons.

## Stack

- **Framework:** React 19
- **Build:** TypeScript Strict
- **Styling:** TailwindCSS v3+ (CSS custom properties)
- **Primitives:** Radix UI (30+ packages)
- **Icons:** Lucide React
- **Variants:** Class Variance Authority
- **Merging:** tailwind-merge + clsx
- **Theming:** next-themes (light/dark/system)

## Estructura

```
src/
├── tokens/       — Design tokens (colors, typography, spacing, etc.)
├── styles/       — Global CSS with design token variables
├── lib/          — Utilities (cn, formatPrice, etc.)
├── types/        — Shared TypeScript types
├── hooks/        — Visual hooks (useMediaQuery, useReducedMotion, etc.)
├── providers/    — Theme provider
├── components/
│   ├── ui/       — Core primitives (30+ components)
│   ├── commerce/ — Ecommerce domain components
│   ├── layout/   — Layout components
│   └── states/   — Empty/Error/Loading states
└── index.ts      — Barrel exports
```

## Componentes

### UI Primitives
Button, Input, Textarea, Select, Checkbox, Radio, Switch, Badge, Chip, Alert, Toast, Card, Dialog, Drawer, Popover, Tooltip, Dropdown, Tabs, Accordion, Avatar, Skeleton, Spinner, Pagination, Breadcrumb, Table, Container

### Commerce
Price, Rating, ProductCard, CategoryCard, ProductBadge, SearchInput

### Layout
Container, Grid, SectionTitle

### States
EmptyState, ErrorState, LoadingState

## Hooks
useMediaQuery, useReducedMotion, useKeyboard, useScrollLock, useIntersection, useDebounce, useLocalStorage

## Design Tokens
- **Colors:** Brand palette (blue-based), neutral scale, semantic colors
- **Typography:** 7 display + 4 heading + 5 body + caption + overline + code sizes
- **Spacing:** 8px grid system
- **Shadows:** 7 elevation levels + 3 glow effects
- **Animations:** 7 durations, 7 easing curves, 20+ keyframes
- **Breakpoints:** 8 responsive breakpoints
- **Z-index:** 9 semantic layers

## Uso

```tsx
import { Button, Card, ThemeProvider } from '@tienda/ui';

function App() {
  return (
    <ThemeProvider>
      <Card>
        <Button variant="primary" size="lg">
          Click me
        </Button>
      </Card>
    </ThemeProvider>
  );
}
```

## Modo Claro/Oscuro
El sistema soporta modo claro y oscuro mediante `next-themes`. Los tokens CSS se definen en `:root` (light) y `.dark` (dark).

```tsx
import { ThemeProvider } from '@tienda/ui';

// En el layout root
<ThemeProvider
  attribute="class"
  defaultTheme="system"
  enableSystem
  storageKey="tienda-theme"
>
  {children}
</ThemeProvider>
```

## Accesibilidad
- WCAG AA compliant
- Full keyboard navigation
- Focus visible indicators
- ARIA labels and roles
- Screen reader support
- Reduced motion support
