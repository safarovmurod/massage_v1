/* ============================================
   Main JS — Theme, Menu, Animations, Form
   ============================================ */

// === WHATSAPP NUMBER ===
const WHATSAPP_NUMBER = '992007336264';

// === THEME TOGGLE ===
function initTheme() {
  const savedTheme = localStorage.getItem('theme') || 'dark';
  document.documentElement.setAttribute('data-theme', savedTheme);
  updateThemeIcon(savedTheme);
}

function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme') || 'dark';
  const newTheme = current === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', newTheme);
  localStorage.setItem('theme', newTheme);
  updateThemeIcon(newTheme);
}

function updateThemeIcon(theme) {
  const toggle = document.querySelector('.theme-toggle');
  if (toggle) {
    toggle.textContent = theme === 'dark' ? '☀' : '☾';
  }
}

// === MOBILE MENU ===
function initMobileMenu() {
  const burger = document.querySelector('.burger');
  const menu = document.querySelector('.mobile-menu');
  const overlay = document.querySelector('.mobile-menu-overlay');

  if (!burger || !menu) return;

  burger.addEventListener('click', () => {
    burger.classList.toggle('active');
    menu.classList.toggle('active');
    if (overlay) overlay.classList.toggle('active');
    document.body.style.overflow = menu.classList.contains('active') ? 'hidden' : '';
  });

  if (overlay) {
    overlay.addEventListener('click', () => closeMenu());
  }

  // Close on link click
  menu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => closeMenu());
  });
}

function closeMenu() {
  const burger = document.querySelector('.burger');
  const menu = document.querySelector('.mobile-menu');
  const overlay = document.querySelector('.mobile-menu-overlay');
  if (burger) burger.classList.remove('active');
  if (menu) menu.classList.remove('active');
  if (overlay) overlay.classList.remove('active');
  document.body.style.overflow = '';
}

// === LANGUAGE SELECTOR ===
function initLanguage() {
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const lang = btn.getAttribute('data-lang');
      applyTranslations(lang);
    });
  });
  applyTranslations(currentLang);
}

// === SCROLL ANIMATIONS ===
function initScrollAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  document.querySelectorAll('.fade-in').forEach(el => {
    observer.observe(el);
  });
}

// === CONTACT FORM ===
function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  const forWhomSelect = document.getElementById('forWhom');
  const childNote = document.getElementById('childNote');
  const formContainer = document.getElementById('formContainer');
  const successMessage = document.getElementById('formSuccess');

  if (forWhomSelect) {
    forWhomSelect.addEventListener('change', () => {
      if (forWhomSelect.value === 'child' && childNote) {
        childNote.classList.add('show');
      } else if (childNote) {
        childNote.classList.remove('show');
      }
    });
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('name').value;
    const phone = document.getElementById('phone').value;
    const time = document.getElementById('time').value;
    const forWhom = document.getElementById('forWhom').value;
    const comment = document.getElementById('comment').value;

    const lang = getLang();
    let forWhomText = '';
    if (forWhom === 'woman') forWhomText = translations[lang]['contact.form.forWhom.woman'];
    if (forWhom === 'child') forWhomText = translations[lang]['contact.form.forWhom.child'];

    // Build WhatsApp message
    let waMsg = translations[lang]['wa.general'] + '\n\n';
    waMsg += `👤 ${translations[lang]['contact.form.name']}: ${name}\n`;
    waMsg += `📞 ${translations[lang]['contact.form.phone']}: ${phone}\n`;
    waMsg += `🕐 ${translations[lang]['contact.form.time']}: ${time}\n`;
    if (forWhomText) waMsg += `🎯 ${translations[lang]['contact.form.forWhom']}: ${forWhomText}\n`;
    if (comment) waMsg += `💬 ${translations[lang]['contact.form.comment']}: ${comment}\n`;

    // Open WhatsApp with the message
    const waUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(waMsg)}`;
    window.open(waUrl, '_blank');

    // Show success message
    if (formContainer) formContainer.style.display = 'none';
    if (successMessage) successMessage.classList.add('show');
  });
}

// === SMOOTH SCROLL ===
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href === '#' || href.length < 2) return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const headerHeight = document.querySelector('.header')?.offsetHeight || 0;
        const targetPos = target.getBoundingClientRect().top + window.pageYOffset - headerHeight - 20;
        window.scrollTo({ top: targetPos, behavior: 'smooth' });
      }
    });
  });
}

// === HEADER SCROLL EFFECT ===
function initHeaderScroll() {
  const header = document.querySelector('.header');
  if (!header) return;

  let lastScroll = 0;
  window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    if (currentScroll > 50) {
      header.style.boxShadow = '0 2px 20px rgba(0,0,0,0.15)';
    } else {
      header.style.boxShadow = 'none';
    }
    lastScroll = currentScroll;
  });
}

// === INIT ALL ===
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initLanguage();
  initMobileMenu();
  initScrollAnimations();
  initSmoothScroll();
  initHeaderScroll();
  initContactForm();
});
