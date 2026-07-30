# FASE 0 — Product Discovery & Business Analysis

## Visión del Producto

Plataforma de comercio electrónico integral, moderna y escalable que permita a emprendedores y PyMEs crear, gestionar y hacer crecer su tienda online sin necesidad de conocimientos técnicos. Prepárada desde el día cero para evolucionar hacia un modelo SaaS multi-tienda.

---

## Objetivos del Negocio

| # | Objetivo | Métrica |
|---|----------|---------|
| OB1 | Reducir el tiempo de lanzamiento de una tienda online a < 5 minutos | Tiempo medio de onboarding |
| OB2 | Lograr < 1% de downtime en horario comercial | Uptime mensual |
| OB3 | Mantener el TCO por debajo del 40% de soluciones equivalentes (Shopify, TN) | Costo operativo mensual |
| OB4 | Soportar 10,000 productos y 1,000 visitas concurrentes desde el día uno | Pruebas de carga |
| OB5 | Multiinquilino (multi-tienda) en la siguiente iteración post-MVP | Roadmap |

---

## Requisitos Funcionales

### Módulo Catálogo
- RF-01: Gestión de productos (CRUD) con nombre, descripción, precio, SKU, stock, imágenes, variantes (talle/color), categorías y etiquetas.
- RF-02: Búsqueda y filtrado por categoría, precio, marca, etiquetas.
- RF-03: Exportación/importación de productos via CSV/Excel.

### Módulo Carrito y Checkout
- RF-04: Carrito de compras persistente (anónimo y autenticado).
- RF-05: Checkout paso a paso (datos de envío → pago → revisión → confirmación).
- RF-06: Cálculo de costos de envío según ubicación y peso.
- RF-07: Integración con Mercado Pago, Stripe y transferencia bancaria.

### Módulo Usuarios
- RF-08: Registro/login con email + contraseña y OAuth (Google, Facebook).
- RF-09: Panel de cliente: historial de pedidos, seguimiento, favoritos, dirección.
- RF-10: Roles: Admin, Vendedor, Cliente.

### Módulo Órdenes
- RF-11: Administración de pedidos (pendiente, confirmado, enviado, entregado, cancelado).
- RF-12: Notificaciones al cliente por email y/o WhatsApp ante cada cambio de estado.
- RF-13: Facturación y generación de comprobante electrónico.

### Módulo CMS (tienda visible)
- RF-14: Personalización de tienda: logo, colores, banner, about/contacto.
- RF-15: SEO básico: meta-títulos, meta-descripciones, sitemap.xml, Open Graph.
- RF-16: Landing builder simple (secciones: hero, productos destacados, reseñas, newsletter).

### Módulo Admin
- RF-17: Dashboard con ventas del día, mes, pedidos recientes y alertas de stock bajo.
- RF-18: Gestión de descuentos y cupones (porcentaje, monto fijo, envío gratis).
- RF-19: Reportes exportables (ventas, productos más vendidos, clientes frecuentes).

---

## Requisitos No Funcionales

| Código | Requisito | Detalle |
|--------|-----------|---------|
| RNF-01 | **Rendimiento** | P99 < 800ms en endpoints críticos; P99 < 2.5s en reportes |
| RNF-02 | **Disponibilidad** | 99.9% uptime; deploys sin downtime (blue-green o rolling) |
| RNF-03 | **Seguridad** | HTTPS/TLS 1.3, OWASP Top 10, encriptación en reposo (AES-256), hashing de passwords (bcrypt), rate-limiting |
| RNF-04 | **Escalabilidad** | Escalado horizontal en capa API; base de datos con read replicas; caché con Redis |
| RNF-05 | **Multi-tenancy** | Arquitectura multi-tenant desde el inicio (DB por tenant o columna tenant_id) |
| RNF-06 | **Mantenibilidad** | Código modular, API versionada, tests automatizados, documentación viva |
| RNF-07 | **Portabilidad** | 100% containers (Docker), despliegue en cualquier cloud (AWS, GCP, self-hosted) |
| RNF-08 | **Accesibilidad** | WCAG 2.1 Level AA en frontend |
| RNF-09 | **Internacionalización** | i18n listo para español e inglés desde el MVP; agregar idiomas sin modificar código |
| RNF-10 | **SEO** | SSR/SSG para contenido público; Core Web Vitals en rango "Good" |

