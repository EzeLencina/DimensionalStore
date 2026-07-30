# Design System — Component Tree

```
@tienda/ui
├── tokens/
│   ├── colors.ts        — Brand, neutral, semantic color palettes
│   ├── typography.ts    — Font families, size scale, font weights
│   ├── spacing.ts       — 8px-grid spacing scale + border radius
│   ├── shadows.ts       — Elevation shadows + glow effects
│   ├── animations.ts    — Duration, easing, keyframes
│   ├── breakpoints.ts   — Responsive breakpoints + media queries
│   ├── z-index.ts       — Layer stacking constants
│   └── opacity.ts       — Semantic opacity values
│
├── styles/
│   └── globals.css      — Global CSS with light/dark CSS custom properties
│
├── lib/
│   ├── cn.ts            — clsx + tailwind-merge utility
│   └── helpers.ts       — formatPrice, truncate, clamp, slug, etc.
│
├── types/
│   └── common.ts        — Shared TypeScript types (Size, Variant, etc.)
│
├── hooks/
│   ├── use-media-query.ts    — Reactive media query hook
│   ├── use-reduced-motion.ts — prefers-reduced-motion hook
│   ├── use-keyboard.ts       — Keyboard event map hook
│   ├── use-scroll-lock.ts    — Body scroll lock
│   ├── use-intersection.ts   — IntersectionObserver hook
│   ├── use-debounce.ts       — Generic debounce hook
│   └── use-local-storage.ts  — Persisted state hook
│
├── providers/
│   ├── theme-provider.tsx    — next-themes wrapper
│   └── index.ts
│
├── components/
│   ├── ui/                   — Core primitives
│   │   ├── button/           — Button with CVA variants + sizes
│   │   ├── input/            — Text input with adornments + error state
│   │   ├── textarea/         — Textarea with error state
│   │   ├── select/           — Native select with chevron
│   │   ├── checkbox/         — Radix checkbox
│   │   ├── radio/            — Radix radio group
│   │   ├── switch/           — Radix switch
│   │   ├── badge/            — Badge with color variants
│   │   ├── chip/             — Chip with optional removal
│   │   ├── alert/            — Alert with semantic icon + close
│   │   ├── toast/            — Radix toast system
│   │   ├── card/             — Card with header/content/footer
│   │   ├── dialog/           — Radix dialog modal
│   │   ├── drawer/           — Radix dialog-based slide drawer
│   │   ├── dropdown/         — Radix dropdown menu
│   │   ├── tooltip/          — Radix tooltip
│   │   ├── popover/          — Radix popover
│   │   ├── tabs/             — Radix tabs
│   │   ├── accordion/        — Radix accordion
│   │   ├── avatar/           — Radix avatar with fallback
│   │   ├── skeleton/         — Skeleton loading placeholder
│   │   ├── spinner/          — SVG spinner with CVA
│   │   ├── pagination/       — Pagination with navigation
│   │   ├── breadcrumb/       — Breadcrumb navigation
│   │   ├── table/            — Accessible table
│   │   └── container/        — Max-width container (also in layout)
│   │
│   ├── commerce/             — Ecommerce domain components
│   │   ├── price/            — Price with sale/original display
│   │   ├── rating/           — Star rating display + input
│   │   ├── product-card/     — Product card with image/badge/price
│   │   ├── category-card/    — Category card with image
│   │   ├── product-badge/    — Semantic product badges
│   │   └── search-input/     — Search with debounce + clear
│   │
│   ├── layout/               — Layout components
│   │   ├── container/        — Max-width container
│   │   ├── grid/             — Responsive grid system
│   │   └── section-title/    — Section heading with description+action
│   │
│   └── states/               — Empty/Error/Loading state screens
│       ├── empty-state/      — Empty state with icon+action
│       ├── error-state/      — Error state with retry
│       └── loading-state/    — Loading state with spinner
│
└── index.ts                  — Barrel exports
```
