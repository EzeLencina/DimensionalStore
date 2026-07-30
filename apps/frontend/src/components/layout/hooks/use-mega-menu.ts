'use client';

import { useState, useCallback, useRef } from 'react';

export function useMegaMenu() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const open = useCallback((id: string) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setActiveCategory(id);
  }, []);

  const close = useCallback(() => {
    timeoutRef.current = setTimeout(() => {
      setActiveCategory(null);
    }, 150);
  }, []);

  const closeImmediate = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setActiveCategory(null);
  }, []);

  return { activeCategory, open, close, closeImmediate };
}
