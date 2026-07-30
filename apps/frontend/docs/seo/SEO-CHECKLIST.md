# Checklist SEO Técnico

## Metadata
- [x] Title template configurado (`%s | Tienda`)
- [x] Default title y description en root layout
- [x] Metadata dinámica por página (producto, categoría, marca)
- [x] Keywords globales
- [x] Authors, creator, publisher
- [x] Theme color
- [x] Manifest link
- [x] Icons (favicon, apple-touch-icon)

## Open Graph
- [x] OG:title, OG:description, OG:image
- [x] OG:url, OG:site_name, OG:locale
- [x] OG:type (website)
- [x] Imágenes OG dinámicas por producto (1200x630)
- [x] OG image por defecto

## Twitter Cards
- [x] Twitter:card (summary_large_image)
- [x] Twitter:title, Twitter:description
- [x] Twitter:site (@tienda)
- [x] Twitter:image

## URLs
- [x] URLs semánticas / limpia
- [x] Sin parámetros de sesión
- [x] Sin IDs numéricos en URLs
- [x] Sin mayúsculas
- [x] Slugs descriptivos (kebab-case)
- [x] Canónicas dinámicas

## Robots
- [x] robots.txt dinámico
- [x] Páginas públicas indexables
- [x] Páginas privadas no indexables
- [x] GPTBot bloqueado
- [x] Sitemap referenciado

## Sitemap
- [x] Home (prioridad 1.0)
- [x] Catálogo (prioridad 0.9)
- [x] Categorías + subcategorías (prioridad 0.7-0.8)
- [x] Marcas (prioridad 0.6)
- [x] Productos (prioridad 0.7)
- [x] Páginas estáticas (prioridad 0.3-0.5)
- [x] lastModified dinámico
- [x] Preparado para escalar a miles de URLs

## Schema.org (JSON-LD)
- [x] Organization (layout global)
- [x] WebSite (layout global, con SearchAction)
- [x] Product (PDP con Offer, AggregateRating, Brand)
- [x] BreadcrumbList (PDP con jerarquía de categoría)
- [x] FAQPage (home page)

## Google Shopping
- [x] SKU disponible
- [x] MPN (internal code)
- [x] Brand
- [x] Price en ARS
- [x] Availability
- [x] Condition (new)
- [x] Imágenes

## Performance SEO
- [x] Server Components priorizados
- [x] next/image con AVIF/WebP
- [x] Lazy loading
- [x] Compresión de imágenes (minimumCacheTTL)
- [x] Sin render blocking (JSON-LD inyectado como script)

## Calidad
- [x] TypeScript strict sin errores
- [x] Barrel exports actualizados
- [x] Arquitectura respetada
