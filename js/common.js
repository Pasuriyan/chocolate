/**
 * CACAO & CRU - SPECIALTY CHOCOLATE & CONFECTIONERY IMPORTS
 * COMMON.JS - Global Interactive Functionality
 * - RTL / LTR Direction Switcher with icon toggle & localStorage persistence
 * - Dark / Light Mode Theme Switcher with icon toggle & localStorage persistence
 * - Mobile Navigation & Responsive Dropdown handling
 * - Active page highlighter
 * - Global Toast notifications & Quick View Modal triggers
 */

(function () {
  'use strict';

  // --- SVG ICON TEMPLATES (Independent of external icon CDNs) ---
  const SVG_MOON = `
    <svg class="icon-moon" viewBox="0 0 24 24" width="22" height="22" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="moonGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#FFE082" />
          <stop offset="50%" stop-color="#FFCA28" />
          <stop offset="100%" stop-color="#FF9800" />
        </linearGradient>
      </defs>
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z" fill="url(#moonGrad)" stroke="#FFA000" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>
      <circle cx="9" cy="11" r="1.1" fill="#E65100" opacity="0.3"/>
      <circle cx="13" cy="15" r="0.9" fill="#E65100" opacity="0.25"/>
      <circle cx="8" cy="15" r="0.7" fill="#E65100" opacity="0.25"/>
    </svg>`;

  const SVG_SUN = `
    <svg class="icon-sun" viewBox="0 0 24 24" width="22" height="22" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="5" fill="#FFD54F" stroke="#F59E0B" stroke-width="1.5"/>
      <line x1="12" y1="1" x2="12" y2="4" stroke="#FFA000" stroke-width="2.2" stroke-linecap="round"/>
      <line x1="12" y1="20" x2="12" y2="23" stroke="#FFA000" stroke-width="2.2" stroke-linecap="round"/>
      <line x1="4.22" y1="4.22" x2="6.34" y2="6.34" stroke="#FFA000" stroke-width="2.2" stroke-linecap="round"/>
      <line x1="17.66" y1="17.66" x2="19.78" y2="19.78" stroke="#FFA000" stroke-width="2.2" stroke-linecap="round"/>
      <line x1="1" y1="12" x2="4" y2="12" stroke="#FFA000" stroke-width="2.2" stroke-linecap="round"/>
      <line x1="20" y1="12" x2="23" y2="12" stroke="#FFA000" stroke-width="2.2" stroke-linecap="round"/>
      <line x1="4.22" y1="19.78" x2="6.34" y2="17.66" stroke="#FFA000" stroke-width="2.2" stroke-linecap="round"/>
      <line x1="17.66" y1="6.34" x2="19.78" y2="4.22" stroke="#FFA000" stroke-width="2.2" stroke-linecap="round"/>
    </svg>`;

  const SVG_ARROW_BIDIRECTIONAL = `
    <svg class="icon-bidirectional" viewBox="0 0 24 16" width="24" height="16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M18.5 3.5L23 8L18.5 12.5" stroke="#FFFFFF" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M5.5 3.5L1 8L5.5 12.5" stroke="#FFFFFF" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M1.5 8H22.5" stroke="#FFFFFF" stroke-width="2.5" stroke-linecap="round"/>
    </svg>`;

  const SVG_BARS = `
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
      <line x1="3" y1="6" x2="21" y2="6"></line>
      <line x1="3" y1="12" x2="21" y2="12"></line>
      <line x1="3" y1="18" x2="21" y2="18"></line>
    </svg>`;

  const SVG_CLOSE = `
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
      <line x1="18" y1="6" x2="6" y2="18"></line>
      <line x1="6" y1="6" x2="18" y2="18"></line>
    </svg>`;

  // --- 1. THEME SWITCHER (DARK / LIGHT MODE) ---
  const THEME_STORAGE_KEY = 'cacao_theme_pref';
  const themeToggleBtn = document.getElementById('themeToggle');

  function initTheme() {
    const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
    const activeTheme = savedTheme ? savedTheme : 'dark';
    applyTheme(activeTheme);
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(THEME_STORAGE_KEY, theme);
    updateThemeIcon(theme);
  }

  function updateThemeIcon(theme) {
    if (!themeToggleBtn) return;
    if (theme === 'dark') {
      themeToggleBtn.innerHTML = SVG_MOON;
      themeToggleBtn.setAttribute('data-tooltip', 'Dark Mode Active (Click for Light)');
      themeToggleBtn.setAttribute('aria-label', 'Switch to Light Mode');
    } else {
      themeToggleBtn.innerHTML = SVG_SUN;
      themeToggleBtn.setAttribute('data-tooltip', 'Light Mode Active (Click for Dark)');
      themeToggleBtn.setAttribute('aria-label', 'Switch to Dark Mode');
    }
  }

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', function () {
      const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
      const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
      applyTheme(nextTheme);
      showToast(nextTheme === 'dark' ? '🌙 Dark Cocoa Mode Activated' : '☀️ Warm Velvet Light Mode Activated');
    });
  }

  // --- 2. RTL / LTR SWITCHER ---
  const DIR_STORAGE_KEY = 'cacao_direction_pref';
  const rtlToggleBtn = document.getElementById('rtlToggle');

  function initDirection() {
    const savedDir = localStorage.getItem(DIR_STORAGE_KEY) || 'ltr';
    applyDirection(savedDir);
  }

  function applyDirection(dir) {
    document.documentElement.setAttribute('dir', dir);
    localStorage.setItem(DIR_STORAGE_KEY, dir);
    updateRtlIcon(dir);
  }

  function updateRtlIcon(dir) {
    if (!rtlToggleBtn) return;
    rtlToggleBtn.innerHTML = SVG_ARROW_BIDIRECTIONAL;
    if (dir === 'rtl') {
      rtlToggleBtn.setAttribute('data-tooltip', 'RTL Active (Click for LTR)');
      rtlToggleBtn.setAttribute('aria-label', 'Switch to Left to Right layout');
      rtlToggleBtn.classList.add('active-pill');
    } else {
      rtlToggleBtn.setAttribute('data-tooltip', 'LTR Active (Click for RTL)');
      rtlToggleBtn.setAttribute('aria-label', 'Switch to Right to Left layout');
      rtlToggleBtn.classList.remove('active-pill');
    }
  }

  if (rtlToggleBtn) {
    rtlToggleBtn.addEventListener('click', function () {
      const currentDir = document.documentElement.getAttribute('dir') || 'ltr';
      const nextDir = currentDir === 'rtl' ? 'ltr' : 'rtl';
      applyDirection(nextDir);
      showToast(nextDir === 'rtl' ? '🔄 RTL (Right-to-Left) Enabled' : '🔄 LTR (Left-to-Right) Enabled');
    });
  }

  // --- 3. MOBILE MENU & ACCORDIONS ---
  const mobileToggle = document.getElementById('mobileToggle');
  const navMenu = document.getElementById('navMenu');

  if (mobileToggle && navMenu) {
    mobileToggle.innerHTML = SVG_BARS;
    mobileToggle.addEventListener('click', function () {
      const isOpen = navMenu.classList.toggle('mobile-open');
      mobileToggle.innerHTML = isOpen ? SVG_CLOSE : SVG_BARS;
    });
  }


  // Mobile dropdown expand on click
  document.querySelectorAll('.has-dropdown > .nav-link').forEach(link => {
    link.addEventListener('click', function (e) {
      if (window.innerWidth <= 768) {
        e.preventDefault();
        const parent = this.parentElement;
        parent.classList.toggle('dropdown-open');
      }
    });
  });

  // --- 4. ACTIVE NAVIGATION LINK DETECTION ---
  function highlightActiveNav() {
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-link, .dropdown-link').forEach(link => {
      const href = link.getAttribute('href');
      if (!href) return;
      const targetPage = href.split('/').pop();
      if (targetPage === currentPath || (currentPath === '' && targetPage === 'index.html')) {
        link.classList.add('active');
        const parentDropdown = link.closest('.has-dropdown');
        if (parentDropdown) {
          const parentLink = parentDropdown.querySelector(':scope > .nav-link');
          if (parentLink) parentLink.classList.add('active');
        }
      } else {
        link.classList.remove('active');
      }
    });
  }

  // --- 5. GLOBAL TOAST NOTIFICATION UTILITY ---
  window.showToast = function (message, type = 'info') {
    let container = document.querySelector('.toast-container');
    if (!container) {
      container = document.createElement('div');
      container.className = 'toast-container';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = 'toast-box';
    const iconSvg = type === 'success' 
      ? `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--gold-primary)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="16 9 10 15 7 12"></polyline></svg>`
      : `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--gold-primary)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>`;
    toast.innerHTML = `${iconSvg} <span>${message}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3200);
  };

  // --- 6. ADD TO CART / TASTING SAMPLE TRIGGER ---
  document.addEventListener('click', function (e) {
    const cartBtn = e.target.closest('.btn-add-cart');
    if (cartBtn) {
      e.preventDefault();
      const productName = cartBtn.getAttribute('data-product') || 'Specialty Confection';
      showToast(`Added to Tasting Cask: ${productName}`, 'success');
      
      // Update badge counter if exists
      const badge = document.querySelector('.cart-count-badge');
      if (badge) {
        const count = parseInt(badge.textContent || '0', 10) + 1;
        badge.textContent = count;
      }
    }
  });

  // --- 7. NEWSLETTER FORM HANDLER ---
  document.querySelectorAll('.newsletter-form').forEach(form => {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      const input = this.querySelector('input[type="email"]');
      if (input && input.value) {
        showToast(`Welcome to the Grand Cru Tasting Society, ${input.value}!`, 'success');
        input.value = '';
      }
    });
  });

  // --- 8. INITIALIZE ON DOM READY ---
  document.addEventListener('DOMContentLoaded', function () {
    initTheme();
    initDirection();
    highlightActiveNav();
  });

})();
