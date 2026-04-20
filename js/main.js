/**
 * main.js
 * Core interaction layer for ByteXSoftware.
 *
 * Modules:
 *  1. Scroll Reveal     — IntersectionObserver for .reveal elements
 *  2. Navbar Scroll     — adds .scrolled class on scroll > 60px
 *  3. Hamburger Menu    — toggles full-screen mobile overlay
 *  4. FAQ Accordion     — single-open accordion with smooth height transition
 *  5. WA Contact Form   — builds WhatsApp deep-link from form values
 */

(function () {
  'use strict';

  /* ── 1. SCROLL REVEAL ─────────────────────────────────────────────────── */
  function initScrollReveal() {
    const els = document.querySelectorAll('.reveal');
    if (!els.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    els.forEach((el) => observer.observe(el));
  }

  /* ── 2. NAVBAR SCROLL ─────────────────────────────────────────────────── */
  function initNavbarScroll() {
    const navbar = document.getElementById('nav');
    if (!navbar) return;

    const onScroll = () => navbar.classList.toggle('scrolled', window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* ── 3. HAMBURGER MENU ────────────────────────────────────────────────── */
  function initHamburger() {
    const btn        = document.getElementById('hamburger-btn');
    const mobileMenu = document.getElementById('mobile-menu');

    if (!btn || !mobileMenu) return;

    function openMenu() {
      btn.classList.add('is-open');
      mobileMenu.classList.add('is-open');
      document.body.style.overflow = 'hidden';
      btn.setAttribute('aria-expanded', 'true');
    }

    function closeMenu() {
      btn.classList.remove('is-open');
      mobileMenu.classList.remove('is-open');
      document.body.style.overflow = '';
      btn.setAttribute('aria-expanded', 'false');
    }

    function toggleMenu() {
      btn.classList.contains('is-open') ? closeMenu() : openMenu();
    }

    btn.addEventListener('click', toggleMenu);

    // Close when a nav link is clicked
    mobileMenu.querySelectorAll('a').forEach((link) =>
      link.addEventListener('click', closeMenu)
    );

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeMenu();
    });
  }

  /* ── 4. FAQ ACCORDION ─────────────────────────────────────────────────── */
  function initFaqAccordion() {
    const items = document.querySelectorAll('.faq-item');
    if (!items.length) return;

    function closeAll() {
      items.forEach((item) => {
        item.classList.remove('open');
        const body = item.querySelector('.faq-body');
        if (body) body.style.maxHeight = null;
      });
    }

    items.forEach((item) => {
      const btn  = item.querySelector('.faq-btn');
      const body = item.querySelector('.faq-body');
      if (!btn || !body) return;

      btn.addEventListener('click', () => {
        const isOpen = item.classList.contains('open');
        closeAll();
        if (!isOpen) {
          item.classList.add('open');
          body.style.maxHeight = body.scrollHeight + 'px';
        }
      });
    });
  }

  /* ── 5. WHATSAPP CONTACT FORM ─────────────────────────────────────────── */
  function initWAForm() {
    const submitBtn = document.getElementById('form-submit-btn');
    if (!submitBtn) return;

    submitBtn.addEventListener('click', () => {
      const nombre  = document.getElementById('f-nombre')?.value.trim() || 'Sin nombre';
      const telefono = document.getElementById('f-tel')?.value.trim()   || 'No indicado';
      const plan    = document.getElementById('f-plan')?.value           || 'No seleccionado';
      const mensaje = document.getElementById('f-msg')?.value.trim()    || 'Sin mensaje';

      const text = encodeURIComponent(
        `Hola ByteXSoftware 👋\n\n*Nombre:* ${nombre}\n*Teléfono:* ${telefono}\n*Plan:* ${plan}\n*Mensaje:* ${mensaje}`
      );

      window.open(`https://wa.me/573000000000?text=${text}`, '_blank', 'noopener,noreferrer');
    });
  }

  /* ── INIT ─────────────────────────────────────────────────────────────── */
  function init() {
    initScrollReveal();
    initNavbarScroll();
    initHamburger();
    initFaqAccordion();
    initWAForm();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
