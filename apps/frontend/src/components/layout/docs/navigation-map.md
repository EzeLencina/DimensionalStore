# Navigation Map

## Main Routes

| Route | Page | Status |
|-------|------|--------|
| `/` | Home | Next phase |
| `/catalogo` | Catalog | Next phase |
| `/categoria/[slug]` | Category | Next phase |
| `/categoria/[cat]/[sub]` | Subcategory | Next phase |
| `/producto/[slug]` | Product | Next phase |
| `/carrito` | Cart | Next phase |
| `/checkout` | Checkout | Next phase |
| `/ofertas` | Offers | Next phase |
| `/novedades` | New Arrivals | Next phase |
| `/marcas` | Brands | Next phase |
| `/marca/[slug]` | Brand | Next phase |

## Account Routes

| Route | Page | Status |
|-------|------|--------|
| `/iniciar-sesion` | Login | Next phase |
| `/registrarse` | Register | Next phase |
| `/cuenta` | Account Dashboard | Next phase |
| `/cuenta/pedidos` | Orders | Next phase |
| `/cuenta/favoritos` | Favorites | Next phase |
| `/compara` | Product Comparer | Next phase |

## Static Routes

| Route | Page | Status |
|-------|------|--------|
| `/contacto` | Contact | Next phase |
| `/about` | About Us | Next phase |
| `/ayuda` | Help Center | Next phase |
| `/faq` | FAQ | Next phase |
| `/terminos` | Terms | Next phase |
| `/privacidad` | Privacy | Next phase |
| `/soporte` | Tech Support | Next phase |

## Navigation Structure

```
Top Bar
├── Shipping info
├── Payment info
├── Warranty info
├── Support info
├── Promotions info
├── Currency selector (ARS/USD)
└── Language selector (ES/EN/PT)

Header
├── Logo
├── Search (with autocomplete panel)
├── Main nav links (Ofertas, Novedades)
├── Icon group (User, Favorites, Comparer, Theme, Cart)
├── Mega Menu (categories with subcategories + brands)
└── Mobile Menu (drawer with full category tree)

Footer
├── Newsletter signup
├── Company section (About, Jobs, Press, Blog, Affiliates)
├── Help section (FAQ, Terms, Privacy, Claims)
├── Purchases section (How to buy, Payments, Shipping, Returns)
├── Contact section (Support, WhatsApp, Email, Stores)
├── Payment methods
├── Shipping methods
├── Social links
└── Copyright
```
