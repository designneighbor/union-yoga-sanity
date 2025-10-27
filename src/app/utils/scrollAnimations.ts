export const initScrollAnimations = () => {
  // SSR safety check
  if (typeof window === 'undefined') {
    return () => {};
  }

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
    elements.forEach((el) => {
      const rect = el.getBoundingClientRect();
      const isInViewport = rect.top < window.innerHeight && rect.bottom > 0;
      
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
    });
  };

  // Run immediately and also after a short delay to catch any layout shifts
  checkAndAnimateElements();
  setTimeout(checkAndAnimateElements, 100);
  setTimeout(checkAndAnimateElements, 300);

  return () => {
    elements.forEach((el) => observer.unobserve(el));
  };
};