# Home — Tree Structure

```
(public)/page.tsx
├── Hero                          ('use client')
│   ├── HeroSlideCard x3          (slider with CTAs)
│   ├── Prev/Next buttons
│   └── Slide indicators
│
├── Categories                    (Server Component)
│   └── Grid of CategoryCard      (6 cards, from DS)
│
├── FeaturedProducts              ('use client')
│   └── Grid of ProductCard       (8 products, custom interactive cards)
│       ├── Badge                 (from DS)
│       ├── Icon overlay          (favorites, compare, quick view)
│       ├── Price                 (from DS helpers)
│       ├── Rating                (from DS)
│       └── Action buttons        (Buy + Details)
│
├── Deals                         ('use client')
│   ├── CountdownTimer            (live countdown)
│   └── Grid of deal cards        (4 deals)
│       ├── Badge (danger)
│       ├── Price
│       └── Rating
│
├── Brands                        ('use client')
│   └── Horizontal scroll container
│       ├── Brand cards x16       (8 brands x2, infinite scroll)
│       └── Scroll buttons
│
├── Benefits                      (Server Component)
│   └── Grid of benefit cards     (6 benefits)
│       └── Icon per card
│
├── Promotions                    ('use client')
│   └── PromoBannerCard           (campaign banners with slider)
│       ├── Campaign badge
│       ├── Title + subtitle
│       ├── CTA button
│       ├── Nav buttons
│       └── Dots
│
├── Testimonials                  ('use client')
│   └── Grid of testimonial cards (4 testimonials)
│       ├── Avatar                (from DS)
│       ├── Name + role
│       ├── Rating                (from DS)
│       └── Quote
│
├── Faq                           ('use client')
│   └── Accordion                 (from DS)
│       └── AccordionItem x6
│
└── Cta                           (Server Component)
    └── Gradient banner
        ├── Title + description
        ├── Primary CTA
        ├── Secondary CTA
        └── Decorative element
```

## Component Reuse from Design System

| DS Component | Used In |
|---|---|
| Button (CVA) | Hero, FeaturedProducts, Deals, Promotions, Cta |
| Badge | FeaturedProducts, Deals |
| Card | (indirectly via cards) |
| Avatar | Testimonials |
| Rating | FeaturedProducts, Deals, Testimonials |
| Accordion | Faq |
| SectionTitle | Categories, FeaturedProducts, Brands, Testimonials, Faq |
| CategoryCard | Categories |
| Container | All sections |
| Price helpers | FeaturedProducts, Deals |

## Component Reuse from Layout

| Layout Component | Used In |
|---|---|
| Container | All sections |
| Section | All sections (via manual padding) |
| Newsletter | (inherited from Footer in MainLayout) |
