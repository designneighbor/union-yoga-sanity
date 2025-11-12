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
      try {
        const cleanup = initScrollAnimations();
        return cleanup;
      } catch (error) {
        // Silently handle initialization errors (e.g., in iframe context)
        console.debug('ScrollAnimationProvider initialization error:', error);
        return () => {};
      }
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
        try {
          cleanup();
        } catch (error) {
          console.debug('ScrollAnimationProvider cleanup error:', error);
        }
      }
    };
  }, [pathname]); // Re-run when pathname changes

  return <>{children}</>;
}