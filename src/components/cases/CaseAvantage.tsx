"use client";

import { BackgroundVideo } from "@/components/BackgroundVideo";
import { CaseShell } from "@/components/cases/CaseShell";
import { Reveal } from "@/components/Reveal";

const cards = [
  { src: "/cases/avantage/1.webp", title: "Матовые" },
  { src: "/cases/avantage/2.webp", title: "Глянцевые" },
  { src: "/cases/avantage/3.webp", title: "Тканевые" },
  { src: "/cases/avantage/4.webp", title: "С подсветкой" },
];

export function CaseAvantage() {
  return (
    <CaseShell slug="avantage" className="bg-[#1a1510]">
      <div className="relative mx-6 mb-16 overflow-hidden rounded-[28px]">
        <div className="relative h-[52vh] min-h-[360px]">
          <BackgroundVideo src="/videos/avantage.mp4" poster="/posters/avantage.png" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1a1510] via-black/30 to-transparent" />
          <p className="absolute bottom-8 left-8 font-display text-3xl">Каталог, который продаёт фактуру</p>
        </div>
      </div>
      <div className="mx-auto grid max-w-7xl gap-5 px-6 pb-24 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card, i) => (
          <Reveal key={card.title} delay={i * 0.1}>
            <article className="overflow-hidden rounded-2xl border border-white/10 bg-[#241c16]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={card.src} alt="" className="h-48 w-full object-cover" />
              <div className="p-4 font-display text-lg">{card.title}</div>
            </article>
          </Reveal>
        ))}
      </div>
    </CaseShell>
  );
}
