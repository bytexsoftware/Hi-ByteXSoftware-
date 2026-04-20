/**
 * plan-detail.js
 * Logic for pages/plan-detalle.html
 *
 * Responsibilities:
 *  1. planConfig  — Data source: all plan definitions in one place
 *  2. initPlanUI  — Reads ?plan= from URL and populates the page
 *  3. initNavbar  — Adds .scrolled class on scroll (reused pattern from main.js)
 *  4. initForm    — Validates inputs and sends a WhatsApp deep-link
 */

(function () {
  'use strict';

  /* ── 1. PLAN CONFIGURATION DATA ─────────────────────────────────────────
     Single source of truth for all plans.
     Any content change should be made here only.
  ──────────────────────────────────────────────────────────────────────── */
  const WHATSAPP_NUMBER = '573028666626';

  /** @type {Record<string, PlanConfig>} */
  const planConfig = {
    'ultra-basico': {
      tag:      'plan_01',
      name:     'Ultra Básico',
      tagline:  'Para empezar tu presencia digital hoy mismo',
      price:    '70.000',
      period:   'COP · Pago único · Subdominio gratuito',
      urlLabel: 'tunegocio.netlify.app',
      industry: 'Tu negocio',
      image:    '../images/Ultra Basico.png',
      imageAlt: 'Ejemplo de página web Plan Ultra Básico',
      features: [
        'Landing page 1 sección',
        'Subdominio gratuito (.netlify.app)',
        'Botón WhatsApp integrado',
        '100% responsive (móvil)',
        'Entrega en 1–2 días hábiles',
      ],
      upsell: null,
    },
    'basico': {
      tag:      'plan_02',
      name:     'Básico',
      tagline:  'Tu negocio online con lo esencial bien hecho',
      price:    '100.000',
      period:   'COP · Pago único · Subdominio + SSL gratis',
      urlLabel: 'tunegocio.netlify.app',
      industry: 'Tu negocio',
      image:    '../images/Basico.png',
      imageAlt: 'Ejemplo de página web Plan Básico',
      features: [
        'Página web hasta 3 secciones',
        'SSL certificado',
        'Formulario de contacto',
        'Íconos de redes sociales',
        'Entrega en 2–3 días hábiles',
      ],
      upsell: 'Ultra Básico',
    },
    'starter': {
      tag:      'plan_03',
      name:     'Starter',
      tagline:  'Web completa con tu dominio .com propio',
      price:    '250.000',
      period:   'COP · Pago único · Dominio .com incluido 1 año',
      urlLabel: 'tunegocio.com',
      industry: 'Tu negocio',
      image:    '../images/Started.png',
      imageAlt: 'Ejemplo de página web Plan Starter',
      features: [
        'Página web hasta 5 secciones',
        'Dominio .com por 1 año',
        'Hosting incluido',
        'Galería de imágenes',
        'SEO básico · 1 mes soporte',
      ],
      upsell: 'Básico',
    },
    'growth': {
      tag:      'plan_04',
      name:     'Growth',
      tagline:  'Web + redes sociales = presencia digital completa',
      price:    '450.000',
      period:   'COP · Pago único · Dominio incluido 1 año',
      urlLabel: 'tunegocio.com',
      industry: 'Tu negocio',
      image:    '../images/Growth.png',
      imageAlt: 'Ejemplo de página web Plan Growth',
      features: [
        'Página web hasta 8 secciones',
        'Facebook Business configurado',
        'Instagram Profesional + portadas',
        '2 meses de soporte incluido',
      ],
      upsell: 'Starter',
    },
    'pro': {
      tag:      'plan_05',
      name:     'Pro',
      tagline:  'Presencia total + Google Maps + correo propio',
      price:    '750.000',
      period:   'COP · Pago único · 3 meses soporte incluido',
      urlLabel: 'tunegocio.com',
      industry: 'Tu negocio',
      image:    '../images/Pro.png',
      imageAlt: 'Ejemplo de página web Plan Pro',
      features: [
        'Google Mi Negocio verificado',
        'Integración Google Maps',
        'Correo corporativo (1 cuenta)',
        'Capacitación de uso incluida',
        '3 meses de soporte incluido',
      ],
      upsell: 'Growth',
    },
    'elite': {
      tag:      'plan_06',
      name:     'Elite',
      tagline:  'Todo en uno + mantenimiento mensual incluido',
      price:    '1.000.000',
      period:   'COP inicio + $250.000/mes mantenimiento',
      urlLabel: 'tunegocio.com',
      industry: 'Tu negocio',
      image:    '../images/Elite.png',
      imageAlt: 'Ejemplo de página web Plan Elite',
      features: [
        'Hasta 2 correos corporativos',
        'Mantenimiento y actualizaciones',
        'Gestión básica de publicaciones',
        'Soporte prioritario WhatsApp',
      ],
      upsell: 'Pro',
    },
  };

  /** Fallback used when the URL param is missing or unknown. */
  const DEFAULT_PLAN_KEY = 'ultra-basico';

  /* ── 2. POPULATE PLAN UI ─────────────────────────────────────────────── */
  function initPlanUI() {
    const params  = new URLSearchParams(window.location.search);
    const key     = params.get('plan') || DEFAULT_PLAN_KEY;
    const plan    = planConfig[key] || planConfig[DEFAULT_PLAN_KEY];

    // Update <title>
    document.title = `ByteXSoftware | Plan ${plan.name}`;

    // Populate static text nodes
    setTextById('plan-tag',      plan.tag);
    setTextById('plan-name',     plan.name);
    setTextById('plan-tagline',  plan.tagline);
    setTextById('plan-price',    plan.price);
    setTextById('plan-period',   plan.period);
    setTextById('dbc-url-label', plan.urlLabel);

    // Update plan preview image
    const previewImg = document.getElementById('dbc-preview-img');
    if (previewImg) {
      previewImg.src = plan.image;
      previewImg.alt = plan.imageAlt;
    }

    // Hidden form field
    const hiddenPlan = document.getElementById('dp-plan');
    if (hiddenPlan) hiddenPlan.value = plan.name;

    // Build features list
    const listEl = document.getElementById('plan-features');
    if (!listEl) return;

    listEl.innerHTML = '';

    // Upsell phrase
    if (plan.upsell) {
      const li = document.createElement('li');
      li.className = 'plan-upsell';
      li.innerHTML = `<span>Todo lo que incluye <strong>${plan.upsell}</strong>, adem\u00e1s de:</span>`;
      listEl.appendChild(li);
    }

    // Feature bullets
    plan.features.forEach((text) => {
      const li    = document.createElement('li');
      const icon  = document.createElement('div');
      const span  = document.createElement('span');
      icon.className  = 'feat-icon';
      icon.textContent = '✓';
      span.textContent = text;
      li.appendChild(icon);
      li.appendChild(span);
      listEl.appendChild(li);
    });
  }

  /** Helper: safely set textContent of an element by id. */
  function setTextById(id, text) {
    const el = document.getElementById(id);
    if (el) el.textContent = text;
  }

  /* ── 3. NAVBAR SCROLL ─────────────────────────────────────────────────── */
  function initNavbarScroll() {
    const navbar = document.getElementById('nav');
    if (!navbar) return;
    const onScroll = () => navbar.classList.toggle('scrolled', window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* ── 4. CONTACT FORM ──────────────────────────────────────────────────── */
  function initForm() {
    const form      = document.getElementById('plan-contact-form');
    const submitBtn = document.getElementById('dp-submit');
    const success   = document.getElementById('dfc-success');

    if (!form || !submitBtn) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!validateForm(form)) return;

      const nombre  = getVal('dp-nombre');
      const wa      = getVal('dp-wa');
      const negocio = getVal('dp-negocio');
      const plan    = getVal('dp-plan');

      const msg = encodeURIComponent(
        `Hola ByteXSoftware! 👋\n\n` +
        `*Plan:* ${plan}\n` +
        `*Nombre:* ${nombre}\n` +
        `*WhatsApp:* ${wa}\n\n` +
        `*Mi negocio:*\n${negocio}`
      );

      window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`, '_blank', 'noopener,noreferrer');

      // Show success state
      if (success) {
        form.hidden    = true;
        success.hidden = false;
      }
    });
  }

  /**
   * Validates all required fields.
   * Marks inputs with .error class and inserts error messages.
   * @param {HTMLFormElement} form
   * @returns {boolean}
   */
  function validateForm(form) {
    let valid = true;

    // Clear previous errors
    form.querySelectorAll('.error').forEach((el) => el.classList.remove('error'));
    form.querySelectorAll('.field-error').forEach((el) => el.remove());

    const required = form.querySelectorAll('[required]');
    required.forEach((field) => {
      if (!field.value.trim()) {
        markError(field, 'Este campo es obligatorio');
        valid = false;
      }
    });

    // Basic phone length check
    const waField = document.getElementById('dp-wa');
    if (waField && waField.value.trim() && waField.value.replace(/\D/g, '').length < 7) {
      markError(waField, 'Ingresa un número de teléfono válido');
      valid = false;
    }

    return valid;
  }

  /**
   * Marks a field as invalid and appends an error message below it.
   * @param {HTMLElement} field
   * @param {string} message
   */
  function markError(field, message) {
    field.classList.add('error');
    const msg       = document.createElement('span');
    msg.className   = 'field-error';
    msg.textContent = message;
    field.insertAdjacentElement('afterend', msg);
  }

  /** Returns trimmed value of an input by id. */
  function getVal(id) {
    return document.getElementById(id)?.value.trim() || '';
  }

  /* ── INIT ─────────────────────────────────────────────────────────────── */
  function init() {
    initPlanUI();
    initNavbarScroll();
    initForm();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
