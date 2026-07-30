# SEO Strategy

## Metadata API

```tsx
// app/(public)/page.tsx
export const metadata: Metadata = {
  title: 'Tienda — Seguridad Inteligente y Domótica',
  description: '...',
  openGraph: { ... },
  twitter: { card: 'summary_large_image', ... },
  alternates: { canonical: '/' },
};
```

## Structure

### Title Tag
- Format: `Primary Keyword | Tienda`
- Home: `Tienda — Seguridad Inteligente y Domótica`
- Max 60 characters

### Meta Description
- 150-160 characters
- Includes primary keywords + CTA
- Unique per page

### Open Graph
- `og:title` — Same as title tag
- `og:description` — Same as meta description
- `og:image` — 1200x630px, WebP format
- `og:type` — website
- `og:locale` — es_AR

### Twitter Cards
- `twitter:card` — summary_large_image
- `twitter:title` — Same as title tag
- `twitter:description` — Same as meta description

### Canonical URL
- Every page: `<link rel="canonical" href="https://tienda.com/...">`

### Robots
- Home: `index, follow`
- Account, Checkout: `noindex, nofollow`

### JSON-LD (for future implementation)
```json
{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "Tienda",
  "url": "https://tienda.com",
  "potentialAction": {
    "@type": "SearchAction",
    "target": "https://tienda.com/buscar?q={search_term_string}",
    "query-input": "required name=search_term_string"
  }
}
```

## Semantic HTML
- `<h1>`: Hero title (unique per page)
- `<h2>`: Section titles (Categories, Featured Products, etc.)
- `<h3>`: Product names, card titles
- `<nav>`: MegaMenu, Breadcrumb
- `<main id="main-content">`: Page content
- `<section aria-label="...">`: Each home section
- `<article>`: Product cards, Testimonial cards
- `<blockquote>`: Testimonial quotes

## Performance SEO
- `next/image` with lazy loading (priority on Hero)
- Static metadata at page level
- Semantic HTML for crawlers
- Robots.txt and Sitemap prepared (static/next-gen)
