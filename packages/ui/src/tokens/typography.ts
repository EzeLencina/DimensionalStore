export const fontFamily = {
  sans: [
    'var(--font-sans, "Inter", "SF Pro Display", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif)',
  ],
  mono: [
    'var(--font-mono, "JetBrains Mono", "SF Mono", "Fira Code", "Cascadia Code", Consolas, monospace)',
  ],
} as const;

export const fontSize = {
  'display-2xl': ['4.5rem', { lineHeight: '1.1', letterSpacing: '-0.04em', fontWeight: '700' }],
  'display-xl': ['3.75rem', { lineHeight: '1.1', letterSpacing: '-0.03em', fontWeight: '700' }],
  'display-lg': ['3rem', { lineHeight: '1.15', letterSpacing: '-0.03em', fontWeight: '700' }],
  'display-md': ['2.25rem', { lineHeight: '1.2', letterSpacing: '-0.025em', fontWeight: '600' }],
  'display-sm': ['1.875rem', { lineHeight: '1.25', letterSpacing: '-0.02em', fontWeight: '600' }],
  'display-xs': ['1.5rem', { lineHeight: '1.3', letterSpacing: '-0.015em', fontWeight: '600' }],
  'heading-xl': ['1.25rem', { lineHeight: '1.4', letterSpacing: '-0.01em', fontWeight: '600' }],
  'heading-lg': ['1.125rem', { lineHeight: '1.4', letterSpacing: '-0.01em', fontWeight: '600' }],
  'heading-md': ['1rem', { lineHeight: '1.5', letterSpacing: '-0.005em', fontWeight: '600' }],
  'heading-sm': ['0.875rem', { lineHeight: '1.5', letterSpacing: '0', fontWeight: '600' }],
  'body-xl': ['1.25rem', { lineHeight: '1.6', letterSpacing: '0' }],
  'body-lg': ['1.125rem', { lineHeight: '1.6', letterSpacing: '0' }],
  'body-md': ['1rem', { lineHeight: '1.6', letterSpacing: '0' }],
  'body-sm': ['0.875rem', { lineHeight: '1.5', letterSpacing: '0' }],
  'body-xs': ['0.75rem', { lineHeight: '1.5', letterSpacing: '0' }],
  'caption': ['0.6875rem', { lineHeight: '1.4', letterSpacing: '0.02em' }],
  'overline': ['0.6875rem', { lineHeight: '1.4', letterSpacing: '0.08em', fontWeight: '500', textTransform: 'uppercase' }],
  'code': ['0.875rem', { lineHeight: '1.6', letterSpacing: '0' }],
} as const;

export const fontWeight = {
  regular: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
} as const;
