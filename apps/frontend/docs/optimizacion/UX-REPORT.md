# Informe UX / CRO

## Resumen
Auditoría de experiencia de usuario y optimización de conversión (CRO) completada sobre todos los módulos del frontend ecommerce.

## Hallazgos Críticos (Corregidos)

### Confianza
- **Garantía en PDP**: Pasó de texto `text-xs text-muted-foreground` a badge visible con icono `ShieldCheck` + color `success` y fondo `success/5` (`product-info.tsx`).
- **Security Badge**: Descripciones aumentadas de `text-[10px]` a `text-xs` para legibilidad (`security-badge.tsx`).
- **Cross-selling CTA**: Botón raw reemplazado por `<Button>` del DS para consistencia visual (`cross-selling.tsx`).

### Estructura de Compra
- **CTAs principales**: Todos los botones "Comprar", "Agregar al carrito" usan `size="lg"` con `fullWidth` y contraste `bg-primary/text-primary-foreground`.
- **Precio visible**: `text-3xl sm:text-4xl font-bold` en PDP, `text-lg font-bold` en cards.
- **Stock visible**: Indicador color-coded (verde/amarillo/rojo) en PDP, catálogo y carrito.
- **Envío visible**: Calculadora en PDP y carrito, entrega estimada en cards de catálogo.
- **Medios de pago visibles**: Cuotas sin interés como badges bajo el precio en PDP, calculadora en carrito.

### Estados
- **Empty states**: Todos los módulos tienen empty states con CTAS de recuperación claros.
- **Loading states**: Skeletons con `role="status"` y texto `sr-only` (corregido en `catalog-skeleton.tsx`).
- **Error states**: Mensajes de error con acciones de reintento, `aria-live="polite"` y `aria-invalid` en formularios.
- **Confirmación checkout**: Pantalla completa con número de orden, resumen, medios de pago/envío y CTAS.

## Pendientes Futuros
- Agregar logos de medios de pago en el footer (texto plano actualmente).
- Mostrar security badges en PDP y carrito (hoy solo en checkout).
- Crear barra de confianza mobile para reemplazar TopBar (oculta en mobile).
- Estandarizar threshold de stock bajo (`<=5` vs `<=10` actualmente inconsistente).
