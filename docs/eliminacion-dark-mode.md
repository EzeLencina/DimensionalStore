# Eliminación de Dark Mode

## Resumen

Se eliminó completamente el soporte para modo oscuro. La aplicación funciona exclusivamente en modo claro, conservando exactamente la apariencia visual original.

---

## Archivos Eliminados (4)

| Archivo | Motivo |
|---|---|
| `apps/frontend/src/providers/theme-provider.tsx` | Wrapper de `next-themes` |
| `apps/frontend/src/config/theme.config.ts` | Configuración de temas (`defaultTheme: 'system'`, `themes: ['light','dark','system']`) |
| `apps/frontend/src/types/theme.ts` | Tipo `Theme = 'light' \| 'dark' \| 'system'` |
| `packages/ui/src/providers/theme-provider.tsx` | Versión del DS con props configurables |

---

## Archivos Modificados (11)

| Archivo | Cambio |
|---|---|
| `apps/frontend/package.json` | Eliminada dependencia `next-themes` |
| `packages/ui/package.json` | Eliminada `devDependency` y `peerDependency` de `next-themes` |
| `apps/frontend/src/providers/index.ts` | Eliminado `export { ThemeProvider }` |
| `packages/ui/src/providers/index.ts` | Archivo vaciado (solo exportaba ThemeProvider) |
| `packages/ui/src/index.ts` | Eliminado `export * from './providers'` del barrel |
| `apps/frontend/src/app/layout.tsx` | Eliminado import y wrapping de `ThemeProvider`, eliminado `suppressHydrationWarning` |
| `apps/frontend/src/app/globals.css` | Eliminado bloque `.dark { ... }` (20 vars CSS) |
| `packages/ui/src/styles/globals.css` | Eliminado bloque `.dark { ... }` (43 vars CSS + sombras) |
| `apps/frontend/tailwind.config.ts` | Eliminada línea `darkMode: ['class']` |
| `apps/frontend/src/components/layout/header/header.tsx` | Eliminado `useTheme`, `setTheme`, `mounted`, Sun/Moon icons, y botón toggle |
| `packages/ui/src/components/ui/chip/chip.tsx` | Eliminado `dark:hover:bg-white/10` del botón remove |
| `packages/ui/src/tokens/breakpoints.ts` | Eliminados `darkMode` y `lightMode` de media queries |

---

## Dependencias Eliminadas

- `next-themes` (de `apps/frontend/package.json` y `packages/ui/package.json`)

---

## Componentes que NO se modificaron (design intacto)

- Section component: variante `dark` (prop `variant="dark"`) → NO es Tailwind dark mode, es un nombre de variante. Se conserva.
- Todos los demás componentes del Design System, Layout, Home, PLP, PDP, Cart, Checkout, Customer Portal → sin cambios.

---

## Verificación

| Gate | Resultado |
|---|---|
| TypeScript strict (`@tienda/frontend`) | 0 errores |
| TypeScript strict (`@tienda/ui`) | 0 errores |
| `next build` | 25/25 páginas, 0 errores |
| `next dev` | Inicia correctamente en `localhost:3000` |
| Referencias a `next-themes` en source | 0 |
| Referencias a `ThemeProvider` en source | 0 |
| Referencias a `useTheme/setTheme` en source | 0 |
| Clases `dark:` Tailwind en source | 0 (solo variante Section, no Tailwind) |
| Bloque `.dark` en CSS | 0 |
| `prefers-color-scheme` en source | 0 |
| `darkMode` en tailwind.config | 0 |
| Iconos Moon/Sun en source | 0 |
| HTTP 200 + contenido real | ✅ 538KB, schemas OK |
