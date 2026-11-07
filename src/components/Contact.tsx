"use client";

import { FormEvent, useState } from "react";
import { Reveal } from "@/components/Reveal";

export function Contact() {
  const [sent, setSent] = useState(false);

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSent(true);
  }

  return (
    <section id="contact" className="relative overflow-hidden bg-navy px-5 py-20 sm:px-6 sm:py-32">
      <div aria-hidden className="pf-grid pointer-events-none absolute inset-0 opacity-70" />
      <div className="relative mx-auto flex max-w-7xl flex-col gap-12 lg:flex-row lg:gap-16">
        <Reveal className="w-full min-w-0 lg:flex-1">
          <p className="mb-4 font-mono text-[13px] tracking-[0.12em] text-ice">05 / КОНТАКТЫ</p>
          <h2 className="font-display text-[clamp(36px,5vw,72px)] font-extrabold leading-[1.02]">
            Расскажите
            <br />
            о задаче
          </h2>
          <p className="mt-7 max-w-md text-lg leading-relaxed text-[#C9D2E6]">
            Ответим в течение дня и бесплатно проконсультируем — даже если вы пока не знаете, что
            вам нужно.
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            {["Telegram", "ВКонтакте", "[Телефон]"].map((label) => (
              <a
                key={label}
                href="#contact"
                className="inline-flex min-h-12 items-center rounded-full border border-white/35 px-6 font-semibold transition hover:bg-white hover:text-ink"
              >
                {label}
              </a>
            ))}
          </div>
        </Reveal>
        <Reveal delay={0.12} className="w-full min-w-0 lg:flex-1">
          <form
            onSubmit={onSubmit}
            className="flex flex-col gap-5 rounded-[28px] border border-white/12 bg-ink p-6 sm:p-9"
          >
            {sent ? (
              <div className="py-10 text-center" role="status">
                <div className="font-display text-[26px] font-semibold">Заявка отправлена</div>
                <p className="mt-3 text-mist">Скоро свяжемся с вами.</p>
              </div>
            ) : (
              <>
                <label className="flex flex-col gap-2 text-sm text-[#C9D2E6]">
                  Как вас зовут
                  <input
                    required
                    name="name"
                    placeholder="Имя"
                    className="min-h-[52px] rounded-[14px] border border-white/15 bg-ink-2 px-4 text-base text-white outline-none placeholder:text-white/30 focus:border-ice"
                  />
                </label>
                <label className="flex flex-col gap-2 text-sm text-[#C9D2E6]">
                  Телефон или Telegram
                  <input
                    required
                    name="contact"
                    placeholder="+7 … или @username"
                    className="min-h-[52px] rounded-[14px] border border-white/15 bg-ink-2 px-4 text-base text-white outline-none placeholder:text-white/30 focus:border-ice"
                  />
                </label>
                <label className="flex flex-col gap-2 text-sm text-[#C9D2E6]">
                  Что нужно сделать
                  <textarea
                    name="message"
                    rows={4}
                    placeholder="Например: сайт с онлайн-записью для салона"
                    className="rounded-[14px] border border-white/15 bg-ink-2 px-4 py-3 text-base text-white outline-none placeholder:text-white/30 focus:border-ice"
                  />
                </label>
                <button
                  type="submit"
                  className="min-h-14 rounded-full bg-white text-base font-bold text-ink transition hover:-translate-y-0.5"
                >
                  Отправить заявку
                </button>
                <p className="text-center text-[13px] text-[#8D97AB]">
                  Консультация бесплатная и ни к чему не обязывает
                </p>
              </>
            )}
          </form>
        </Reveal>
      </div>
    </section>
  );
}
