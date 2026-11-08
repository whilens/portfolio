"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";

const links = [
  { href: "#work", label: "Зал", index: "01" },
  { href: "#desk", label: "Стол", index: "02" },
  { href: "#process", label: "Процесс", index: "03" },
  { href: "#team", label: "Команда", index: "04" },
  { href: "#contact", label: "Контакты", index: "05" },
];

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [onLight, setOnLight] = useState(false);
  const [mounted, setMounted] = useState(false);
  const reducePref = useReducedMotion();
  const reduce = mounted && Boolean(reducePref);
  const lightChrome = onLight && !open;

  useEffect(() => {
    setMounted(true);
  }, []);

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
      ([entry]) => {
        if (!entry) return;
        setOnLight(entry.isIntersecting && entry.boundingClientRect.top < window.innerHeight * 0.55);
      },
      { threshold: [0, 0.05, 0.1, 0.2, 0.35] },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("menu-open", open);
    return () => document.documentElement.classList.remove("menu-open");
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        open
          ? "bg-transparent text-white"
          : lightChrome
            ? "bg-[#f3f1ec] text-ink"
            : scrolled
              ? "bg-ink/70 text-white backdrop-blur-[50px]"
              : "bg-transparent text-white"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-5 py-4 sm:px-6 sm:py-6">
        <a
          href="#top"
          className={`relative z-[60] flex min-w-0 items-center gap-3 no-underline ${
            lightChrome ? "text-ink" : "text-white"
          }`}
          onClick={() => setOpen(false)}
        >
          <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-blue font-display text-base font-extrabold text-white">
            VA
          </span>
          <span className="truncate font-display text-[13px] font-semibold tracking-wide sm:text-base">
            [Название студии]
          </span>
        </a>
        <nav
          className={`hidden items-center gap-7 text-[15px] font-medium lg:flex ${
            lightChrome ? "text-[#3A4458]" : "text-[#C9D2E6]"
          }`}
        >
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={`transition-colors ${lightChrome ? "hover:text-ink" : "hover:text-white"}`}
            >
              {link.label}
            </a>
          ))}
        </nav>
        <a
          href="#contact"
          className={`relative z-[60] hidden min-h-11 items-center rounded-full border px-5 text-[15px] font-semibold transition hover:-translate-y-0.5 lg:inline-flex ${
            lightChrome
              ? "border-ink/25 text-ink hover:bg-ink hover:text-white"
              : "border-white/35 text-white hover:bg-white hover:text-ink"
          }`}
        >
          Обсудить проект
        </a>
        <button
          type="button"
          className={`relative z-[60] grid size-11 place-items-center rounded-full border lg:hidden ${
            lightChrome ? "border-ink/25" : "border-white/25"
          }`}
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-label={open ? "Закрыть меню" : "Открыть меню"}
        >
          <span className="relative block h-3.5 w-[18px]">
            <span
              className={`absolute left-0 h-px w-full origin-center transition duration-300 ${
                lightChrome ? "bg-ink" : "bg-white"
              } ${open ? "top-[6px] rotate-45" : "top-0"}`}
            />
            <span
              className={`absolute left-0 top-[6px] h-px w-full transition duration-200 ${
                lightChrome ? "bg-ink" : "bg-white"
              } ${open ? "scale-x-0 opacity-0" : "scale-x-100 opacity-100"}`}
            />
            <span
              className={`absolute left-0 h-px w-full origin-center transition duration-300 ${
                lightChrome ? "bg-ink" : "bg-white"
              } ${open ? "top-[6px] -rotate-45" : "top-[12px]"}`}
            />
          </span>
        </button>
      </div>

      <AnimatePresence>
        {open ? (
          <motion.div
            className="fixed inset-0 z-[55] flex flex-col overflow-hidden bg-ink px-5 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-24 text-white lg:hidden"
            initial={reduce ? { opacity: 1 } : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={reduce ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: reduce ? 0 : 0.35 }}
          >
            <div
              aria-hidden
              className="pointer-events-none absolute right-0 top-24 size-[220px] rounded-full bg-[radial-gradient(circle,#2B4FE0_0%,transparent_70%)] opacity-70"
            />
            <motion.p
              aria-hidden
              className="pointer-events-none absolute -left-2 bottom-8 max-w-full overflow-hidden font-display text-[18vw] font-extrabold leading-none text-white/5"
              initial={reduce ? false : { y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: reduce ? 0 : 0.6, delay: 0.12 }}
            >
              MENU
            </motion.p>
            <nav className="relative flex min-h-0 flex-1 flex-col justify-center gap-0 overflow-auto">
              {links.map((link, i) => (
                <motion.a
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="group flex items-baseline gap-4 border-b border-white/10 py-2.5"
                  initial={reduce ? false : { y: 28, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: reduce ? 0 : 0.45, delay: 0.08 + i * 0.06, ease: [0.2, 0.7, 0.2, 1] }}
                >
                  <span className="font-mono text-[11px] tracking-[0.16em] text-ice">{link.index}</span>
                  <span className="font-display text-[clamp(28px,8.4vw,52px)] font-semibold tracking-[-0.03em] transition group-active:text-ice">
                    {link.label}
                  </span>
                </motion.a>
              ))}
            </nav>
            <motion.a
              href="#contact"
              onClick={() => setOpen(false)}
              className="relative mt-8 inline-flex min-h-14 items-center justify-center rounded-full bg-white text-base font-bold text-ink"
              initial={reduce ? false : { y: 16, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: reduce ? 0 : 0.4, delay: 0.38 }}
            >
              Обсудить проект
            </motion.a>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
