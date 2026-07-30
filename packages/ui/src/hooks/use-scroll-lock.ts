'use client';

import { useEffect, useRef } from 'react';

export function useScrollLock(locked: boolean) {
  const originalRef = useRef<string>('');

  useEffect(() => {
    if (locked) {
      originalRef.current = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = originalRef.current;
    }

    return () => {
      document.body.style.overflow = originalRef.current;
    };
  }, [locked]);
}
