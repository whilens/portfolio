"use client";

import useEmblaCarousel from "embla-carousel-react";
import { CaseShell } from "@/components/cases/CaseShell";

const cards = [
  { src: "/cases/rumtibet/1.png", title: "День 1 · Дорога" },
  { src: "/cases/rumtibet/2.png", title: "День 2 · Горы" },
  { src: "/cases/rumtibet/3.png", title: "День 3 · Лагерь" },
  { src: "/cases/rumtibet/4.png", title: "День 4 · Возвращение" },
];

export function CaseRumtibet() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: "start", dragFree: true });

  return (
    <CaseShell slug="rumtibet" className="bg-[#2a2218]">
      <div className="mx-auto max-w-7xl px-6 pb-20">
        <div className="mb-6 flex justify-end gap-2">
          <button type="button" onClick={() => emblaApi?.scrollPrev()} className="size-11 rounded-full border border-white/20">
            ←
          </button>
          <button type="button" onClick={() => emblaApi?.scrollNext()} className="size-11 rounded-full border border-white/20">
            →
          </button>
        </div>
        <div className="overflow-hidden" ref={emblaRef} suppressHydrationWarning>
          <div className="flex gap-5">
            {cards.map((card) => (
              <article key={card.title} className="min-w-0 flex-[0_0_78%] sm:flex-[0_0_42%]">
                <div className="overflow-hidden rounded-[24px] border border-[#E8C17A]/25">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={card.src} alt="" className="h-72 w-full object-cover" />
                  <div className="bg-[#1c1712] p-5 font-display text-xl">{card.title}</div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </CaseShell>
  );
}
