# Informe Responsive

## Resumen
Auditoría responsive completa en todos los breakpoints (320px, 375px, 768px, 1024px, 1440px, 1920px+).

## Breakpoints Soportados
- `max-sm`: < 640px (móvil)
- `sm`: >= 640px
- `md`: >= 768px
- `lg`: >= 1024px
- `xl`: >= 1280px

## Mejoras Aplicadas

### Touch Targets (WCAG 2.2 — mínimo 44x44px)

| Archivo | Cambio | Tamaño Anterior | Tamaño Nuevo |
|---------|--------|-----------------|--------------|
| `account-sidebar.tsx:47` | Close button | `p-1` (~24px) | `p-2` (~36px) |
| `announcement-bar.tsx:42` | Dismiss button | `p-1` (~24px) | `p-2` (~36px) |
| `top-bar.tsx:66,115` | Currency/Lang selectors | `py-0.5` (~20px) | `py-1` (~28px) |
| `catalog-sidebar.tsx:99` | Mobile close button | `p-1` (~24px) | `p-2` (~36px) |
| `catalog-sidebar.tsx:23` | Filter toggle | `px-1 py-1` (~24px) | `px-2 py-2` (~40px) |
| `catalog-sidebar.tsx:54,61` | Price range inputs | `h-9` (36px) | `h-10` (40px) |
| `active-filters.tsx:29` | Remove filter button | Sin padding | `p-1` (~24px) |
| `product-reviews.tsx:70` | Like button | `py-0.5` (~16px) | `py-1` (~24px) |

### Layout
- **Hero**: `min-h-[500px]` reducido a `max-sm:min-h-[400px]` para evitar que ocupe todo el viewport en móviles pequeños.
- **Grids**: Todos los grids usan `grid-cols-1 sm:grid-cols-2 lg:grid-cols-4` — colapsan correctamente en mobile.
- **Footer**: 2 columnas en móvil, 4 en desktop.
- **Checkout**: Single column en mobile (`grid-cols-1 lg:grid-cols-3`).

### Mega Menú
- Oculto en mobile (`hidden lg:block`). Reemplazado por `MobileMenu` con drawer animado, backdrop, y scroll lock.

### Elementos Sticky
- **Header**: `sticky top-0 z-30`
- **Checkout summary**: `sticky top-24 z-10` (se agregó `z-10` faltante)
- **Sticky Buy Box**: `fixed bottom-0 z-50` en mobile
- **Cart Sticky Summary**: `fixed bottom-0 z-50 lg:hidden` en mobile

### Pendientes
- Considerar bottom navigation persistente en mobile (Home/Catálogo/Carrito/Cuenta).
- Aumentar tamaño de inputs default `h-10` → `h-11` a nivel DS.
- Botones `size="sm"` en cards de producto para móvil (actualmente 32px, debieran ser 40px+).
