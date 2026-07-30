'use client';

import { useEffect, useState, useRef } from 'react';

type ScrollDirection = 'up' | 'down';

export function useScrollDirection(threshold: number = 10): ScrollDirection {
  const [direction, setDirection] = useState<ScrollDirection>('up');
  const prevScroll = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const current = window.scrollY;
      const diff = current - prevScroll.current;

      if (Math.abs(diff) > threshold) {
        setDirection(diff > 0 ? 'down' : 'up');
        prevScroll.current = current;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [threshold]);

  return direction;
}
