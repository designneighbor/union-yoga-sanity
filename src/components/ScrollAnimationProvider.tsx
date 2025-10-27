// In ScrollAnimationProvider.tsx:
'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { initScrollAnimations } from '@/app/utils/scrollAnimations';

export function ScrollAnimationProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  useEffect(() => {
    // Wait for DOM to be fully loaded
    const initializeAnimations = () => {
      const cleanup = initScrollAnimations();
      return cleanup;
    };

    // Initialize immediately if DOM is ready, otherwise wait for load event
    let cleanup: (() => void) | undefined;
    if (document.readyState === 'complete') {
      cleanup = initializeAnimations();
    } else {
      const handleLoad = () => {
        cleanup = initializeAnimations();
        window.removeEventListener('load', handleLoad);
      };
      window.addEventListener('load', handleLoad);
    }

    return () => {
      if (cleanup) {
        cleanup();
      }
    };
  }, [pathname]); // Re-run when pathname changes

  return <>{children}</>;
}