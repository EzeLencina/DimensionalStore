'use client';

import { useEffect, useRef, useState, type RefObject } from 'react';

export function useIntersection<T extends HTMLElement>(
  options?: IntersectionObserverInit,
): [RefObject<T | null>, boolean] {
  const ref = useRef<T | null>(null);
  const [isIntersecting, setIsIntersecting] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver((entries) => {
      const entry = entries[0];
      if (entry) {
        setIsIntersecting(entry.isIntersecting);
      }
    }, options);

    observer.observe(element);
    return () => observer.disconnect();
  }, [options?.rootMargin, options?.threshold, options?.root]);

  return [ref, isIntersecting];
}
