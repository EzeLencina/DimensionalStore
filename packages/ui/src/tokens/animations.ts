export const duration = {
  instant: '0ms',
  fast: '100ms',
  normal: '200ms',
  slow: '300ms',
  slower: '400ms',
  slowest: '500ms',
  emphasis: '700ms',
} as const;

export const easing = {
  linear: 'linear',
  in: 'cubic-bezier(0.4, 0, 1, 1)',
  out: 'cubic-bezier(0, 0, 0.2, 1)',
  inOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
  spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
  springSnap: 'cubic-bezier(0.5, 1.2, 0.3, 1)',
  emphasize: 'cubic-bezier(0.2, 0, 0, 1)',
} as const;

export const keyframes = {
  'fade-in': {
    from: { opacity: '0' },
    to: { opacity: '1' },
  },
  'fade-out': {
    from: { opacity: '1' },
    to: { opacity: '0' },
  },
  'slide-in-from-top': {
    from: { transform: 'translateY(-8px)', opacity: '0' },
    to: { transform: 'translateY(0)', opacity: '1' },
  },
  'slide-out-to-top': {
    from: { transform: 'translateY(0)', opacity: '1' },
    to: { transform: 'translateY(-8px)', opacity: '0' },
  },
  'slide-in-from-bottom': {
    from: { transform: 'translateY(8px)', opacity: '0' },
    to: { transform: 'translateY(0)', opacity: '1' },
  },
  'slide-out-to-bottom': {
    from: { transform: 'translateY(0)', opacity: '1' },
    to: { transform: 'translateY(8px)', opacity: '0' },
  },
  'slide-in-from-left': {
    from: { transform: 'translateX(-8px)', opacity: '0' },
    to: { transform: 'translateX(0)', opacity: '1' },
  },
  'slide-out-to-left': {
    from: { transform: 'translateX(0)', opacity: '1' },
    to: { transform: 'translateX(-8px)', opacity: '0' },
  },
  'slide-in-from-right': {
    from: { transform: 'translateX(8px)', opacity: '0' },
    to: { transform: 'translateX(0)', opacity: '1' },
  },
  'slide-out-to-right': {
    from: { transform: 'translateX(0)', opacity: '1' },
    to: { transform: 'translateX(8px)', opacity: '0' },
  },
  'scale-in': {
    from: { transform: 'scale(0.95)', opacity: '0' },
    to: { transform: 'scale(1)', opacity: '1' },
  },
  'scale-out': {
    from: { transform: 'scale(1)', opacity: '1' },
    to: { transform: 'scale(0.95)', opacity: '0' },
  },
  'spin': {
    from: { transform: 'rotate(0deg)' },
    to: { transform: 'rotate(360deg)' },
  },
  'pulse': {
    '0%, 100%': { opacity: '1' },
    '50%': { opacity: '0.5' },
  },
  'accordion-down': {
    from: { height: '0' },
    to: { height: 'var(--radix-accordion-content-height)' },
  },
  'accordion-up': {
    from: { height: 'var(--radix-accordion-content-height)' },
    to: { height: '0' },
  },
  'collapsible-down': {
    from: { height: '0' },
    to: { height: 'var(--radix-collapsible-content-height)' },
  },
  'collapsible-up': {
    from: { height: 'var(--radix-collapsible-content-height)' },
    to: { height: '0' },
  },
  'overlay-show': {
    from: { opacity: '0' },
    to: { opacity: '1' },
  },
  'overlay-hide': {
    from: { opacity: '1' },
    to: { opacity: '0' },
  },
  'content-show': {
    from: { opacity: '0', transform: 'translate(-50%, -48%) scale(0.96)' },
    to: { opacity: '1', transform: 'translate(-50%, -50%) scale(1)' },
  },
  'content-hide': {
    from: { opacity: '1', transform: 'translate(-50%, -50%) scale(1)' },
    to: { opacity: '0', transform: 'translate(-50%, -48%) scale(0.96)' },
  },
} as const;
