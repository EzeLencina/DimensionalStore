export const shadows = {
  xs: '0 1px 2px 0 rgb(0 0 0 / 0.04)',
  sm: '0 1px 3px 0 rgb(0 0 0 / 0.06), 0 1px 2px -1px rgb(0 0 0 / 0.04)',
  md: '0 4px 6px -1px rgb(0 0 0 / 0.06), 0 2px 4px -2px rgb(0 0 0 / 0.04)',
  lg: '0 10px 15px -3px rgb(0 0 0 / 0.06), 0 4px 6px -4px rgb(0 0 0 / 0.04)',
  xl: '0 20px 25px -5px rgb(0 0 0 / 0.08), 0 8px 10px -6px rgb(0 0 0 / 0.04)',
  '2xl': '0 40px 50px -12px rgb(0 0 0 / 0.12)',
  '3xl': '0 50px 70px -20px rgb(0 0 0 / 0.16)',
  inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.04)',
  glow: {
    sm: '0 0 12px hsl(225, 65%, 48% / 0.3)',
    md: '0 0 20px hsl(225, 65%, 48% / 0.4)',
    lg: '0 0 32px hsl(225, 65%, 48% / 0.5)',
  },
} as const;
