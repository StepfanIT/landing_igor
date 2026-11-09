# Лендінги Bobcat + JCB (продаж та оренда спецтехніки)

Монорепо з двома сайтами на **Next.js 16 + React 19 + Tailwind CSS 4 + TypeScript**.
Верстка, секції, форма та SEO спільні (`shared/`). Кожен сайт має свій контент і кольори.

```
shared/            спільні компоненти, стилі, SEO, обробник заявок
  src/components/  секції сторінки (Hero, Catalog, Rental, PartnerPromo, ...)
  src/server/      SEO (metadata, JSON-LD), OG-картинка, API заявок → Telegram
bobcat/            сайт Bobcat (помаранчевий), порт 3001
  src/site.config.ts   ← ВЕСЬ контент сайту
  src/app/globals.css  ← кольори бренду
jcb/               сайт JCB (жовтий), порт 3002
```

## Запуск

```bash
npm install
npm run dev:bobcat   # http://localhost:3001
npm run dev:jcb      # http://localhost:3002
npm run build        # продакшн-білд обох
```

У dev-режимі заявки з форми просто пишуться в консоль сервера.

## Що де міняти

| Що | Де |
|---|---|
| Тексти, моделі, характеристики, ціни, FAQ, контакти | `<site>/src/site.config.ts` |
| Кольори бренду | `<site>/src/app/globals.css` (`--color-brand`, `--color-brand-deep`, `--color-on-brand`) |
| Рекламний банер сайту-партнера | `partner` у `site.config.ts` + `NEXT_PUBLIC_PARTNER_URL` |
| Ціни | поля `priceSale` / `priceRent` у продукті (поки не задані → «Ціна за запитом») |

## Дизайн і фото

Верстка зроблена за макетом Figma (фрейм 1920px): шрифти **Tektur**, **Oswald**, **Montserrat**; фон `#131313`; жовтий JCB `#fbb503`.
Розміри шрифтів «плавні»: на 1920px збігаються з макетом, на менших екранах пропорційно зменшуються (утиліти `text-giant`, `text-banner` … у `shared/src/styles/base.css`).

Фото взяті з макета й конвертовані у WebP (`<site>/public/images/`). Щоб замінити або додати фото, покладіть файл з назвою, вказаною в `site.config.ts` (поле `image`), і перезберіть сайт.
Поки файлу немає, на його місці показується SVG-ілюстрація техніки в кольорах бренду.

- `hero.webp`: фон першого екрану
- `about.webp`: фото в блоці «Про нас»
- `featured-540-140.webp` (JCB) / `featured-tl35-70.webp` (Bobcat): флагманська модель на прозорому фоні
- `banner.webp`: фон банера «250К»
- `products/<model>.webp`: фото моделей для карток (світлий або прозорий фон)
- `attachments/<name>.webp`: навісне обладнання (поки немає — SVG)
- `partner-jcb.webp` / `partner-bobcat.webp`: картинка в рекламному блоці сайту-партнера

**Bobcat:** у макеті немає фото техніки Bobcat, тому зараз у картках і флагманському блоці стоять SVG-ілюстрації, а на першому екрані й банері нейтральні фото без логотипів.
Коли будуть фото Bobcat (s650, s530, t590, e27z, e35z, tl35-70, featured-tl35-70), покладіть їх у `bobcat/public/images/products/` і `bobcat/public/images/`.

Рекомендований формат WebP. Next.js сам стисне фото і віддасть AVIF/WebP потрібного розміру.

## Заявки → Telegram

1. Створіть бота через [@BotFather](https://t.me/BotFather) і скопіюйте токен.
2. Додайте бота в чат або групу менеджерів і дізнайтесь `chat_id` (наприклад, через @getidsbot).
3. Задайте змінні середовища (див. `.env.example` у кожному сайті):

```
TELEGRAM_BOT_TOKEN=...
TELEGRAM_CHAT_ID=...        # можна кілька через кому
NEXT_PUBLIC_SITE_URL=https://ваш-домен
NEXT_PUBLIC_PARTNER_URL=https://домен-другого-сайту
```

Якщо в продакшені Telegram не налаштований, форма покаже помилку з номером телефону, тож заявки не губляться непомітно.
Захист від спаму: приховане поле-пастка (honeypot) і мінімальний час заповнення форми.

## SEO

- Статична генерація: HTML повністю відрендерений на сервері.
- `title`, `description`, canonical, Open Graph / Twitter, `lang="uk"`.
- JSON-LD: `LocalBusiness` (адреса, графік, гео, каталог пропозицій продаж/оренда), `WebSite`, `FAQPage`.
- `sitemap.xml`, `robots.txt`, `manifest.webmanifest`, favicon.
- Автоматична OG-картинка 1200×630 (прев'ю в Telegram, Viber, Facebook).
- Один `h1`, семантичні секції, alt-тексти, `next/font` без стрибків верстки.
- Посилання з банера партнера мають UTM-мітки (`utm_source=bobcat-site&utm_medium=cross-banner`), і ці мітки потрапляють у заявку.

## Деплой на GitHub Pages (статично)

Workflow `.github/workflows/deploy-pages.yml` при кожному пуші в `main` збирає обидва сайти (`STATIC_EXPORT=1`) і публікує:

- `https://<owner>.github.io/<repo>/bobcat/`
- `https://<owner>.github.io/<repo>/jcb/`

На GitHub Pages немає сервера, тож API-роут заявок (`src/app/api/lead/route.server.ts`) у статичну збірку не потрапляє.
Щоб форма надсилала заявки, вкажіть змінну репозиторію `LEAD_ENDPOINT` (Settings → Secrets and variables → Actions → Variables) —
URL сервісу, що приймає POST JSON (наприклад, Cloudflare Worker з пересиланням у Telegram або Formspree).
Без неї форма показує «Онлайн-заявки ще не підключені» і номер телефону.

Локальна перевірка статичної збірки (Git Bash):

```bash
cd jcb && MSYS_NO_PATHCONV=1 STATIC_EXPORT=1 NEXT_PUBLIC_BASE_PATH=/landing-igor/jcb npx next build   # → jcb/out
```

## Деплой (Vercel)

Створіть два проєкти з одного репозиторію:
- Root Directory: `bobcat` (і `jcb` для другого).
- Увімкніть «Include files outside the root directory», бо сайт використовує `../shared`.
- Додайте змінні середовища з `.env.example`.
