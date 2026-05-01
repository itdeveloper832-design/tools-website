/**
 * ToolsPark — site.js
 * Shared: mobile nav, active nav, FAQ accordion, lazy load, schema injection
 */
(function () {
  'use strict';

  /* ── Mobile Navigation ── */
  function initMobileNav() {
    const btn = document.getElementById('hamburger');
    const menu = document.getElementById('mobile-nav');
    if (!btn || !menu) return;
    btn.addEventListener('click', function () {
      const open = menu.classList.toggle('open');
      btn.setAttribute('aria-expanded', open);
      btn.querySelector('.icon-open').classList.toggle('hidden', open);
      btn.querySelector('.icon-close').classList.toggle('hidden', !open);
    });
    // Close on outside click
    document.addEventListener('click', function (e) {
      if (!btn.contains(e.target) && !menu.contains(e.target)) {
        menu.classList.remove('open');
        btn.setAttribute('aria-expanded', 'false');
        btn.querySelector('.icon-open').classList.remove('hidden');
        btn.querySelector('.icon-close').classList.add('hidden');
      }
    });
  }

  /* ── Active Nav Link ── */
  function setActiveNav() {
    const path = window.location.pathname.replace(/\/$/, '') || '/';
    document.querySelectorAll('[data-nav]').forEach(function (el) {
      const href = el.getAttribute('href') || '';
      const clean = href.replace(/\/$/, '') || '/';
      if (clean === path || (clean !== '/' && path.startsWith(clean))) {
        el.classList.add('active');
      }
    });
  }

  /* ── FAQ Accordion ── */
  function initFAQ() {
    document.querySelectorAll('.faq-question').forEach(function (btn) {
      btn.addEventListener('click', function () {
        const item = btn.closest('.faq-item');
        const isOpen = item.classList.contains('open');
        // Close all
        document.querySelectorAll('.faq-item.open').forEach(function (i) {
          i.classList.remove('open');
          i.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
        });
        if (!isOpen) {
          item.classList.add('open');
          btn.setAttribute('aria-expanded', 'true');
        }
      });
    });
  }

  /* ── Lazy Load Images ── */
  function initLazyLoad() {
    if ('loading' in HTMLImageElement.prototype) return; // native support
    const imgs = document.querySelectorAll('img[loading="lazy"]');
    if (!imgs.length) return;
    const io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          const img = e.target;
          if (img.dataset.src) img.src = img.dataset.src;
          io.unobserve(img);
        }
      });
    });
    imgs.forEach(function (img) { io.observe(img); });
  }

  /* ── Smooth scroll for anchor links ── */
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(function (a) {
      a.addEventListener('click', function (e) {
        const target = document.querySelector(a.getAttribute('href'));
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });
  }

  /* ── Copy to clipboard helper ── */
  window.copyToClipboard = function (text, btn) {
    navigator.clipboard.writeText(text).then(function () {
      const orig = btn ? btn.textContent : '';
      if (btn) {
        btn.textContent = 'Copied!';
        setTimeout(function () { btn.textContent = orig; }, 2000);
      }
    }).catch(function () {
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
    });
  };

  /* ── Init ── */
  document.addEventListener('DOMContentLoaded', function () {
    initMobileNav();
    setActiveNav();
    initFAQ();
    initLazyLoad();
    initSmoothScroll();
  });
})();
