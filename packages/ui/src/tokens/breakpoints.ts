export const breakpoints = {
  xs: 480,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1440,
  '3xl': 1600,
  '4xl': 1920,
} as const;

export const mediaQueries = {
  xs: `(min-width: ${breakpoints.xs}px)`,
  sm: `(min-width: ${breakpoints.sm}px)`,
  md: `(min-width: ${breakpoints.md}px)`,
  lg: `(min-width: ${breakpoints.lg}px)`,
  xl: `(min-width: ${breakpoints.xl}px)`,
  '2xl': `(min-width: ${breakpoints['2xl']}px)`,
  '3xl': `(min-width: ${breakpoints['3xl']}px)`,
  '4xl': `(min-width: ${breakpoints['4xl']}px)`,
  motionReduce: '(prefers-reduced-motion: reduce)',
  motionSafe: '(prefers-reduced-motion: no-preference)',
  hover: '(hover: hover)',
  pointerFine: '(pointer: fine)',
  pointerCoarse: '(pointer: coarse)',
} as const;