---

## Benchmark

| Característica | Shopify | Tienda Nube | Mercado Libre | Amazon | **Nuestra propuesta** |
|---------------|---------|-------------|---------------|--------|----------------------|
| Cuota mensual | USD 29–299 | ARS Gratis–$9k/mes | Variable (comisiones) | Comisiones | **Gratis + comisión baja o plan freemium** |
| Comisión transacción | 2.4–2.9% | 1.99–3.49% | 10–16% | 8–15% | **1.5–2.5%** |
| Multi-tienda nativo | Shopify Plus (caro) | No | No | No | **Sí, desde el diseño** |
| Código abierto | No | No | No | No | **Sí (o white-label)** |
| Personalización | Temas + Liquid | Temas limitados | Mínima | Mínima | **Alta: componentes + APIs** |
| SEO | Bueno | Básico | Bueno (tráfico propio) | Excelente | **Excelente + tráfico propio** |
| Migración desde | Lider del mercado | Regional | Marketplace | Marketplace | **Fácil, herramientas de importación** |

**Diferenciadores clave:**
1. Código abierto / white-label — el comerciante es dueño de sus datos y código.
2. Multi-tenancy real — no hay que migrar de plan para tener varias tiendas.
3. Costos predecibles sin comisiones ocultas.
4. Stack moderno (JS/TS full-stack) con APIs extensibles.

---

## Roadmap del Producto

### 🚀 Fase 0 — MVP (Semanas 1-6)
- Catálogo de productos + variantes
- Carrito y checkout básico (Mercado Pago + Stripe)
- Panel admin: CRUD productos y órdenes
- Autenticación de clientes
- Tema base responsive
- SEO básico (meta tags, sitemap)
- Deploy en un solo tenant (mono-tienda)

### 📈 Fase 1 — Crecimiento (Semanas 7-12)
- CMS de tienda (logo, colores, banners, páginas)
- Cupones y descuentos
- Notificaciones email/WhatsApp
- Reportes y dashboard
- Importación/exportación CSV
- OAuth Google y Facebook
- Multi-idioma (es/en)

### 🏢 Fase 2 — Multi-Tenant & SaaS (Semanas 13-18)
- Arquitectura multi-tenant operativa
- Panel de administración SaaS (gestionar N tiendas)
- Planes de suscripción (Gratis / Pro / Enterprise)
- Onboarding auto-gestionado (registro → tienda activa en 5 min)
- Facturación automática de suscripciones
- Marketplace de temas y plugins

### 🌍 Fase 3 — Escalamiento (Semanas 19-24+)
- CDN global para assets
- Read replicas + sharding
- Aplicaciones móviles (React Native)
- Integración con ERP/contabilidad
- API pública para terceros
- Modo marketplace (vendedores externos dentro de una tienda)

---

## KPIs

| KPI | Meta (post-MVP) | Frecuencia |
|-----|----------------|------------|
| **Tasa de conversión** (visita → compra) | > 2.5% | Semanal |
| **Tiempo medio de onboarding** | < 5 min | Mensual |
| **Uptime** | > 99.9% | Mensual |
| **LCP (Largest Contentful Paint)** | < 2.5s | Diario |
| **Pedidos por día** | > 100 | Diario |
| **Valor promedio del pedido (AOV)** | > $25 USD | Semanal |
| **Tasa de abandono de carrito** | < 70% | Semanal |
| **NPS (Net Promoter Score)** | > 50 | Trimestral |
| **CAC (Costo de Adquisición de Cliente)** | < $15 USD | Mensual |
| **Tiempo de resolución de bugs críticos** | < 4h | Por incidente |
