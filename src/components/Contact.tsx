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
    <section id="contact" className="px-5 py-16 sm:px-6 sm:py-24">
      <div className="mx-auto flex max-w-7xl flex-col gap-12 lg:flex-row lg:gap-16">
        <Reveal className="w-full min-w-0 lg:flex-1">
          <p className="mb-4 font-mono text-[13px] tracking-[0.12em] text-blue">05 / КОНТАКТЫ</p>
          <h2 className="font-display text-[clamp(32px,5vw,64px)] font-extrabold leading-[1.02]">
            Расскажите
            <br />
            о задаче
          </h2>
          <p className="mt-7 max-w-md text-lg leading-relaxed text-[#5c6474]">
            Ответим в течение дня и бесплатно проконсультируем — даже если вы пока не знаете, что
            вам нужно.
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            {["Telegram", "ВКонтакте", "[Телефон]"].map((label) => (
              <a
                key={label}
                href="#contact"
                className="inline-flex min-h-12 items-center rounded-full border border-ink/20 px-6 font-semibold transition hover:bg-ink hover:text-white"
              >
                {label}
              </a>
            ))}
          </div>
        </Reveal>
        <Reveal delay={0.12} className="w-full min-w-0 lg:flex-1">
          <form
            onSubmit={onSubmit}
            className="flex flex-col gap-5 rounded-[28px] border border-[#d8d3ca] bg-white p-6 sm:p-9"
          >
            {sent ? (
              <div className="py-10 text-center" role="status">
                <div className="font-display text-[26px] font-semibold">Заявка отправлена</div>
                <p className="mt-3 text-[#5c6474]">Скоро свяжемся с вами.</p>
              </div>
            ) : (
              <>
                <label className="flex flex-col gap-2 text-sm text-[#5c6474]">
                  Как вас зовут
                  <input
                    required
                    name="name"
                    placeholder="Имя"
                    className="min-h-[52px] rounded-[14px] border border-[#d8d3ca] bg-[#f3f1ec] px-4 text-base text-ink outline-none placeholder:text-ink/30 focus:border-blue"
                  />
                </label>
                <label className="flex flex-col gap-2 text-sm text-[#5c6474]">
                  Телефон или Telegram
                  <input
                    required
                    name="contact"
                    placeholder="+7 … или @username"
                    className="min-h-[52px] rounded-[14px] border border-[#d8d3ca] bg-[#f3f1ec] px-4 text-base text-ink outline-none placeholder:text-ink/30 focus:border-blue"
                  />
                </label>
                <label className="flex flex-col gap-2 text-sm text-[#5c6474]">
                  Что нужно сделать
                  <textarea
                    name="message"
                    rows={4}
                    placeholder="Например: сайт с онлайн-записью для салона"
                    className="rounded-[14px] border border-[#d8d3ca] bg-[#f3f1ec] px-4 py-3 text-base text-ink outline-none placeholder:text-ink/30 focus:border-blue"
                  />
                </label>
                <button
                  type="submit"
                  className="min-h-14 rounded-full bg-ink text-base font-bold text-white transition hover:-translate-y-0.5"
                >
                  Отправить заявку
                </button>
                <p className="text-center text-[13px] text-[#8a8478]">
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
