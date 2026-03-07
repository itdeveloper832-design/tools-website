// Performance Optimization Script for Tools Park

// Lazy Loading Images
document.addEventListener('DOMContentLoaded', function() {
  // Lazy load images
  const images = document.querySelectorAll('img[data-src]');
  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        img.removeAttribute('data-src');
        imageObserver.unobserve(img);
      }
    });
  });

  images.forEach(img => imageObserver.observe(img));

  // Preload critical resources
  const preloadLink = document.createElement('link');
  preloadLink.rel = 'preload';
  preloadLink.as = 'style';
  preloadLink.href = '/css/professional.css';
  document.head.appendChild(preloadLink);

  // Defer non-critical CSS
  const deferredStyles = document.querySelectorAll('link[rel="stylesheet"][data-defer]');
  deferredStyles.forEach(link => {
    link.media = 'print';
    link.onload = function() {
      this.media = 'all';
    };
  });

  // Performance monitoring
  if ('PerformanceObserver' in window) {
    // Monitor Largest Contentful Paint (LCP)
    const lcpObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1];
      console.log('LCP:', lastEntry.renderTime || lastEntry.loadTime);
    });
    lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

    // Monitor First Input Delay (FID)
    const fidObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach(entry => {
        console.log('FID:', entry.processingStart - entry.startTime);
      });
    });
    fidObserver.observe({ entryTypes: ['first-input'] });

    // Monitor Cumulative Layout Shift (CLS)
    let clsScore = 0;
    const clsObserver = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (!entry.hadRecentInput) {
          clsScore += entry.value;
          console.log('CLS:', clsScore);
        }
      }
    });
    clsObserver.observe({ entryTypes: ['layout-shift'] });
  }

  // Optimize third-party scripts
  function loadScriptAsync(src, callback) {
    const script = document.createElement('script');
    script.src = src;
    script.async = true;
    if (callback) script.onload = callback;
    document.body.appendChild(script);
  }

  // Load analytics after page load
  window.addEventListener('load', function() {
    // Example: Load Google Analytics
    // loadScriptAsync('https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID');
  });

  // Prefetch important pages
  const prefetchLinks = ['/tools.html', '/about.html', '/contact.html'];
  prefetchLinks.forEach(url => {
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = url;
    document.head.appendChild(link);
  });

  // Cache API responses
  if ('caches' in window) {
    caches.open('tools-park-v1').then(cache => {
      cache.addAll([
        '/',
        '/css/professional.css',
        '/js/main-clean.js',
        '/components/header.html',
        '/components/footer.html'
      ]);
    });
  }

  // Optimize font loading
  if ('fonts' in document) {
    document.fonts.ready.then(() => {
      console.log('Fonts loaded');
    });
  }

  // Reduce layout shifts
  const addDimensionsToImages = () => {
    const imgs = document.querySelectorAll('img:not([width]):not([height])');
    imgs.forEach(img => {
      if (img.naturalWidth && img.naturalHeight) {
        img.setAttribute('width', img.naturalWidth);
        img.setAttribute('height', img.naturalHeight);
      }
    });
  };

  if (document.readyState === 'complete') {
    addDimensionsToImages();
  } else {
    window.addEventListener('load', addDimensionsToImages);
  }

  // Debounce scroll events
  function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  // Optimize scroll performance
  const handleScroll = debounce(() => {
    // Scroll-related operations
  }, 100);

  window.addEventListener('scroll', handleScroll, { passive: true });

  // Resource hints
  const addResourceHints = () => {
    // DNS prefetch for external domains
    const dnsPrefetch = ['fonts.googleapis.com', 'fonts.gstatic.com'];
    dnsPrefetch.forEach(domain => {
      const link = document.createElement('link');
      link.rel = 'dns-prefetch';
      link.href = `//${domain}`;
      document.head.appendChild(link);
    });

    // Preconnect to critical origins
    const preconnect = ['https://fonts.googleapis.com', 'https://fonts.gstatic.com'];
    preconnect.forEach(origin => {
      const link = document.createElement('link');
      link.rel = 'preconnect';
      link.href = origin;
      link.crossOrigin = 'anonymous';
      document.head.appendChild(link);
    });
  };

  addResourceHints();

  // Optimize animations
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (prefersReducedMotion.matches) {
    document.body.classList.add('reduce-motion');
  }

  // Memory management
  window.addEventListener('beforeunload', () => {
    // Cleanup operations
    imageObserver.disconnect();
  });
});

// Service Worker registration
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(registration => {
        console.log('SW registered:', registration);
      })
      .catch(error => {
        console.log('SW registration failed:', error);
      });
  });
}

// Network information API
if ('connection' in navigator) {
  const connection = navigator.connection;
  if (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g') {
    // Reduce quality for slow connections
    document.body.classList.add('slow-connection');
  }
}

// Battery API
if ('getBattery' in navigator) {
  navigator.getBattery().then(battery => {
    if (battery.level < 0.2 && !battery.charging) {
      // Reduce animations and effects for low battery
      document.body.classList.add('low-battery');
    }
  });
}
