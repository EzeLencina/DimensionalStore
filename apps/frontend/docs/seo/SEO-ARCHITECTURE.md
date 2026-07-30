# Arquitectura SEO

## Estructura de archivos

```
src/
├── app/
│   ├── robots.ts              # robots.txt dinámico
│   ├── sitemap.ts             # Sitemap dinámico (home, catálogo, categorías, marcas, productos)
│   ├── manifest.ts            # Web Manifest
│   ├── layout.tsx             # Metadata global + OrganizationSchema + WebsiteSchema
│   └── (public)/
│       └── page.tsx           # Home + FaqSchema
├── components/
│   └── seo/
│       ├── index.ts           # Barrel
│       ├── json-ld.tsx        # Base JSON-LD component (script type="application/ld+json")
│       └── schemas.tsx        # OrganizationSchema, WebsiteSchema, ProductSchema, BreadcrumbSchema, FaqSchema
└── lib/
    └── seo/
        ├── index.ts           # Barrel
        ├── constants.ts       # SITE_NAME, SITE_URL, ORGANIZATION, ROBOTS_RULES, etc.
        ├── metadata.ts        # buildMetadata(), buildProductMetadata(), buildCategoryMetadata(), buildBrandMetadata()
        └── schema.ts          # organizationSchema(), websiteSchema(), productSchema(), breadcrumbSchema(), faqSchema()
```

## Metadata Strategy

### Title Template
`%s | Tienda` — todas las páginas usan este template.

### Title por tipo de página
| Página | Formato | Ejemplo |
|--------|---------|---------|
| Home | `Tienda — {keywords}` | `Tienda — Seguridad Inteligente y Domótica` |
| Producto | `{nombre} — Tienda` | `Cerradura Inteligente Yale YRD256 — Tienda` |
| Categoría | `{nombre} | Seguridad y Control de Acceso — Tienda` | `Cerraduras Inteligentes | Seguridad y Control de Acceso — Tienda` |
| Marca | `Productos {marca} — Tienda` | `Productos Yale — Tienda` |
| Catálogo | `Catálogo — Tienda | {keywords}` | `Catálogo — Tienda | Seguridad Inteligente y Domótica` |

### Global Metadata
- `keywords`: términos clave de seguridad inteligente y domótica
- `authors`, `creator`, `publisher`: Tienda
- `theme-color`: #1e293b
- `manifest`: /manifest.webmanifest
- OpenGraph locale: es_AR
- Twitter card: summary_large_image

## URL Structure

| Tipo | Patrón | Ejemplo |
|------|--------|---------|
| Home | `/` | `/` |
| Producto | `/producto/{slug}` | `/producto/cerradura-inteligente-yale-yrd256` |
| Categoría | `/categoria/{slug}` | `/categoria/cerraduras-inteligentes` |
| Subcategoría | `/categoria/{parent}/{child}` | `/categoria/cerraduras-inteligentes/wifi` |
| Marca | `/marca/{slug}` | `/marca/yale` |
| Catálogo | `/catalogo` | `/catalogo` |

### Canonical
Todas las páginas públicas tienen `<link rel="canonical">` dinámico. Las URLs de filtros y paginación usan el mismo canonical que la página base.

### Robots
- `/robots.txt` permite todo excepto `/admin`, `/account`, `/checkout`, `/cart`, `/api`, `/_next/`
- `GPTBot` bloqueado completamente
- Sitemap apunta a `/sitemap.xml`

## Schema.org (JSON-LD)

### Organization (layout.tsx)
- Name, legalName, url, logo
- SameAs (Facebook, Instagram, Twitter)
- PostalAddress
- ContactPoint (teléfono, email, WhatsApp)

### WebSite (layout.tsx)
- Name, url
- SearchAction (potencial para search engine)

### Product (product/[slug]/page.tsx)
- name, description, sku, mpn
- brand (Brand), category
- offers (Offer: price in ARS, availability)
- image[]
- aggregateRating (si tiene reviews)

### BreadcrumbList (product/[slug]/page.tsx)
- Inicio → Categoría → Subcategoría (opcional)

### FAQPage (home page)
- Todas las preguntas/respuestas del componente FAQ

## Sitemap Strategy

### Entradas incluidas
| Sección | Prioridad | Frecuencia |
|---------|-----------|------------|
| Home | 1.0 | weekly |
| Catálogo | 0.9 | daily |
| Categorías | 0.8 | daily |
| Subcategorías | 0.7 | daily |
| Productos | 0.7 | weekly |
| Marcas | 0.6 | weekly |
| Páginas estáticas | 0.3-0.5 | monthly/yearly |

### Escalabilidad
El sitemap usa `MetadataRoute.Sitemap` que soporta hasta 50.000 URLs por archivo. Para escalar más allá, se puede dividir en sitemaps parciales (productos, categorías, marcas) usando `generateSitemaps()`.

## Google Shopping Readiness

### Datos preparados para Merchant Center
| Campo | Fuente |
|-------|--------|
| id | `product.sku` |
| title | `product.name` |
| description | `product.shortDescription` |
| link | `/producto/{product.slug}` |
| image_link | `product.images[0].src` |
| availability | `inStock ? 'in_stock' : 'out_of_stock'` |
| price | `{product.price / 100} ARS` |
| brand | `product.brand` |
| gtin | `product.internalCode` (como MPN) |
| condition | `new` |
| google_product_category | mapeable desde `product.category` |

### Share de Reds Sociales
Open Graph y Twitter Cards configurados en metadata global y por producto con imágenes dinámicas.

## Performance SEO
- `next/image` configurado con AVIF + WebP
- Server Components priorizados (10 componentes convertidos)
- Metadata genera tags sin JavaScript
- JSON-LD inyectado como script estático
- `minimumCacheTTL: 30 días` para imágenes

## Páginas No Indexables
- `/admin/*` (robots.txt)
- `/account/*` (robots.txt + noindex)
- `/checkout` (robots.txt + noindex)
- `/cart` (robots.txt + nofollow)
- `/api/*` (robots.txt)
