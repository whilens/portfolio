"use client";

import { BackgroundVideo } from "@/components/BackgroundVideo";
import { CaseShell } from "@/components/cases/CaseShell";

const cards = [
  { src: "/cases/braas/1.png", title: "Карточка 01" },
  { src: "/cases/braas/2.png", title: "Карточка 02" },
  { src: "/cases/braas/3.png", title: "Карточка 03" },
  { src: "/cases/braas/4.png", title: "Карточка 04" },
];

export function CaseBraas() {
  return (
    <CaseShell slug="braas" className="bg-[#120816]">
      <div
        className="braas-gradient relative mx-6 mb-10 overflow-hidden rounded-[28px]"
        style={{
          background:
            "linear-gradient(120deg, #7c3aed, #ec4899, #22d3ee, #7c3aed)",
          backgroundSize: "300% 300%",
        }}
      >
        <div className="relative h-[42vh] min-h-[280px]">
          <BackgroundVideo
            src="/videos/braas.webm"
            poster="/posters/braas.png"
            className="mix-blend-luminosity opacity-80"
          />
          <div className="absolute inset-0 bg-black/35" />
          <p className="absolute bottom-8 left-8 font-display text-3xl">Hover, который продаёт SKU</p>
        </div>
      </div>
      <div className="mx-auto grid max-w-7xl gap-6 px-6 pb-24 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => (
          <article key={card.title} className="group rounded-3xl border border-white/10 bg-[#1a1024] p-4">
            <div className="overflow-hidden rounded-2xl">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={card.src}
                alt=""
                className="h-52 w-full object-cover transition duration-500 group-hover:scale-125 group-hover:-rotate-[8deg]"
              />
            </div>
            <div className="pt-4 font-display text-lg">{card.title}</div>
          </article>
        ))}
      </div>
    </CaseShell>
  );
}
