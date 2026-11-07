"use client";

import { useEffect, useRef } from "react";
import { registerGsap } from "@/lib/gsap";

const stats = [
  { value: "от 5 дней", label: "запуск сайта-визитки" },
  { value: "от 10 000 ₽", label: "стоимость сайта" },
  { value: "0 ₽", label: "первая консультация" },
];

const items = [
  {
    kicker: "САЙТ",
    title: "Сайт-визитка",
    text: "Услуги, цены, портфолио, онлайн-запись или заявка, кнопки мессенджеров.",
    price: "от 10 000 ₽",
    time: "от 5 дней",
    dark: false,
  },
  {
    kicker: "ПРИЛОЖЕНИЕ",
    title: "Мобильное приложение",
    text: "iOS и Android: запись, заказы, бонусы и push-уведомления для постоянных клиентов.",
    price: "от 30 000 ₽",
    time: "от 15 дней",
    dark: true,
  },
  {
    kicker: "СЛОЖНЫЕ ПРОЕКТЫ",
    title: "Магазины и платформы",
    text: "Интернет-магазины, ИИ-консультанты, личные кабинеты, микросервисы.",
    price: "[цена]",
    time: "по задаче",
    dark: false,
  },
];

export function Services() {
  const statsWrapRef = useRef<HTMLDivElement>(null);
  const statsPinRef = useRef<HTMLDivElement>(null);
  const numbersRef = useRef<HTMLDivElement>(null);
  const cardsWrapRef = useRef<HTMLDivElement>(null);
  const cardsPinRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const statsWrap = statsWrapRef.current;
    const statsPin = statsPinRef.current;
    const cardsWrap = cardsWrapRef.current;
    const cardsPin = cardsPinRef.current;
    const numbers = numbersRef.current;
    if (!statsWrap || !statsPin || !cardsWrap || !cardsPin) return;

    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    let revert = () => {};

    const setup = () => {
      revert();
      if (mq.matches) return;

      const { gsap, ScrollTrigger } = registerGsap();
      const ctx = gsap.context(() => {
        ScrollTrigger.create({
          trigger: statsPin,
          start: "top top",
          endTrigger: cardsWrap,
          end: "top top",
          pin: true,
          pinSpacing: false,
          anticipatePin: 1,
        });

        gsap.fromTo(
          statsPin,
          { scale: 1, opacity: 1 },
          {
            scale: 0.92,
            opacity: 0.45,
            ease: "none",
            scrollTrigger: {
              trigger: cardsWrap,
              start: "top bottom",
              end: "top top",
              scrub: 0.55,
            },
          },
        );

        if (numbers) {
          gsap.fromTo(
            numbers.children,
            { y: 36 },
            {
              y: -48,
              ease: "none",
              stagger: 0.06,
              scrollTrigger: {
                trigger: statsPin,
                start: "top top",
                endTrigger: cardsWrap,
                end: "top top",
                scrub: 0.7,
              },
            },
          );
        }
      }, statsWrap.parentElement ?? statsWrap);

      revert = () => ctx.revert();
    };

    setup();
    mq.addEventListener("change", setup);
    return () => {
      mq.removeEventListener("change", setup);
      revert();
    };
  }, []);

  return (
    <section id="services" className="relative overflow-x-clip">
      <div ref={statsWrapRef} className="relative z-10 h-dvh">
        <div
          ref={statsPinRef}
          className="relative z-10 flex h-dvh w-full max-w-full origin-center items-center overflow-hidden bg-ink px-5 sm:px-6"
        >
          <div className="pointer-events-none absolute inset-0 opacity-70">
            <div
              className="pf-grid absolute inset-0"
              style={{
                maskImage: "radial-gradient(ellipse 70% 55% at 50% 45%, #000 25%, transparent 75%)",
                WebkitMaskImage:
                  "radial-gradient(ellipse 70% 55% at 50% 45%, #000 25%, transparent 75%)",
              }}
            />
          </div>
          <div className="relative mx-auto w-full max-w-7xl">
            <p className="mb-4 font-mono text-[13px] tracking-[0.12em] text-ice">02 / УСЛУГИ И ЦЕНЫ</p>
            <h2 className="max-w-3xl font-display text-[clamp(28px,8vw,60px)] font-extrabold leading-[1.05] tracking-[-0.02em]">
              Понятные цифры до старта работы
            </h2>
            <div ref={numbersRef} className="mt-8 grid gap-5 sm:mt-16 sm:grid-cols-3 sm:gap-8">
              {stats.map((item) => (
                <div key={item.label} className="border-t border-white/15 pt-6">
                  <div className="font-display text-[clamp(32px,4vw,52px)] font-extrabold tracking-[-0.03em]">
                    {item.value}
                  </div>
                  <div className="mt-2 text-sm text-mute">{item.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div ref={cardsWrapRef} className="relative z-20 h-auto md:h-dvh">
        <div
          ref={cardsPinRef}
          data-light-section
          className="relative z-20 flex min-h-dvh items-start rounded-t-[28px] bg-white px-5 pb-16 pt-28 text-ink shadow-[0_-48px_80px_rgba(0,0,0,.35)] sm:px-6 sm:pt-32 md:rounded-t-[36px]"
        >
          <div className="mx-auto w-full max-w-7xl">
            <p className="mb-4 font-mono text-[13px] tracking-[0.12em] text-blue">Что делаем</p>
            <h2 className="max-w-3xl font-display text-[clamp(28px,3.4vw,44px)] font-extrabold leading-[1.05] tracking-[-0.02em]">
              Сайт, приложение или платформа — без сюрпризов в смете
            </h2>
            <div className="mt-10 grid gap-5 md:grid-cols-3">
              {items.map((item) => (
                <article
                  key={item.title}
                  className={`relative flex min-h-[240px] flex-col gap-4 overflow-hidden rounded-[28px] p-8 ${
                    item.dark ? "bg-ink text-white" : "border border-[#DDE2EC] bg-white"
                  }`}
                >
                    {item.dark ? (
                      <div className="pf-orb pointer-events-none absolute -right-20 -top-20 size-60 rounded-full bg-[radial-gradient(circle,#2B4FE0,transparent_70%)] opacity-80" />
                    ) : null}
                    <div className={`relative font-mono text-[13px] ${item.dark ? "text-ice" : "text-[#4A5468]"}`}>
                      {item.kicker}
                    </div>
                    <h3 className="relative font-display text-[24px] font-semibold">{item.title}</h3>
                    <p className={`relative text-[15px] leading-relaxed ${item.dark ? "text-mist" : "text-[#4A5468]"}`}>
                      {item.text}
                    </p>
                    <div
                      className={`relative mt-auto flex flex-wrap items-baseline justify-between gap-2 border-t pt-5 ${
                        item.dark ? "border-white/15" : "border-[#DDE2EC]"
                      }`}
                    >
                      <span className="font-display text-[26px] font-extrabold">{item.price}</span>
                      <span className={item.dark ? "text-mist" : "text-[#4A5468]"}>{item.time}</span>
                    </div>
                  </article>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
