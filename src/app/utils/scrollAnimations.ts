export const initScrollAnimations = () => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };
  
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
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
  
    // Add a small delay to ensure the reset is visible
    setTimeout(() => {
      elements.forEach((el) => observer.observe(el));
    }, 100);
  
    return () => {
      elements.forEach((el) => observer.unobserve(el));
    };
  };