# A CAMP — инструкция по развёртыванию

Статический сайт. Никаких сборок, миграций, рантайма — только отдача файлов веб-сервером по HTTPS.

---

## 1. Перед заливкой на сервер: что нужно отредактировать

| Файл | Что заменить |
|------|--------------|
| `assets/js/analytics.js` | `var YM_COUNTER_ID = 0;` → ваш номер счётчика Яндекс.Метрики (например `12345678`) |
| `assets/js/seo.js` | `SITE_ORIGIN = 'https://acamp.kz'` → ваш реальный домен |
| `assets/js/seo.js` | `yandex-verification` и `google-site-verification` — вписать коды подтверждения из Яндекс.Вебмастер и Google Search Console |
| `sitemap.xml` | заменить `https://acamp.kz` на ваш домен, обновить `<lastmod>` при больших правках |
| `robots.txt` | в строке `Host:` и `Sitemap:` поставить ваш домен |
| `manifest.webmanifest` | при смене домена — поправить `start_url`/`scope`, если поменяете структуру |
| `.htaccess` / `nginx.conf.example` | блок `RewriteCond %{HTTP_HOST} ^www\.` оставляет non-www. Если нужен www — инвертируйте |

Все плейсхолдеры искать по подстроке `acamp.kz`.

---

## 2. Деплой на shared-хостинг (cPanel / ISPmanager, Apache + .htaccess)

