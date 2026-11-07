"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Reveal } from "@/components/Reveal";

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollY } = useScroll();
  const orbY = useTransform(scrollY, [0, 700], [0, reduce ? 0 : 220]);
  const heroY = useTransform(scrollY, [0, 700], [0, reduce ? 0 : -90]);
  const heroOpacity = useTransform(scrollY, [0, 620], [1, reduce ? 1 : 0.15]);
  const gridY = useTransform(scrollY, [0, 700], [0, reduce ? 0 : 80]);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (reduce) return;
    const onMove = (e: PointerEvent) => {
      setTilt({
        x: (e.clientX / window.innerWidth - 0.5) * 36,
        y: (e.clientY / window.innerHeight - 0.5) * 24,
      });
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [reduce]);

  return (
    <section id="top" ref={ref} className="relative overflow-hidden px-5 pb-16 pt-24 sm:px-6 sm:pb-28 sm:pt-32">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <motion.div aria-hidden className="absolute inset-0" style={mounted ? { y: gridY } : undefined}>
          <div
            className="pf-grid absolute inset-x-0 -top-20 h-[120%] opacity-80"
            style={{
              maskImage: "radial-gradient(ellipse 70% 60% at 50% 40%, #000 30%, transparent 75%)",
              WebkitMaskImage:
                "radial-gradient(ellipse 70% 60% at 50% 40%, #000 30%, transparent 75%)",
            }}
          />
        </motion.div>
        <div className="pf-scan absolute inset-x-0 top-0 h-[120px] bg-gradient-to-b from-transparent via-blue/20 to-transparent" />
        <motion.div
          aria-hidden
          className="absolute right-0 top-6 size-[220px] sm:right-[-40px] sm:top-10 sm:size-[420px] md:size-[640px]"
          style={mounted ? { y: orbY, x: tilt.x, rotateX: tilt.y * 0.15 } : undefined}
        >
          <div className="pf-orb absolute inset-[120px] rounded-full bg-[radial-gradient(circle_at_40%_35%,#2B4FE0_0%,#0B1B4D_45%,transparent_70%)] blur-[10px]" />
          <div className="pf-ring absolute inset-10 rounded-full border border-dashed border-ice/35" />
          <div className="pf-ring2 absolute inset-0 rounded-full border border-white/10 border-t-ice/80" />
        </motion.div>
      </div>

      <motion.div
        className="relative mx-auto max-w-7xl"
        style={mounted ? { y: heroY, opacity: heroOpacity } : undefined}
      >
        <Reveal instant>
          <p className="mb-7 inline-flex items-center gap-2.5 rounded-full border border-ice/35 bg-[#0B1B4D]/50 px-4 py-2 font-mono text-[13px] text-[#C9D6FF]">
            <span className="size-2 rounded-full bg-emerald-400" />
            Открыты к новым проектам
          </p>
        </Reveal>
        <Reveal instant delay={0.12}>
          <h1 className="max-w-[1000px] font-display text-[clamp(34px,11vw,92px)] font-extrabold leading-[1.02] tracking-[-0.02em]">
            Сайты и приложения,
            <br />
            которые <span className="text-ice">продают</span>
            <br />
            за вас
          </h1>
        </Reveal>
        <Reveal instant delay={0.22}>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-mist sm:mt-8 sm:text-xl">
            Разрабатываем с нуля — без конструкторов и шаблонов. Уникальный дизайн, быстрая работа
            на любом устройстве и поддержка после запуска.
          </p>
        </Reveal>
        <Reveal instant delay={0.32} className="mt-8 flex flex-col gap-3 sm:mt-11 sm:flex-row sm:flex-wrap sm:gap-4">
          <a
            href="#work"
            className="inline-flex min-h-14 items-center justify-center gap-2 rounded-full bg-white px-8 text-base font-bold text-ink transition hover:-translate-y-0.5 hover:shadow-[0_14px_40px_-12px_rgba(61,107,255,.7)]"
          >
            Смотреть работы
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M7 17L17 7M9 7h8v8" />
            </svg>
          </a>
          <a
            href="#contact"
            className="inline-flex min-h-14 items-center justify-center rounded-full bg-blue px-8 text-base font-bold text-white transition hover:-translate-y-0.5"
          >
            Бесплатная консультация
          </a>
        </Reveal>
      </motion.div>
    </section>
  );
}
