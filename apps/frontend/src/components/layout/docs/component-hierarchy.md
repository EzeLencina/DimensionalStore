# Component Hierarchy

## Layout Components

```
MainLayout
├── [props] showAnnouncement, showTopBar, hideOnScroll, showNewsletter
├── SkipToContent (a11y: skip to #main-content)
├── Header (sticky, z-30, backdrop-blur)
│   ├── AnnouncementBar (dismissible, configurable, bg-primary)
│   ├── TopBar (hidden md:block, configurable via topBarConfig)
│   │   ├── CurrencySelector (dropdown, mock data)
│   │   └── LanguageSelector (dropdown, ES/EN/PT)
│   ├── Container (max-w-[90rem])
│   │   ├── Mobile menu button (lg:hidden)
│   │   ├── Logo (Store icon + "Tienda" text)
│   │   ├── SearchBar (lg:flex)
│   │   │   └── SearchPanel (dropdown with recent/popular/suggestions)
│   │   ├── Nav links (Ofertas, Novedades)
│   │   ├── Icon group
│   │   │   ├── User link (/cuenta)
│   │   │   ├── Favorites link (/cuenta/favoritos)
│   │   │   ├── Comparer link (/compara)
│   │   │   ├── Theme toggle (light/dark)
│   │   │   └── Cart link (/carrito, with badge)
│   │   ├── MegaMenu (categories, subcategories, brands, featured)
│   │   └── SearchBar mobile (lg:hidden)
│   └── MobileMenu (drawer, full category tree)
└── Footer
    ├── Newsletter (email form with idle/loading/success/error states)
    ├── Footer sections (4-column grid)
    ├── Payment/Shipping/Social row
    └── Copyright bar

Container (reusable)
├── [props] size (sm/md/lg/xl/full), as (polymorphic)
└── Responsive padding (px-4 sm:px-6 lg:px-8)

Section (reusable)
├── [props] spacing (none/sm/md/lg/xl), variant (default/muted/primary/dark)
└── Padding + background presets

PageContainer
├── [props] topPadding, bottomPadding
└── min-h-screen + padding

ContentWrapper
├── [props] maxWidth (prose/narrow/default/wide)
└── Centered max-width wrapper
```

## Navigation Components

```
MegaMenu
├── Categories (triggers on hover)
│   └── MegaMenuPanel (absolute positioned)
│       ├── Subcategories grid (4-col)
│       │   └── Subcategory links
│       │       └── Child links
│       ├── Brands sidebar
│       └── Featured banner
└── View all link

MobileMenu
├── Overlay (bg-black/50, closes on click)
├── Drawer (left, max-w-sm, slide-in)
│   ├── Header (title + close button)
│   ├── Categories list
│   │   ├── Category (expandable)
│   │   │   ├── Subcategory (expandable)
│   │   │   │   └── Child link
│   │   │   └── View all link
│   ├── Nav pages (Ofertas, Novedades, Marcas, Contacto)
│   └── Account section
│       ├── Account links
│       └── Sign out button

TopBar
├── Info items (shipping, payments, warranty, support, promos)
├── CurrencySelector
└── LanguageSelector
```

## Search Components

```
SearchBar
├── Input with search icon + clear button
├── Autocomplete panel
│   ├── Recent searches (Clock icon)
│   ├── Popular trends (TrendingUp icon)
│   ├── Suggestions (filtered)
│   ├── Voice search (Mic icon, future)
│   └── Image search (ImageIcon, future)
└── States: focused, query >= 2 chars, empty
```

## State Components

```
Newsletter
├── States: idle → loading → success / error
├── Email input + submit button
├── Success: CheckCircle2 icon + message
├── Error: AlertCircle + retry button
└── Variants: default / muted / primary

Breadcrumb
├── Items array (label + optional href)
├── Show home option
├── Truncated labels (max-w-[200px])
└── aria-current="page" on last
```
