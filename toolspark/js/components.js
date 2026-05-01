// Component Loader System
class ComponentLoader {
  constructor() {
    this.cache = new Map();
    this.loadingPromises = new Map();
  }

  // Load component from file
  async loadComponent(componentPath) {
    // Return from cache if already loaded
    if (this.cache.has(componentPath)) {
      return this.cache.get(componentPath);
    }

    // Return existing promise if currently loading
    if (this.loadingPromises.has(componentPath)) {
      return this.loadingPromises.get(componentPath);
    }

    // Create and store loading promise
    const loadingPromise = this.fetchComponent(componentPath);
    this.loadingPromises.set(componentPath, loadingPromise);

    try {
      const component = await loadingPromise;
      this.cache.set(componentPath, component);
      this.loadingPromises.delete(componentPath);
      return component;
    } catch (error) {
      this.loadingPromises.delete(componentPath);
      throw error;
    }
  }

  // Fetch component HTML
  async fetchComponent(componentPath) {
    try {
      const response = await fetch(componentPath);
      if (!response.ok) {
        throw new Error(`Failed to load component: ${componentPath}`);
      }
      return await response.text();
    } catch (error) {
      console.error('Error loading component:', error);
      return `<div class="component-error">Failed to load component: ${componentPath}</div>`;
    }
  }

  // Render component into element
  async renderComponent(componentPath, targetElement) {
    const component = await this.loadComponent(componentPath);
    if (targetElement) {
      targetElement.innerHTML = component;
      this.initializeComponentScripts(targetElement);
    }
  }

  // Initialize scripts within component
  initializeComponentScripts(element) {
    const scripts = element.querySelectorAll('script');
    scripts.forEach(script => {
      const newScript = document.createElement('script');
      Array.from(script.attributes).forEach(attr => {
        newScript.setAttribute(attr.name, attr.value);
      });
      newScript.textContent = script.textContent;
      script.parentNode.replaceChild(newScript, script);
    });
  }

  // Clear cache
  clearCache() {
    this.cache.clear();
    this.loadingPromises.clear();
  }
}

// Global component loader instance
window.componentLoader = new ComponentLoader();

// Auto-load components when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  loadAllComponents();
});

// Load all components marked with data-component attribute
async function loadAllComponents() {
  const componentElements = document.querySelectorAll('[data-component]');
  
  for (const element of componentElements) {
    const componentPath = element.getAttribute('data-component');
    try {
      await window.componentLoader.renderComponent(componentPath, element);
    } catch (error) {
      console.error(`Failed to load component ${componentPath}:`, error);
    }
  }
  
  // Initialize common functionality after components are loaded
  initializeCommonFunctionality();
}

// Initialize common functionality across all pages
function initializeCommonFunctionality() {
  // Mobile menu functionality
  initializeMobileMenu();
  
  // Active navigation highlighting
  initializeActiveNavigation();
  
  // Smooth scrolling for anchor links
  initializeSmoothScrolling();
  
  // Form validation
  initializeFormValidation();
}

// Mobile menu functionality
function initializeMobileMenu() {
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  
  if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener('click', () => {
      mobileMenu.classList.toggle('hidden');
      const menuOpen = mobileMenuBtn.querySelector('.menu-open');
      const menuClose = mobileMenuBtn.querySelector('.menu-close');
      
      if (mobileMenu.classList.contains('hidden')) {
        menuOpen.classList.remove('hidden');
        menuClose.classList.add('hidden');
      } else {
        menuOpen.classList.add('hidden');
        menuClose.classList.remove('hidden');
      }
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!mobileMenuBtn.contains(e.target) && !mobileMenu.contains(e.target)) {
        mobileMenu.classList.add('hidden');
        const menuOpen = mobileMenuBtn.querySelector('.menu-open');
        const menuClose = mobileMenuBtn.querySelector('.menu-close');
        menuOpen.classList.remove('hidden');
        menuClose.classList.add('hidden');
      }
    });

    // Close mobile menu when clicking on a link
    const mobileLinks = mobileMenu.querySelectorAll('.mobile-nav-link');
    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.add('hidden');
        const menuOpen = mobileMenuBtn.querySelector('.menu-open');
        const menuClose = mobileMenuBtn.querySelector('.menu-close');
        menuOpen.classList.remove('hidden');
        menuClose.classList.add('hidden');
      });
    });
  }
}

// Active navigation highlighting
function initializeActiveNavigation() {
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');
  
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });
}

// Smooth scrolling for anchor links
function initializeSmoothScrolling() {
  const anchorLinks = document.querySelectorAll('a[href^="#"]');
  
  anchorLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href').substring(1);
      const targetElement = document.getElementById(targetId);
      
      if (targetElement) {
        e.preventDefault();
        targetElement.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
}

// Form validation
function initializeFormValidation() {
  const forms = document.querySelectorAll('form[data-validate]');
  
  forms.forEach(form => {
    form.addEventListener('submit', (e) => {
      if (!validateForm(form)) {
        e.preventDefault();
      }
    });
  });
}

// Form validation helper
function validateForm(form) {
  const inputs = form.querySelectorAll('input[required], textarea[required], select[required]');
  let isValid = true;
  
  inputs.forEach(input => {
    if (!input.value.trim()) {
      showError(input, 'This field is required');
      isValid = false;
    } else {
      clearError(input);
    }
  });
  
  return isValid;
}

// Show form error
function showError(input, message) {
  input.classList.add('error');
  const errorElement = input.parentNode.querySelector('.error-message') || 
                      document.createElement('span');
  errorElement.className = 'error-message';
  errorElement.textContent = message;
  
  if (!input.parentNode.contains(errorElement)) {
    input.parentNode.appendChild(errorElement);
  }
}

// Clear form error
function clearError(input) {
  input.classList.remove('error');
  const errorElement = input.parentNode.querySelector('.error-message');
  if (errorElement) {
    errorElement.remove();
  }
}

// Export for use in other scripts
window.ComponentLoader = ComponentLoader;
window.loadAllComponents = loadAllComponents;
