/* A CAMP — Yandex.Metrika + lightweight event tracking
   Replace YM_COUNTER_ID with the real counter ID from https://metrika.yandex.ru
   Goals fired:
     - wa_click       — клик по любой WhatsApp кнопке
     - call_click     — клик по «Позвонить» / tel:
     - prices_click   — переход к ценам
     - address_click  — переход к адресу/карте
     - book_click     — клик по «Забронировать»
     - form_submit    — отправка формы записи
*/
(function () {
  var YM_COUNTER_ID = 0; // ← вставьте сюда номер счётчика Яндекс.Метрики

  if (!YM_COUNTER_ID) {
    window.ym = window.ym || function () { (window.ym.a = window.ym.a || []).push(arguments); };
    window.ym.l = +new Date();
    return;
  }

  (function (m, e, t, r, i, k, a) {
    m[i] = m[i] || function () { (m[i].a = m[i].a || []).push(arguments); };
    m[i].l = 1 * new Date();
    for (var j = 0; j < document.scripts.length; j++) {
      if (document.scripts[j].src === r) return;
    }
    k = e.createElement(t); a = e.getElementsByTagName(t)[0];
    k.async = 1; k.src = r; a.parentNode.insertBefore(k, a);
  })(window, document, 'script', 'https://mc.yandex.ru/metrika/tag.js', 'ym');

  window.ym(YM_COUNTER_ID, 'init', {
    defer: true,
    clickmap: true,
    trackLinks: true,
    accurateTrackBounce: true,
    webvisor: true,
    ecommerce: 'dataLayer'
  });

  function fire(goal, params) {
    try { window.ym(YM_COUNTER_ID, 'reachGoal', goal, params || {}); } catch (_) {}
  }

  function bind() {
    document.addEventListener('click', function (e) {
      var a = e.target.closest && e.target.closest('a, button');
      if (!a) return;
      var href = (a.getAttribute && a.getAttribute('href')) || '';
      var text = (a.textContent || '').trim().toLowerCase();

      if (/wa\.me|whatsapp/i.test(href) || /whatsapp/i.test(text)) fire('wa_click');
      else if (href.indexOf('tel:') === 0) fire('call_click');
      else if (/prices\.html|#prices/i.test(href) || /цены/i.test(text)) fire('prices_click');
      else if (/contacts\.html#map|2gis|yandex\.kz\/maps/i.test(href) || /адрес/i.test(text)) fire('address_click');
      else if (/забронир|book/i.test(text)) fire('book_click');
    }, { passive: true });

    document.addEventListener('submit', function (e) {
      if (e.target && e.target.tagName === 'FORM') fire('form_submit');
    }, true);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bind);
  } else { bind(); }
})();
