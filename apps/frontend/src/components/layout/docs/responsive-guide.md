# Responsive Guide

## Breakpoints

| Class | Min Width | Target |
|-------|-----------|--------|
| `sm` | 640px | Tablet portrait |
| `md` | 768px | Tablet landscape |
| `lg` | 1024px | Laptop |
| `xl` | 1280px | Desktop |
| `2xl` | 1536px | UltraWide |

## Layout Behavior

### Announcement Bar
- **Mobile**: Truncated text, no CTA button
- **Desktop**: Full text + CTA link + dismiss button

### Top Bar
- **Mobile (<768px)**: Hidden
- **Desktop (>=768px)**: Full width with info icons + currency/language selectors
- **UltraWide**: Same as desktop, centered in Container

### Header
- **Mobile (<1024px)**:
  - Hamburger menu (triggers MobileMenu drawer)
  - Logo + Search (full width below icons)
  - Icons: Theme toggle + Cart (always visible)
  - Icons: User, Favorites, Comparer (hidden on mobile)
- **Desktop (>=1024px)**:
  - Logo + centered Search + Nav links + all icons
  - MegaMenu below header row
  - Sticky with backdrop-blur

### Search Bar
- **Mobile**: Full width, below header icons
- **Desktop**: Centered, max-w-2xl

### Mega Menu
- **Mobile (<1024px)**: Hidden (use MobileMenu instead)
- **Desktop (>=1024px)**: Visible, horizontal nav with dropdown panels

### Mobile Menu (Drawer)
- **Mobile (<1024px)**: Full screen (max-w-sm), slide from left
- **Desktop (>=1024px)**: Hidden
- Backdrop overlay on open
- Body scroll locked when open

### Footer
- **Mobile**: 2-column grid for sections
- **Desktop**: 4-column grid
- **Payment/Shipping/Social**: Stacked on mobile, 3-column on desktop

### Containers
| Container | Mobile (px) | Tablet (px) | Desktop (px) |
|-----------|-------------|-------------|--------------|
| Padding | 4 (16px) | 6 (24px) | 8 (32px) |
| sm | 100% | 640px | 768px |
| md | 100% | 768px | 1024px |
| lg | 100% | 1024px | 1280px |
| xl | 100% | 1024px | 1440px |

## Accessibility at Breakpoints
- Skip to content link works at all breakpoints
- Touch targets: minimum 44x44px on mobile (icons use p-2 = 8px + 20px = 36px minimum)
- Focus rings visible across all viewports
- `prefers-reduced-motion`: all animations disabled
