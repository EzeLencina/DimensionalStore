# Animation Guide

## Duration Tokens

| Token | Value | Usage |
|-------|-------|-------|
| instant | 0ms | Instant state changes |
| fast | 100ms | Hover states, micro-interactions |
| normal | 200ms | Default transitions |
| slow | 300ms | Modals, drawers, dropdowns |
| slower | 400ms | Page transitions |
| slowest | 500ms | Emphasis animations |
| emphasis | 700ms | Hero animations |

## Easing Curves

| Token | Curve | Usage |
|-------|-------|-------|
| linear | `linear` | Progress bars, spinners |
| in | `cubic-bezier(0.4, 0, 1, 1)` | Exit animations |
| out | `cubic-bezier(0, 0, 0.2, 1)` | Entrance animations |
| inOut | `cubic-bezier(0.4, 0, 0.2, 1)` | Standard transitions |
| spring | `cubic-bezier(0.34, 1.56, 0.64, 1)` | Bouncy entrances |
| emphasize | `cubic-bezier(0.2, 0, 0, 1)` | Hero animations |

## Available Keyframes

| Name | Purpose |
|------|---------|
| fade-in / fade-out | Opacity transitions |
| slide-in-from-top/bottom/left/right | Directional entrances |
| slide-out-to-top/bottom/left/right | Directional exits |
| scale-in / scale-out | Zoom transitions |
| spin | Loading spinners |
| pulse | Skeleton loading |
| accordion-down / accordion-up | Accordion expand/collapse |
| overlay-show / overlay-hide | Modal overlay |
| content-show / content-hide | Modal content |

## Reduced Motion
All animated elements respect `prefers-reduced-motion: reduce`:
- Transitions become instant (0ms)
- Scale/transform animations are disabled
- Use `useReducedMotion()` hook for JS animations
- Radix components handle this automatically via `data-[state]` attributes
