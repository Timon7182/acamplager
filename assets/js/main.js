/* A CAMP — shared front-end script
   - Language switcher (RU / KZ) with localStorage
   - Mobile nav toggle
   - Scroll reveal
   - Active nav highlight by data-page
*/
(function () {
  const STORE_KEY = 'acamp_lang';
  const DEFAULT_LANG = 'ru';

  function getLang() {
    const saved = localStorage.getItem(STORE_KEY);
    return (saved === 'ru' || saved === 'kz') ? saved : DEFAULT_LANG;
  }

  function applyLang(lang) {
    if (!window.I18N || !window.I18N[lang]) return;
    const dict = window.I18N[lang];
    document.documentElement.setAttribute('lang', lang === 'kz' ? 'kk' : 'ru');
    document.querySelectorAll('[data-i18n]').forEach((el) => {
      const key = el.getAttribute('data-i18n');
      if (dict[key] !== undefined) el.textContent = dict[key];
    });
    document.querySelectorAll('[data-i18n-html]').forEach((el) => {
      const key = el.getAttribute('data-i18n-html');
      if (dict[key] !== undefined) el.innerHTML = dict[key];
    });
    document.querySelectorAll('[data-i18n-attr]').forEach((el) => {
      el.getAttribute('data-i18n-attr').split(';').forEach((pair) => {
        const [attr, key] = pair.split(':').map(s => s && s.trim());
        if (!attr || !key) return;
        if (dict[key] !== undefined) el.setAttribute(attr, dict[key]);
      });
    });
    document.querySelectorAll('.lang-switch button').forEach((b) => {
      b.classList.toggle('active', b.dataset.lang === lang);
    });
    localStorage.setItem(STORE_KEY, lang);
  }

  function bindLang() {
    document.querySelectorAll('.lang-switch button').forEach((b) => {
      b.addEventListener('click', () => applyLang(b.dataset.lang));
    });
  }

  function bindNav() {
    const toggle = document.querySelector('.menu-toggle');
    const links = document.querySelector('.nav-links');
    if (!toggle || !links) return;
    toggle.addEventListener('click', () => links.classList.toggle('open'));
    links.querySelectorAll('a').forEach((a) => {
      a.addEventListener('click', () => links.classList.remove('open'));
    });
  }

  function markActive() {
    const page = document.body.dataset.page;
    if (!page) return;
    document.querySelectorAll('.nav-links a[data-nav]').forEach((a) => {
      a.classList.toggle('active', a.dataset.nav === page);
    });
  }

  function renderIcons() {
    if (window.lucide && typeof window.lucide.createIcons === 'function') {
      window.lucide.createIcons();
      return;
    }
    const existing = document.getElementById('lucide-cdn');
    if (existing) return;
    const s = document.createElement('script');
    s.id = 'lucide-cdn';
    s.src = 'https://unpkg.com/lucide@latest/dist/umd/lucide.min.js';
    s.onload = () => window.lucide && window.lucide.createIcons();
    document.head.appendChild(s);
  }

  function bindReveal() {
    if (!('IntersectionObserver' in window)) {
      document.querySelectorAll('.reveal').forEach(el => el.classList.add('in'));
      return;
    }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add('in');
          io.unobserve(e.target);
        }
      });
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0.1 });
    document.querySelectorAll('.reveal').forEach(el => io.observe(el));
  }

  function init() {
    applyLang(getLang());
    bindLang();
    bindNav();
    markActive();
    bindReveal();
    renderIcons();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
