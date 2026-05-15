/* A CAMP — SEO & structured data injector
   Synchronously injects OG/Twitter/canonical/JSON-LD into <head>.
   Detects current page from window.location.pathname.
   Edit SITE_ORIGIN below after first deploy to match the real domain.
*/
(function () {
  var SITE_ORIGIN = 'https://acamp.kz';
  var DEFAULT_IMG = SITE_ORIGIN + '/assets/img/hero.png';
  var LOGO = SITE_ORIGIN + '/assets/img/logo.png';
  var PHONE = '+77004349775';
  var EMAIL = 'hello@acamp.kz';
  var ADDRESS_STREET = 'Толе би 40';
  var ADDRESS_CITY = 'Астана';
  var ADDRESS_COUNTRY = 'KZ';

  var PAGES = {
    'index.html':       { id: 'home',     path: '',                    title: 'A CAMP — Летний лагерь в Астане · Astanapolis 2026', desc: 'Авторский летний лагерь A CAMP в Астане для детей 6–11 лет. Программа Astanapolis: 5-звёздное лето в Городе Будущего по системе «всё включено».', crumbs: [{n:'Главная',u:'/'}] },
    'schedule.html':    { id: 'schedule', path: 'schedule.html',       title: 'Расписание дня · A CAMP', desc: 'Один день в лагере A CAMP — 9 часов приключений, 5 дней в неделю с 9:00 до 18:00. Подробное расписание дня.', crumbs: [{n:'Главная',u:'/'},{n:'Расписание',u:'/schedule.html'}] },
    'prices.html':      { id: 'prices',   path: 'prices.html',         title: 'Цены и тарифы летнего лагеря · A CAMP', desc: 'Цены на летний лагерь A CAMP в Астане: неделя, две недели, полная смена. Скидки на второго ребёнка, рассрочка Kaspi и Halyk.', crumbs: [{n:'Главная',u:'/'},{n:'Цены',u:'/prices.html'}] },
    'trips.html':       { id: 'trips',    path: 'trips.html',          title: 'Выезды и экскурсии · A CAMP', desc: 'Каждую неделю — выезд за пределы лагеря: познавательная, спортивная или творческая программа. Космо-центр, парки, музеи Астаны.', crumbs: [{n:'Главная',u:'/'},{n:'Выезды',u:'/trips.html'}] },
    'masterclasses.html': { id: 'mk',     path: 'masterclasses.html',  title: 'Мастер-классы · A CAMP', desc: 'Каждый день в лагере A CAMP — новый мастер-класс от приглашённого эксперта. Творчество, наука, кулинария, программирование.', crumbs: [{n:'Главная',u:'/'},{n:'Мастер-классы',u:'/masterclasses.html'}] },
    'education.html':   { id: 'education',path: 'education.html',      title: 'Обучение в лагере · A CAMP', desc: 'Программа A CAMP сделана так, чтобы дети не теряли навыки за лето: английский, soft skills, инженерия, бизнес-идеи.', crumbs: [{n:'Главная',u:'/'},{n:'Обучение',u:'/education.html'}] },
    'gallery.html':     { id: 'gallery',  path: 'gallery.html',        title: 'Фотогалерея · A CAMP', desc: 'Фотогалерея лагеря A CAMP — лучшие моменты прошлых смен и отзывы родителей.', crumbs: [{n:'Главная',u:'/'},{n:'Фото',u:'/gallery.html'}] },
    'videos.html':      { id: 'videos',   path: 'videos.html',         title: 'Видео из лагеря · A CAMP', desc: 'Как проходят дни в лагере A CAMP, отзывы родителей, моменты с детьми.', crumbs: [{n:'Главная',u:'/'},{n:'Видео',u:'/videos.html'}] },
    'contacts.html':    { id: 'contacts', path: 'contacts.html',       title: 'Контакты · A CAMP', desc: 'A CAMP в Астане — адрес Толе би 40, телефон +7 700 434 9775, WhatsApp, карта. Свяжитесь любым удобным способом.', crumbs: [{n:'Главная',u:'/'},{n:'Контакты',u:'/contacts.html'}] }
  };

  var file = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
  if (!PAGES[file]) file = 'index.html';
  var page = PAGES[file];
  var pageUrl = SITE_ORIGIN + '/' + page.path;
  var pageUrlNoSlash = page.path ? pageUrl : SITE_ORIGIN + '/';

  function meta(attr, key, val) {
    var m = document.createElement('meta');
    m.setAttribute(attr, key);
    m.setAttribute('content', val);
    document.head.appendChild(m);
  }
  function link(rel, href, extra) {
    var l = document.createElement('link');
    l.setAttribute('rel', rel);
    l.setAttribute('href', href);
    if (extra) for (var k in extra) l.setAttribute(k, extra[k]);
    document.head.appendChild(l);
  }
  function jsonLd(obj) {
    var s = document.createElement('script');
    s.type = 'application/ld+json';
    s.textContent = JSON.stringify(obj);
    document.head.appendChild(s);
  }

  /* ── canonical, hreflang, robots ── */
  link('canonical', pageUrlNoSlash);
  link('alternate', pageUrlNoSlash, { hreflang: 'ru' });
  link('alternate', pageUrlNoSlash, { hreflang: 'kk' });
  link('alternate', pageUrlNoSlash, { hreflang: 'x-default' });
  meta('name', 'robots', 'index, follow, max-image-preview:large, max-snippet:-1');
  meta('name', 'yandex-verification', '');
  meta('name', 'google-site-verification', '');
  meta('name', 'theme-color', '#6B3FA0');
  meta('name', 'application-name', 'A CAMP');
  meta('name', 'apple-mobile-web-app-title', 'A CAMP');
  meta('name', 'apple-mobile-web-app-capable', 'yes');
  meta('name', 'apple-mobile-web-app-status-bar-style', 'default');
  meta('name', 'msapplication-TileColor', '#6B3FA0');
  meta('name', 'format-detection', 'telephone=yes');

  /* ── Open Graph / Twitter ── */
  meta('property', 'og:type',                  file === 'index.html' ? 'website' : 'article');
  meta('property', 'og:site_name',             'A CAMP');
  meta('property', 'og:locale',                'ru_RU');
  meta('property', 'og:locale:alternate',      'kk_KZ');
  meta('property', 'og:title',                 page.title);
  meta('property', 'og:description',           page.desc);
  meta('property', 'og:url',                   pageUrlNoSlash);
  meta('property', 'og:image',                 DEFAULT_IMG);
  meta('property', 'og:image:secure_url',      DEFAULT_IMG);
  meta('property', 'og:image:width',           '1200');
  meta('property', 'og:image:height',          '630');
  meta('property', 'og:image:alt',             'A CAMP — Astanapolis 2026');
  meta('name',     'twitter:card',             'summary_large_image');
  meta('name',     'twitter:title',            page.title);
  meta('name',     'twitter:description',      page.desc);
  meta('name',     'twitter:image',            DEFAULT_IMG);

  /* ── Manifest / icons ── */
  link('manifest', '/manifest.webmanifest');
  link('apple-touch-icon', '/assets/img/logo.png');

  /* ── Preconnects (analytics + fonts) ── */
  link('preconnect', 'https://mc.yandex.ru', { crossorigin: '' });
  link('dns-prefetch', '//mc.yandex.ru');
  link('preconnect', 'https://fonts.cdnfonts.com', { crossorigin: '' });

  /* ── JSON-LD: Organization (every page) ── */
  jsonLd({
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': SITE_ORIGIN + '/#organization',
    name: 'A CAMP',
    legalName: 'A CAMP — Astanapolis Summer Camp',
    url: SITE_ORIGIN + '/',
    logo: { '@type': 'ImageObject', url: LOGO, width: 512, height: 512 },
    image: DEFAULT_IMG,
    email: EMAIL,
    telephone: PHONE,
    sameAs: [
      'https://www.instagram.com/aschool_kz',
      'https://www.tiktok.com/@aschool_kz'
    ],
    address: {
      '@type': 'PostalAddress',
      streetAddress: ADDRESS_STREET,
      addressLocality: ADDRESS_CITY,
      addressCountry: ADDRESS_COUNTRY
    },
    contactPoint: [{
      '@type': 'ContactPoint',
      telephone: PHONE,
      contactType: 'customer service',
      areaServed: 'KZ',
      availableLanguage: ['ru', 'kk']
    }]
  });

  /* ── JSON-LD: WebSite + SearchAction ── */
  jsonLd({
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': SITE_ORIGIN + '/#website',
    url: SITE_ORIGIN + '/',
    name: 'A CAMP',
    publisher: { '@id': SITE_ORIGIN + '/#organization' },
    inLanguage: ['ru-RU', 'kk-KZ']
  });

  /* ── JSON-LD: WebPage for this page ── */
  jsonLd({
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': pageUrlNoSlash + '#webpage',
    url: pageUrlNoSlash,
    name: page.title,
    description: page.desc,
    isPartOf: { '@id': SITE_ORIGIN + '/#website' },
    primaryImageOfPage: { '@type': 'ImageObject', url: DEFAULT_IMG },
    inLanguage: 'ru-RU'
  });

  /* ── JSON-LD: Breadcrumbs ── */
  jsonLd({
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: page.crumbs.map(function (c, i) {
      return { '@type': 'ListItem', position: i + 1, name: c.n, item: SITE_ORIGIN + c.u };
    })
  });

  /* ── Index page extras: LocalBusiness / Camp / FAQ ── */
  if (file === 'index.html') {
    jsonLd({
      '@context': 'https://schema.org',
      '@type': ['LocalBusiness', 'Camp', 'ChildCare'],
      '@id': SITE_ORIGIN + '/#camp',
      name: 'A CAMP — Astanapolis',
      description: 'Авторский летний городской лагерь полного дня для детей 6–11 лет в Астане. Программа Astanapolis: 20 стран за 1 месяц, английский клуб, шахматный клуб, арт-студия, бизнес-идеи, мировая экология. Всё включено.',
      url: SITE_ORIGIN + '/',
      image: [DEFAULT_IMG],
      logo: LOGO,
      telephone: PHONE,
      email: EMAIL,
      priceRange: '₸₸',
      currenciesAccepted: 'KZT',
      paymentAccepted: 'Cash, Card, Kaspi, Halyk',
      address: {
        '@type': 'PostalAddress',
        streetAddress: ADDRESS_STREET,
        addressLocality: ADDRESS_CITY,
        addressCountry: ADDRESS_COUNTRY
      },
      areaServed: { '@type': 'City', name: 'Астана' },
      openingHoursSpecification: [{
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday','Tuesday','Wednesday','Thursday','Friday'],
        opens: '09:00',
        closes: '18:00'
      }],
      sameAs: [
        'https://www.instagram.com/aschool_kz',
        'https://www.tiktok.com/@aschool_kz'
      ],
      audience: { '@type': 'PeopleAudience', suggestedMinAge: 6, suggestedMaxAge: 11 },
      makesOffer: [
        { '@type': 'Offer', name: 'Неделя', price: '59500', priceCurrency: 'KZT' },
        { '@type': 'Offer', name: '2 недели', price: '109000', priceCurrency: 'KZT' },
        { '@type': 'Offer', name: 'Полная смена', price: '199000', priceCurrency: 'KZT' },
        { '@type': 'Offer', name: 'Пробный день', price: '9900', priceCurrency: 'KZT' }
      ]
    });

    jsonLd({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: [
        { '@type': 'Question', name: 'Какой возраст детей в лагере A CAMP?',
          acceptedAnswer: { '@type': 'Answer', text: 'У нас 2 отряда: младший 6–8 лет и старший 9–11 лет.' } },
        { '@type': 'Question', name: 'Какой режим работы лагеря?',
          acceptedAnswer: { '@type': 'Answer', text: 'Пн–Пт с 9:00 до 18:00. В субботу не работаем.' } },
        { '@type': 'Question', name: 'Что входит в стоимость по системе «всё включено»?',
          acceptedAnswer: { '@type': 'Answer', text: 'Вся программа лагеря по расписанию, выезды отрядов, трансфер, входные билеты, сопровождение, все мастер-классы и материалы, приглашённые эксперты, питание, подарки.' } },
        { '@type': 'Question', name: 'Что такое Astanapolis?',
          acceptedAnswer: { '@type': 'Answer', text: 'ASTANAPOLIS — авторская сюжетно-ролевая игра, симуляция мегаполиса будущего. Лагерь — Мегаполис, отряды — Кварталы, вожатые — Кураторы, дети — Резиденты. В городе есть собственная цифровая валюта «A+ money».' } },
        { '@type': 'Question', name: 'Где находится лагерь?',
          acceptedAnswer: { '@type': 'Answer', text: 'Астана, Толе би 40. Есть парковка, удобный заезд. Карта на странице «Контакты».' } }
      ]
    });
  }

  /* ── Prices page extras: PriceSpecification list ── */
  if (file === 'prices.html') {
    jsonLd({
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: 'Летний лагерь A CAMP — пакеты участия',
      brand: { '@type': 'Brand', name: 'A CAMP' },
      offers: [
        { '@type': 'Offer', name: 'Неделя',         price: '59500',  priceCurrency: 'KZT', availability: 'https://schema.org/InStock' },
        { '@type': 'Offer', name: '2 недели',       price: '109000', priceCurrency: 'KZT', availability: 'https://schema.org/InStock' },
        { '@type': 'Offer', name: 'Полная смена',   price: '199000', priceCurrency: 'KZT', availability: 'https://schema.org/InStock' },
        { '@type': 'Offer', name: 'Пробный день',   price: '9900',   priceCurrency: 'KZT', availability: 'https://schema.org/InStock' }
      ]
    });
  }

  if (file === 'contacts.html') {
    jsonLd({
      '@context': 'https://schema.org',
      '@type': 'ContactPage',
      url: pageUrlNoSlash,
      mainEntity: { '@id': SITE_ORIGIN + '/#organization' }
    });
  }
})();
