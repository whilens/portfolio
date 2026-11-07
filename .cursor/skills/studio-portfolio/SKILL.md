---
name: studio-portfolio
description: Conventions for the Next.js studio one-pager in studio-portfolio. Use when editing the portfolio site, cases slider, WebGL overlay, appearance animations, or studio copy/layout.
---

# Studio portfolio

Одностраничник в `studio-portfolio`. Стек: Next.js App Router, React, TypeScript, Tailwind, GSAP, Framer Motion, Embla. Отвечать пользователю по-русски.

## Страница

Порядок: Header → Hero → Marquee → **один** слайдер работ (`Cases`, `#work`) → Services (pin) → Process → Team → Contact → Footer.

Не возвращать второй слайдер «Избранные проекты». Не разворачивать кейсы в восемь full-page секций.

Цифры «от 5 дней / от 10 000 ₽ / 0 ₽» живут в первом экране услуг, не в hero.

## Переход услуг (ARROW)

`Services` — две панели 100vh. GSAP pin только у тёмных цифр (`pinSpacing: false`): они остаются в кадре, белый слой с карточками наезжает сверху. Белую панель не пинить — иначе процесс/команда уедут под неё. Pin выкл только на `prefers-reduced-motion`. Белая панель — `data-light-section`, шапка следит IntersectionObserver и инвертируется.

Мобилка: полноэкранное бургер-меню (stagger ссылок, бургер→крест), стрелки слайдера, орб в hero, pin услуг и облегчённый fluid. Слабый GPU / reduced-motion по-прежнему глушат симуляцию.

## Слайдер работ

В кадре: видео, клиент, название, стрелки, точки. Без PIP-кадров, чипов всех проектов, длинного summary и дублирующих CTA. Автопрокрутка паузится, пока курсор над слайдом.

Видео: играет только активный слайд в viewport (`BackgroundVideo` + IntersectionObserver). `preload="none"`. На `prefers-reduced-motion` не автоплееить.

Ролики: Avantage/Braas/Progresco — готовые файлы; остальные — `public/videos/{slug}.webm`.

## Появление (референсы)

Не тащить WOW.js / animate.css. Повторять характер:

- WOT / Avantage: `opacity 0` + `translateY(20px)`, порог ~0.35, один раз
- VR: вход снизу у текста, слева у крупных кадров (`Reveal from="left"`)
- KC-STUDIO: stagger карточек `delay={i * 0.08}`
- Южный парк: pin + zoom только если явно просят scroll-story

Компонент: `src/components/Reveal.tsx`. Hero — `instant` + stagger delay. `prefers-reduced-motion` выключает смещение.

## Фон

- WebGL fluid: только случайные автооблака, **без splat по мыши**
- На узком экране ниже разрешение (96/256), выкл на weak GPU / reduced-motion
- Светящиеся линии и орбы — `AmbientField`, параллакс скролла и лёгкий сдвиг от курсора; монтировать после hydration
- DPR cap 1

## Визуал

`#04060B` / акцент `#2B4FE0` / `#7C9BFF`. Шрифты Unbounded / Manrope / JetBrains Mono. Плейсхолдеры (`[Название студии]`, коллега, часть цен) не выдумывать.

Форма — только UI-успех, без бэкенда.

Атрибуция MIT fluid: Pavel Dobryakov в футере.

## Гидратация

Динамические `style` / Embla / mouse parallax — только после `mounted`. Не сравнивать `useReducedMotion()` на первом кадре сервера и клиента. Фоновые слои (`AmbientField`, fluid canvas) всегда рендерить одну и ту же разметку — не возвращать `null` до mount, иначе React склеит соседний canvas с клиентским div.
