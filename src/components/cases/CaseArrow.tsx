"use client";

import { useEffect, useRef, useState } from "react";
import { CaseShell } from "@/components/cases/CaseShell";
import { registerGsap } from "@/lib/gsap";

const frames = [
  "/cases/arrow/1.png",
  "/cases/arrow/2.png",
  "/cases/arrow/3.png",
  "/cases/arrow/4.png",
];

export function CaseArrow() {
  const pinRef = useRef<HTMLDivElement>(null);
  const [slide, setSlide] = useState(0);

  useEffect(() => {
    const el = pinRef.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const { gsap } = registerGsap();
    const ctx = gsap.context(() => {
      gsap.timeline({
        scrollTrigger: {
          trigger: el,
          start: "top top",
          end: "+=180%",
          pin: true,
          scrub: 0.6,
        },
      });
    }, el);

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setInterval(() => {
      setSlide((v) => (v + 1) % frames.length);
    }, 2600);
    return () => window.clearInterval(id);
  }, []);

  return (
    <CaseShell slug="arrow" className="bg-[#06101c]">
      <div ref={pinRef} className="flex min-h-screen items-center px-6">
        <div className="mx-auto grid w-full max-w-7xl items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <p className="font-mono text-xs tracking-[0.16em] text-ice">ARROW · PIN-СЕКЦИИ</p>
            <h3 className="mt-4 font-display text-4xl font-semibold md:text-5xl">
              Экраны стыкуются
              <br />
              и остаются в кадре
            </h3>
            <p className="mt-5 max-w-lg text-mist">
              Как в оригинале: панель закрепляется, пока следующий блок не сменит её. CTA меняет
              цвет вместе с фоном.
            </p>
            <button
              type="button"
              className={`mt-8 min-h-12 rounded-full px-7 font-semibold transition ${
                slide % 2 === 0 ? "bg-white text-ink" : "bg-blue text-white"
              }`}
            >
              Обсудить яхту
            </button>
          </div>
          <div className="relative h-[420px] overflow-hidden rounded-[28px] border border-white/10 bg-[#0a1828]">
            {frames.map((src, i) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={src}
                src={src}
                alt=""
                className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${
                  slide === i ? "opacity-100" : "opacity-0"
                }`}
              />
            ))}
            <div className="absolute bottom-4 left-4 right-4 flex justify-center gap-2">
              {frames.map((_, i) => (
                <span
                  key={i}
                  className={`h-1.5 rounded-full ${slide === i ? "w-8 bg-white" : "w-2 bg-white/30"}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </CaseShell>
  );
}
