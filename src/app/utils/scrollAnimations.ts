export const initScrollAnimations = () => {
  // SSR safety check
  if (typeof window === 'undefined') {
    return () => {};
  }

  // Check if we're in an iframe (Sanity Presentation mode)
  const isInIframe = window.self !== window.top;
  
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        // Only add visible class to elements that don't have immediate class
        if (!entry.target.classList.contains('immediate')) {
          entry.target.classList.add('visible');
        }
      }
    });
  }, observerOptions);

  // Find all elements with fade-in classes
  const elements = document.querySelectorAll(
    '.fade-in-up, .fade-in-down, .fade-in-left, .fade-in-right'
  );
  
  // Reset animation state by removing visible class from all elements
  elements.forEach((el) => {
    el.classList.remove('visible');
  });

  // Check which elements are already in viewport and make them visible immediately
  const checkAndAnimateElements = () => {
    try {
      // Use requestAnimationFrame to ensure DOM is ready
      requestAnimationFrame(() => {
        elements.forEach((el) => {
          try {
            const rect = el.getBoundingClientRect();
            // Use a more robust viewport check that works in iframes
            const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
            const isInViewport = rect.top < viewportHeight && rect.bottom > 0;
            
            if (isInViewport) {
              // Only add visible class to elements that don't have immediate class
              if (!el.classList.contains('immediate')) {
                setTimeout(() => {
                  el.classList.add('visible');
                }, 50);
              }
            }
            
            // Start observing for future scroll events
            observer.observe(el);
          } catch (error) {
            // Silently handle errors for individual elements
            console.debug('Scroll animation error:', error);
          }
        });
      });
    } catch (error) {
      console.debug('Scroll animation initialization error:', error);
    }
  };

  // Run immediately and also after a short delay to catch any layout shifts
  checkAndAnimateElements();
  setTimeout(checkAndAnimateElements, 100);
  setTimeout(checkAndAnimateElements, 300);

  // Handle iframe resize events
  let resizeTimeout: NodeJS.Timeout;
  const handleResize = () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      checkAndAnimateElements();
    }, 150);
  };

  // Only add resize listener if in iframe to handle viewport switches
  if (isInIframe) {
    window.addEventListener('resize', handleResize, { passive: true });
  }

  return () => {
    elements.forEach((el) => observer.unobserve(el));
    if (isInIframe) {
      window.removeEventListener('resize', handleResize);
    }
    if (resizeTimeout) {
      clearTimeout(resizeTimeout);
    }
  };
};