# Accessibility Guide

## WCAG AA Compliance

### Skip Navigation
- `SkipToContent` component renders first in MainLayout
- Visible on focus (sr-only → focus:not-sr-only)
- Scrolls to `#main-content` on the `<main>` element

### Landmarks
- `<header>` — Header component
- `<nav>` — MegaMenu, MobileMenu, Breadcrumb
- `<main id="main-content">` — Page content
- `<footer>` — Footer component
- `<section aria-label="...">` — Newsletter, sections

### ARIA Attributes
- SearchBar: `role="search"`, `aria-expanded`, `aria-controls`, `aria-autocomplete="list"`, `aria-label`
- MegaMenu: `aria-expanded`, `aria-haspopup="dialog"`, `role="dialog"`
- MobileMenu: `role="dialog"`, `aria-modal="true"`, `aria-label="Navigation menu"`
- Breadcrumb: `aria-label="Breadcrumb"`, `aria-current="page"` on last item
- AnnouncementBar: `role="banner"`, `aria-label="Announcement"`
- Cart/Favorites buttons: `aria-label` with dynamic count
- Theme toggle: `aria-label` changes based on current theme
- Currency/Language selectors: `aria-expanded`, `aria-haspopup="listbox"`, `role="option"`, `aria-selected`
- Icons: `aria-hidden="true"` for decorative icons

### Keyboard Navigation
- All interactive elements reachable via Tab
- `focus-visible:ring-2 focus-visible:ring-ring` on all interactive elements
- MegaMenu: opens on `mouseenter`, closes on `mouseleave`
- MobileMenu: Escape key closes via Radix Dialog
- SearchBar: Enter submits, Escape closes panel
- Skip link: First tab stop

### Focus Management
- Focus ring: 2px solid with 2px offset using `--ring` color
- MobileMenu: focus trapped inside drawer while open
- SearchBar: focus moves to input on open

### Color & Contrast
- All color combinations meet WCAG AA (4.5:1 for text, 3:1 for large text)
- Focus rings use `--ring` color with sufficient contrast
- Disabled elements use `opacity-40` (40% opacity)
- Error states use `--destructive` (red) with icon indicator

### Reduced Motion
- All animations use Tailwind's `animate-in`/`animate-out` utilities, which respect `prefers-reduced-motion: reduce`
- No autoplay animations
- Transitions are `duration-200` (200ms) maximum
- `useReducedMotion()` hook available for JS animations

### Screen Readers
- SVG icons: `aria-hidden="true"` when decorative, `aria-label` when interactive
- Badge counts on cart/favorites: included in `aria-label`
- Loading states: `role="status"` and `aria-label`
- Breadcrumb: `<nav>` landmark + `aria-current`
- Newsletter: `<label htmlFor="newsletter-email" className="sr-only">`
- Skip link visible on focus for keyboard users

### Touch Targets
- All interactive elements: minimum 36px (p-2 = 8px padding + 20px icon)
- Mobile menu items: 44px touch target (py-2.5 + px-3)
- Bottom bar buttons: 44px minimum
