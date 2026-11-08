---
name: studio-portfolio
description: Conventions for the Next.js studio one-pager in studio-portfolio. Use when editing the portfolio site, hall/desk layout, appearance animations, or studio copy.
---

# Studio portfolio

Одностраничник в `studio-portfolio`. Стек: Next.js App Router, React, TypeScript, Tailwind, GSAP, Framer Motion. Отвечать пользователю по-русски.

## Концепция: зал + стол

Две среды.

**Зал** (`Hall`, `#work`, `#top`) — тёмная сцена и изогнутая WebGL-лента постеров (`CurvedShowreel`): кадры согнуты вогнутым цилиндром, как экран кинозала. Kinetic «продают». Клик открывает оверлей. Видео только в оверлее. Не копировать бренд/тексты Norro.

**Стол** (`Desk`, `#desk`, `data-light-section`) — светлая плоскость `#f3f1ec`: манифест, цифры, услуги, процесс, команда, форма. 3D заканчивается, начинается сделка.

Порядок: Header → Hall → Desk (Services → Process → Team → Contact → Footer).

Не возвращать marquee, hero-орб, fluid overlay, pin услуг поверх зала, второй каталог работ, коридор/карусель экранов.

## Зал

Десктоп (`lg+`, не reduced-motion): curved showreel на постерах работ, без pin. Колесо / drag / стрелки листают ленту. На первой и последней работе скролл отдаётся странице (стол). Клик в центре — оверлей. Видео только в оверлее. Не вставлять demo-лица, sheet Norro и чужие тексты.

Мобилка / reduced-motion: 3D выкл. Заголовок в потоке, вертикальная лента постеров без видео.

## Стол

Цифры «от 5 дней / от 10 000 ₽ / 0 ₽» только здесь. Шапка инвертируется, когда верх стола входит в кадр (`Header` IntersectionObserver, не `intersectionRatio >= 0.4` — стол длинный).

## Появление

`Reveal`: fade + `translateY(20px)`, порог ~0.35, один раз. Hero/зал — kinetic CSS, не WOW.js. `prefers-reduced-motion` выключает смещение и pin зала.

## Визуал

Зал: `#04060B` / `#2B4FE0` / `#7C9BFF`. Стол: бумага `#f3f1ec`, текст `#0c0d12`. Шрифты Unbounded / Manrope / JetBrains Mono. Плейсхолдеры не выдумывать.

Форма — только UI-успех, без бэкенда.

## Гидратация

Одинаковая разметка зала на сервере и клиенте: десктоп-риг `hidden lg:block`, лента `lg:hidden` — оба в DOM. `--cam` и pin только после mount. Не сравнивать `useReducedMotion()` на первом кадре.
