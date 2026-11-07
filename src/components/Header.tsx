"use client";

import { useEffect, useState } from "react";

const links = [
  { href: "#work", label: "Работы" },
  { href: "#services", label: "Услуги" },
  { href: "#process", label: "Процесс" },
  { href: "#team", label: "Команда" },
  { href: "#contact", label: "Контакты" },
];

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [onLight, setOnLight] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const el = document.querySelector("[data-light-section]");
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => setOnLight(entry.isIntersecting && entry.intersectionRatio >= 0.4),
      { threshold: [0.2, 0.4, 0.6, 0.8] },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 transition-colors duration-300 ${
        onLight
          ? "bg-white text-ink"
          : scrolled
            ? "bg-ink/70 text-white backdrop-blur-[50px]"
            : "bg-transparent text-white"
      }`}
    >
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-6 py-6">
        <a href="#top" className={`flex items-center gap-3 no-underline ${onLight ? "text-ink" : "text-white"}`}>
          <span className="grid size-10 place-items-center rounded-xl bg-blue font-display text-base font-extrabold text-white">
            VA
          </span>
          <span className="font-display text-base font-semibold tracking-wide">
            [Название студии]
          </span>
        </a>
        <nav
          className={`hidden items-center gap-7 text-[15px] font-medium lg:flex ${
            onLight ? "text-[#3A4458]" : "text-[#C9D2E6]"
          }`}
        >
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={`transition-colors ${onLight ? "hover:text-ink" : "hover:text-white"}`}
            >
              {link.label}
            </a>
          ))}
        </nav>
        <a
          href="#contact"
          className={`hidden min-h-11 items-center rounded-full border px-5 text-[15px] font-semibold transition hover:-translate-y-0.5 lg:inline-flex ${
            onLight
              ? "border-ink/25 text-ink hover:bg-ink hover:text-white"
              : "border-white/35 text-white hover:bg-white hover:text-ink"
          }`}
        >
          Обсудить проект
        </a>
        <button
          type="button"
          className={`inline-flex min-h-11 items-center rounded-full border px-4 text-sm lg:hidden ${
            onLight ? "border-ink/25 text-ink" : "border-white/25"
          }`}
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
        >
          Меню
        </button>
      </div>
      {open ? (
        <div className="border-t border-white/10 bg-ink/90 px-6 py-4 backdrop-blur-xl lg:hidden">
          <div className="flex flex-col gap-3 text-[15px]">
            {links.map((link) => (
              <a key={link.href} href={link.href} onClick={() => setOpen(false)}>
                {link.label}
              </a>
            ))}
          </div>
        </div>
      ) : null}
    </header>
  );
}