1. Подключитесь по FTP/SFTP/File Manager.
2. Загрузите всё содержимое корня репозитория в `public_html` (или document root домена).
3. Убедитесь, что `.htaccess` скопирован (скрытые файлы должны быть включены в FTP-клиенте).
4. Включите SSL-сертификат (Let's Encrypt в один клик в cPanel).
5. Откройте `https://домен/` — должна загрузиться главная.
6. Проверьте: `https://домен/robots.txt`, `/sitemap.xml`, `/llms.txt`, `/manifest.webmanifest`.

### Что требуется на сервере
- Apache 2.4+ с модулями: `mod_rewrite`, `mod_headers`, `mod_deflate`, `mod_expires`, `mod_mime`.

---

## 3. Деплой на VPS (Ubuntu/Debian + Nginx)

```bash
# 1. Установка nginx и certbot
sudo apt update
sudo apt install -y nginx certbot python3-certbot-nginx

# 2. Залейте файлы в /var/www/acamp
sudo mkdir -p /var/www/acamp
sudo rsync -av ./ /var/www/acamp/   # или scp / git clone
sudo chown -R www-data:www-data /var/www/acamp

# 3. Скопируйте серверный блок
sudo cp /var/www/acamp/nginx.conf.example /etc/nginx/sites-available/acamp.conf
sudo nano /etc/nginx/sites-available/acamp.conf   # подправьте server_name и пути
sudo ln -s /etc/nginx/sites-available/acamp.conf /etc/nginx/sites-enabled/

# 4. Проверка и перезагрузка
sudo nginx -t
sudo systemctl reload nginx

# 5. SSL (Let's Encrypt)
sudo certbot --nginx -d acamp.kz -d www.acamp.kz
# certbot сам перезагрузит nginx и подставит пути сертификатов

# 6. Готово
curl -I https://acamp.kz
```

---

## 4. Деплой на Cloudflare Pages / Netlify / Vercel / GitHub Pages

Сайт чисто статический — подойдёт любая платформа.

### Cloudflare Pages
1. Подключите Git-репозиторий (или загрузите ZIP в Direct Upload).
2. Build command: пусто. Output directory: `.` (корень).
3. Custom domain → подключите `acamp.kz`, DNS → CNAME на `<project>.pages.dev`.

### Netlify
1. New site → Drag and drop папку с сайтом.
2. Site settings → Domain → добавить `acamp.kz`.
3. Файл `_redirects` не нужен — `404.html` и так подхватится Netlify по умолчанию.

### GitHub Pages
1. Положите файлы в ветку `gh-pages` или `main`.
2. Settings → Pages → выберите ветку и `/ (root)`.
3. Custom domain → `acamp.kz`, добавьте CNAME-запись на `<user>.github.io`.

⚠️ Для платформ-CDN (Cloudflare Pages, Netlify, Vercel) `.htaccess` игнорируется — он только для Apache. Заголовки/редиректы настраиваются панелью платформы.

---

## 5. Подключение Яндекс.Метрики

1. Зайдите на [metrika.yandex.ru](https://metrika.yandex.ru) → создайте счётчик.
2. Укажите домен (`acamp.kz`), включите Вебвизор, карту кликов, точный показатель отказа.
3. Скопируйте **номер счётчика** (8 цифр).
4. Откройте `assets/js/analytics.js` → замените:
   ```js
   var YM_COUNTER_ID = 0;            // ← было
   var YM_COUNTER_ID = 12345678;     // ← ваш номер
   ```
5. Залейте файл на сервер и обновите страницу с очисткой кэша (Ctrl+F5).
6. В Метрике в разделе «Цели» создайте цели по событиям:
   - `wa_click` — клик по WhatsApp
   - `call_click` — клик по «Позвонить»
   - `prices_click` — переход к ценам
   - `address_click` — переход к адресу
   - `book_click` — клик по «Забронировать»
   - `form_submit` — отправка формы на странице Контактов
7. На странице «Настройки → Код счётчика» нажмите «Проверить» — должна появиться зелёная галочка.

---

## 6. Подтверждение в поисковиках

### Яндекс.Вебмастер
1. [webmaster.yandex.ru](https://webmaster.yandex.ru) → Добавить сайт.
2. Способ подтверждения «Мета-тег» — скопируйте значение `content="..."`.
3. В `assets/js/seo.js` замените:
   ```js
   meta('name', 'yandex-verification', '');
   meta('name', 'yandex-verification', 'ВАШ_КОД');
   ```
4. Загрузите файл, нажмите «Проверить».
5. В Вебмастере → «Файлы Sitemap» → добавьте `https://acamp.kz/sitemap.xml`.

### Google Search Console
1. [search.google.com/search-console](https://search.google.com/search-console) → Добавить ресурс.
2. Способ «HTML-тег» — скопируйте `content="..."`.
3. В `assets/js/seo.js` замените `google-site-verification` аналогично.
4. После подтверждения добавьте sitemap.

---

## 7. AI-поиск (ChatGPT, Perplexity, Claude, Google AI)

Файл `llms.txt` уже подготовлен в корне сайта и индексируется ИИ-краулерами (GPTBot, ClaudeBot, PerplexityBot, Google-Extended). Никаких дополнительных действий не нужно — после деплоя и сканирования через 1–3 недели сайт начнёт появляться в ответах ИИ-моделей.

Что внутри `llms.txt`:
- Краткое описание лагеря и часы работы
- Программа Astanapolis, тарифы, ключевые направления
- FAQ
- Ссылки на все страницы

При изменении ключевой информации (цены, адрес, программа) — обновляйте `llms.txt`.

---

## 8. Проверка после деплоя — чек-лист

- [ ] Открывается главная по `https://домен/`
- [ ] HTTP редиректит на HTTPS (`curl -I http://домен`)
- [ ] `https://домен/robots.txt`, `/sitemap.xml`, `/llms.txt`, `/manifest.webmanifest` отдаются 200 OK
- [ ] `https://домен/несуществующая-страница` показывает 404.html
- [ ] WhatsApp, Позвонить, Адрес, Цены кнопки работают
- [ ] Карта на странице Контакты загружается
- [ ] Переключатель RU/KZ переключает все тексты
- [ ] PageSpeed Insights — Performance ≥ 85 (mobile)
- [ ] [search.google.com/test/rich-results](https://search.google.com/test/rich-results) — JSON-LD валиден (Organization, LocalBusiness, FAQ)
- [ ] [validator.schema.org](https://validator.schema.org) на главной — без ошибок
- [ ] [webmaster.yandex.ru](https://webmaster.yandex.ru) → «Проверка ответа сервера» — корректный код, заголовки
- [ ] Яндекс.Метрика показывает посещения в реальном времени

---

## 9. Структура файлов

```
A-CAMP/
├── index.html, schedule.html, prices.html, trips.html,
│   masterclasses.html, education.html, gallery.html,
│   videos.html, contacts.html, 404.html
├── robots.txt, sitemap.xml, llms.txt, manifest.webmanifest
├── .htaccess                  ← Apache конфиг
├── nginx.conf.example         ← Nginx серверный блок (пример)
├── .well-known/
│   └── security.txt
├── assets/
│   ├── css/style.css
│   ├── js/
│   │   ├── seo.js             ← injects OG/JSON-LD/canonical
│   │   ├── analytics.js       ← Яндекс.Метрика + событийные цели
│   │   ├── translations.js
│   │   ├── partials.js
│   │   └── main.js
│   └── img/                   ← логотипы, hero
├── photo-material/            ← фото для галереи
├── video-material/            ← видео для страницы Видео
├── review/                    ← скриншоты отзывов
└── DEPLOY.md (этот файл)
```

`.htaccess` запрещает доступ к `task.txt`, `DEPLOY.md`, `nginx.conf.example`, скрытым файлам — посетитель сайта их не увидит.

---

## 10. Контакты разработчика

Если что-то сломалось — сравните файлы с этим репозиторием и проверьте, что путь `assets/js/seo.js` и `assets/js/analytics.js` отдаётся со статус-кодом 200. Большинство проблем — это либо неправильный document root, либо отключённый mod_rewrite/mod_headers на Apache.
