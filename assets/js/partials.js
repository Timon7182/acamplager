/* A CAMP — injects shared header / footer / floating actions
   Works on file:// (no fetch). Place <div id="site-header"></div> etc. on each page,
   then load this script BEFORE main.js so i18n + nav bindings see the injected DOM.
*/
(function () {
  const HEADER = `
    <header class="site-header">
      <div class="nav">
        <a href="index.html" class="brand" aria-label="A CAMP">
          <img src="assets/img/logo.png" alt="A CAMP" />
        </a>
        <nav>
          <ul class="nav-links">
            <li><a href="index.html"         data-nav="home"      data-i18n="nav.home">Главная</a></li>
            <li><a href="schedule.html"      data-nav="schedule"  data-i18n="nav.schedule">Расписание</a></li>
            <li><a href="prices.html"        data-nav="prices"    data-i18n="nav.prices">Цены</a></li>
            <li><a href="trips.html"         data-nav="trips"     data-i18n="nav.trips">Выезды</a></li>
            <li><a href="masterclasses.html" data-nav="mk"        data-i18n="nav.mk">Мастер-классы</a></li>
            <li><a href="education.html"     data-nav="education" data-i18n="nav.education">Обучение</a></li>
            <li><a href="gallery.html"       data-nav="gallery"   data-i18n="nav.gallery">Фото</a></li>
            <li><a href="videos.html"        data-nav="videos"    data-i18n="nav.videos">Видео</a></li>
            <li><a href="contacts.html"      data-nav="contacts"  data-i18n="nav.contacts">Контакты</a></li>
          </ul>
        </nav>
        <div class="nav-actions">
          <div class="lang-switch" role="group" aria-label="Language">
            <button type="button" data-lang="ru">RU</button>
            <button type="button" data-lang="kz">KZ</button>
          </div>
          <button class="menu-toggle" aria-label="Menu"><span></span></button>
        </div>
      </div>
    </header>
  `;

  const SOCIAL_ICONS = `
    <a href="https://www.instagram.com/aschool_kz" target="_blank" rel="noopener" aria-label="Instagram">
      <svg viewBox="0 0 24 24"><path d="M12 2.16c3.2 0 3.58.01 4.85.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.42.36 1.06.41 2.23.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.25 1.8-.41 2.23a3.7 3.7 0 0 1-.9 1.38c-.42.42-.82.68-1.38.9-.42.16-1.06.36-2.23.41-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.8-.25-2.23-.41a3.7 3.7 0 0 1-1.38-.9 3.7 3.7 0 0 1-.9-1.38c-.16-.42-.36-1.06-.41-2.23C2.17 15.58 2.16 15.2 2.16 12s.01-3.58.07-4.85c.05-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.16 1.06-.36 2.23-.41C8.42 2.17 8.8 2.16 12 2.16zm0 1.94c-3.15 0-3.5.01-4.74.07-1.07.05-1.65.23-2.04.38-.51.2-.88.44-1.27.83-.39.39-.63.76-.83 1.27-.15.39-.33.97-.38 2.04C2.7 8.5 2.7 8.85 2.7 12s.01 3.5.07 4.74c.05 1.07.23 1.65.38 2.04.2.51.44.88.83 1.27.39.39.76.63 1.27.83.39.15.97.33 2.04.38 1.24.06 1.59.07 4.74.07s3.5-.01 4.74-.07c1.07-.05 1.65-.23 2.04-.38.51-.2.88-.44 1.27-.83.39-.39.63-.76.83-1.27.15-.39.33-.97.38-2.04.06-1.24.07-1.59.07-4.74s-.01-3.5-.07-4.74c-.05-1.07-.23-1.65-.38-2.04a3.4 3.4 0 0 0-.83-1.27 3.4 3.4 0 0 0-1.27-.83c-.39-.15-.97-.33-2.04-.38C15.5 4.11 15.15 4.1 12 4.1zm0 3.3a4.6 4.6 0 1 1 0 9.2 4.6 4.6 0 0 1 0-9.2zm0 1.94a2.66 2.66 0 1 0 0 5.32 2.66 2.66 0 0 0 0-5.32zm5.85-2.16a1.08 1.08 0 1 1-2.16 0 1.08 1.08 0 0 1 2.16 0z"/></svg>
    </a>
    <a href="https://www.tiktok.com/@aschool_kz" target="_blank" rel="noopener" aria-label="TikTok">
      <svg viewBox="0 0 24 24"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5.8 20.1a6.34 6.34 0 0 0 10.86-4.43V8.55a8.16 8.16 0 0 0 4.77 1.52V6.69a4.85 4.85 0 0 1-1.84-.01z"/></svg>
    </a>
    <a href="https://wa.me/77004349775" target="_blank" rel="noopener" aria-label="WhatsApp">
      <svg viewBox="0 0 24 24"><path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 2.1.55 4.15 1.6 5.96L2 22l4.27-1.12a9.93 9.93 0 0 0 5.77 1.83h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.83 9.83 0 0 0 12.04 2zm4.52 11.89c-.25-.12-1.47-.72-1.7-.8-.23-.08-.39-.12-.56.12-.17.25-.64.8-.78.97-.14.17-.29.18-.54.06-.25-.12-1.05-.39-2-1.24-.74-.66-1.24-1.47-1.38-1.72-.14-.25-.02-.39.11-.51.12-.12.25-.29.37-.43.12-.14.17-.25.25-.41.08-.17.04-.31-.02-.43-.06-.12-.56-1.34-.77-1.84-.2-.49-.41-.42-.56-.43h-.48c-.17 0-.43.06-.66.31-.23.25-.86.84-.86 2.05 0 1.2.88 2.37 1 2.53.12.17 1.73 2.64 4.19 3.7.59.26 1.05.41 1.4.52.59.19 1.12.16 1.55.1.47-.07 1.47-.6 1.68-1.18.2-.58.2-1.07.14-1.18-.06-.11-.22-.17-.47-.29z"/></svg>
    </a>
  `;

  const FOOTER = `
    <footer class="site-footer">
      <div class="container">
        <div class="footer-grid">
          <div>
            <div class="brand" style="margin-bottom: 14px;">
              <img src="assets/img/logo.png" alt="A CAMP" style="filter: brightness(0) invert(1);" />
            </div>
            <p style="font-family: 'Neucha', sans-serif; font-size: 17px; opacity: 0.85;" data-i18n="footer.about">A CAMP — авторский летний лагерь в Астане.</p>
          </div>
          <div>
            <h4 data-i18n="footer.menu">Меню</h4>
            <ul>
              <li><a href="schedule.html" data-i18n="nav.schedule">Расписание</a></li>
              <li><a href="prices.html" data-i18n="nav.prices">Цены</a></li>
              <li><a href="trips.html" data-i18n="nav.trips">Выезды</a></li>
              <li><a href="masterclasses.html" data-i18n="nav.mk">Мастер-классы</a></li>
              <li><a href="education.html" data-i18n="nav.education">Обучение</a></li>
              <li><a href="gallery.html" data-i18n="nav.gallery">Фото</a></li>
              <li><a href="videos.html" data-i18n="nav.videos">Видео</a></li>
            </ul>
          </div>
          <div>
            <h4 data-i18n="footer.contacts">Контакты</h4>
            <ul>
              <li><a href="tel:+77004349775">+7 700 434 9775</a></li>
              <li><a href="https://wa.me/77004349775" target="_blank" rel="noopener">WhatsApp</a></li>
              <li><span data-i18n="footer.address">Астана, Толе би 40</span></li>
              <li><span data-i18n="footer.hours">Пн–Пт · 09:00–18:00</span></li>
            </ul>
          </div>
          <div>
            <h4 data-i18n="footer.follow">Соцсети</h4>
            <div class="footer-socials">${SOCIAL_ICONS}</div>
          </div>
        </div>
        <div class="footer-bottom">
          <span data-i18n="footer.rights">© 2026 A CAMP · все права защищены</span>
          <span>made in Astana</span>
        </div>
      </div>
    </footer>
  `;

  const FLOATING = `
    <div class="floating-actions" aria-label="Quick actions">
      <a class="float-btn float-btn--wa" href="https://wa.me/77004349775" target="_blank" rel="noopener" aria-label="WhatsApp">
        <svg viewBox="0 0 24 24"><path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 2.1.55 4.15 1.6 5.96L2 22l4.27-1.12a9.93 9.93 0 0 0 5.77 1.83h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.83 9.83 0 0 0 12.04 2zm4.52 11.89c-.25-.12-1.47-.72-1.7-.8-.23-.08-.39-.12-.56.12-.17.25-.64.8-.78.97-.14.17-.29.18-.54.06-.25-.12-1.05-.39-2-1.24-.74-.66-1.24-1.47-1.38-1.72-.14-.25-.02-.39.11-.51.12-.12.25-.29.37-.43.12-.14.17-.25.25-.41.08-.17.04-.31-.02-.43-.06-.12-.56-1.34-.77-1.84-.2-.49-.41-.42-.56-.43h-.48c-.17 0-.43.06-.66.31-.23.25-.86.84-.86 2.05 0 1.2.88 2.37 1 2.53.12.17 1.73 2.64 4.19 3.7.59.26 1.05.41 1.4.52.59.19 1.12.16 1.55.1.47-.07 1.47-.6 1.68-1.18.2-.58.2-1.07.14-1.18-.06-.11-.22-.17-.47-.29z"/></svg>
      </a>
      <a class="float-btn" href="tel:+77004349775" aria-label="Phone">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.37 1.9.72 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.35 1.85.59 2.81.72A2 2 0 0 1 22 16.92z"/></svg>
      </a>
    </div>
  `;

  function inject(id, html) {
    const el = document.getElementById(id);
    if (el) el.innerHTML = html;
  }

  inject('site-header', HEADER);
  inject('site-footer', FOOTER);
  inject('floating-actions', FLOATING);
})();
