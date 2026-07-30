# Performance Guide

## Component Splitting

### Server Components (no 'use client')
| Component | Reason |
|---|---|
| Categories | Static data, no interactivity |
| Benefits | Static icons + text |
| Cta | Static content, link navigation |
| page.tsx | Can be SC, renders children |

### Client Components ('use client')
| Component | Reason |
|---|---|
| Hero | Slider state, auto-play, mouse events |
| FeaturedProducts | Hover overlays, click handlers |
| Deals | Countdown timer (useEffect) |
| Brands | Scroll buttons, horizontal scroll |
| Promotions | Slider state |
| Testimonials | (can be SC, but using Rating from DS) |
| Faq | Accordion (Radix requires client) |

## Image Optimization

```tsx
// Hero images (above the fold) - use priority
<Image priority fill sizes="100vw" ... />

// Product images - lazy by default
<Image loading="lazy" fill sizes="(max-width: 640px) 50vw, 25vw" ... />
```

## Performance Checklist

- [x] Server Components by default
- [x] Client Components only when needed
- [x] No useEffect in Server Components
- [x] next/image with proper sizes
- [x] No unnecessary re-renders
- [x] No CSS duplication (all from DS or Tailwind)
- [x] Minimal JS bundle (client components are small)
- [x] No API calls
- [x] No external dependencies for home section
- [x] Static metadata (no async metadata needed)
- [x] Tabular-nums for countdown (prevents layout shift)

## Lighthouse Targets

| Metric | Target |
|---|---|
| Performance | >95 |
| Accessibility | 100 |
| Best Practices | 100 |
| SEO | 100 |

## Bundle Size Notes
- Hero: Small client component (slider logic)
- Countdown: Small (single useEffect + setInterval)
- Brands carousel: Small (scroll handler)
- All DS components are pre-bundled
- No heavy animations libraries
