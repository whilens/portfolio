"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Reveal } from "@/components/Reveal";

const steps = [
  {
    n: "01",
    title: "Бесплатная консультация",
    text: "Объясняем простыми словами: что сделать, сколько стоит, сколько займёт и почему именно так.",
  },
  {
    n: "02",
    title: "Уникальный дизайн",
    text: "Рисуем под ваш бренд и ваших клиентов — никаких шаблонов. Правки до полного согласия.",
  },
  {
    n: "03",
    title: "Разработка",
    text: "Пишем код с нуля, поэтому сайт работает быстрее конструкторов. Показываем прогресс по ходу.",
  },
  {
    n: "04",
    title: "Запуск и поддержка",
    text: "Публикуем проект и поддерживаем его в оговорённый срок: исправления, обновления, советы.",
  },
];

export function Process() {
  const ref = useRef<HTMLElement>(null);
  const [mounted, setMounted] = useState(false);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const lineX = useTransform(scrollYProgress, [0, 1], ["0%", reduce ? "0%" : "70%"]);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <section id="process" ref={ref} className="relative overflow-hidden px-5 py-20 sm:px-6 sm:py-28">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <motion.div
          aria-hidden
          className="absolute left-0 top-1/3 h-px w-full bg-gradient-to-r from-transparent via-ice to-transparent opacity-50"
          style={mounted ? { x: lineX } : undefined}
        />
      </div>
      <div className="relative mx-auto max-w-7xl">
        <Reveal>
          <p className="mb-4 font-mono text-[13px] tracking-[0.12em] text-ice">03 / КАК МЫ РАБОТАЕМ</p>
          <h2 className="max-w-3xl font-display text-[clamp(34px,4.4vw,60px)] font-extrabold leading-[1.05]">
            От идеи до запуска — всегда на связи
          </h2>
        </Reveal>
        <div className="mt-16 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {steps.map((step, i) => (
            <Reveal key={step.n} delay={i * 0.08}>
              <article className="group flex min-h-[260px] flex-col rounded-3xl border border-white/10 bg-ink-2 p-8 transition hover:border-ice/45 hover:bg-[#0B1736]">
                <div
                  className="font-display text-5xl font-extrabold text-[#1F3A99] transition duration-500 group-hover:-translate-y-1 group-hover:text-ice"
                  style={{ transform: reduce ? undefined : `translateY(${i % 2 === 0 ? "-6px" : "8px"})` }}
                >
                  {step.n}
                </div>
                <h3 className="mt-auto font-display text-xl font-semibold">{step.title}</h3>
                <p className="mt-3 text-[15px] leading-relaxed text-mist">{step.text}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
