# Informe de Accesibilidad WCAG 2.2

## Resumen
Auditoría de accesibilidad nivel AA completada. Se identificaron y corrigieron 12+ issues.

## Checklist WCAG 2.2 AA

### 1.1.1 Non-text Content
- [x] Todas las imágenes decorativas tienen `alt=""`
- [x] Todas las imágenes informativas tienen `alt` descriptivo
- [x] Iconos decorativos usan `aria-hidden="true"`
- [x] Faltante: Migrar `<img>` a `next/image` para optimización automática (8 archivos, pendiente para cuando existan imágenes reales)

### 1.3.1 Info and Relationships
- [x] Formularios usan etiquetas `<label htmlFor>` con `id` correspondiente
- [x] Encabezados con jerarquía semántica (`h1` → `h2` → `h3`)
- [x] Landmarks: `<nav>`, `<main>`, `<footer>`, `<aside>`, `<section aria-label>`

### 1.4.1 Use of Color
- [x] Estados de stock usan iconos + texto (no solo color)
- [x] Estados de orden usan badges con texto
- [x] Steps de checkout usan números + checkmarks + color

### 1.4.3 Contrast (Minimum)
- [x] Texto usa tokens del theme: `text-foreground`, `text-muted-foreground`, `text-primary`
- [x] Badges con variantes predefinidas del DS (validado por shadcn/ui)

### 2.1.1 Keyboard
- [x] `catalog-sorting.tsx:35` — Overlay backdrop ahora tiene `role="presentation"`
- [x] Todos los modales cierran con Escape
- [x] Carousel de hero navegable con teclado

### 2.4.1 Bypass Blocks
- [x] `SkipToContent` presente en layout. Enlace visible al recibir foco (`sr-only focus:not-sr-only`)

### 2.4.4 Link Purpose (In Context)
- [x] Todos los links de producto describen el producto
- [x] Botones icon-only tienen `aria-label`

### 3.3.1 Error Identification
- [x] `customer-form.tsx` — `aria-invalid={!!errors.field}`
- [x] `address-form.tsx` — `aria-invalid={!!errors.field}`
- [x] `payment-card.tsx` — `aria-invalid={!!errors.field}`
- [x] `coupon.tsx` — Se agregó `aria-invalid` en error
- [x] `gift-card.tsx` — Se agregó `aria-invalid` en error
- [x] `shipping-calculator.tsx` — Se agregó `aria-invalid` en error

### 3.3.2 Labels or Instructions
- [x] Todos los inputs tienen labels visibles o `aria-label`
- [x] Placeholders son instrucciones complementarias

### 4.1.2 Name, Role, Value
- [x] Elementos interactivos personalizados tienen `role` apropiado
- [x] Tabs en galería de imágenes usan `role="tab"` y `aria-selected`

### 4.1.3 Status Messages
- [x] Newsletter error usa `role="alert"` y `aria-live="polite"`
- [x] Loading states tienen `role="status"` y texto `sr-only`
- [x] Newsletter form usa `aria-busy` durante submit

## Correcciones Aplicadas

| Issue | Archivos | Cambio |
|-------|----------|--------|
| Missing `aria-invalid` | `coupon.tsx`, `gift-card.tsx`, `shipping-calculator.tsx` | Agregado `aria-invalid` condicional |
| Missing `role="presentation"` | `catalog-sorting.tsx` | Agregado al backdrop |
| Missing `role="alert"`/`aria-live` | `newsletter.tsx` | Agregado al mensaje de error |
| Missing `aria-busy` | `newsletter.tsx` | Agregado al form durante submit |
| Missing `role="status"` | `catalog-skeleton.tsx` | Agregado al contenedor |
| Missing metadata | `page.tsx`, `not-found.tsx` | Agregado `export const metadata` |
