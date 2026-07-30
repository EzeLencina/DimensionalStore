# Iconography Guide

## Library
All icons come from **Lucide React** v0.460+.

## Guidelines
- Default icon size: 16px (h-4 w-4)
- Small icon size: 14px (h-3.5 w-3.5)
- Large icon size: 20px (h-5 w-5) — for navigation items
- XL icon size: 24px (h-6 w-6) — for empty states
- Stroke width: Default (2px) for most icons
- Stroke width: 1.5px for decorative/hero icons
- Stroke width: 3px for checkbox/radio indicators

## Icon Placement
- Leading icons: Left-aligned in buttons, inputs
- Trailing icons: Right-aligned for dropdown chevrons, close buttons
- Standalone icons: Always include `aria-label` or `aria-hidden="true"`
- Decorative icons: Use `aria-hidden="true"` and hide from screen readers

## Usage Examples
```tsx
// Interactive icon button
<button aria-label="Settings">
  <Settings className="h-4 w-4" />
</button>

// Decorative icon
<AlertCircle className="h-4 w-4" aria-hidden="true" />

// Icon in input
<Search className="absolute left-3 h-4 w-4 text-muted-foreground" />
```

## Custom Icons
- No custom SVG icons — use Lucide exclusively
- For unique brand icons, use an `<img>` or `next/image` with proper alt text
