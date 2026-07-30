'use client';

import { useScrollDirection } from './use-scroll-direction';

export function useHeaderVisibility(threshold?: number) {
  const direction = useScrollDirection(threshold);
  const isVisible = direction === 'up';
  return { isVisible, direction };
}
