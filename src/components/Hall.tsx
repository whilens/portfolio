"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState, type CSSProperties } from "react";
import { BackgroundVideo } from "@/components/BackgroundVideo";
import CaseStackScroll from "@/components/ui/case-stack-scroll";
import DataRain from "@/components/ui/data-rain";
import { projects, type Project } from "@/data/projects";

const LINE = "Сайты, которые";
const SELL = "продают";

const stackCards = projects.map((project) => ({
  title: project.title,
  category: project.client,
  image: project.poster,
}));

function SiteScreen({
  project,
  active,
  className = "",
}: {
  project: Project;
  active: boolean;
  className?: string;
}) {
  return (
    <div
      className={`flex h-full w-full flex-col overflow-hidden rounded-[18px] border border-white/14 bg-ink-2 shadow-[0_24px_70px_-24px_rgba(0,0,0,0.85)] ${className}`}
    >
      <div
        aria-hidden
        className="flex h-8 shrink-0 items-center gap-1.5 border-b border-white/10 bg-white/[0.04] px-3"
      >
        <span className="size-1.5 rounded-full bg-[#FF5F57]/80" />
        <span className="size-1.5 rounded-full bg-[#FEBC2E]/80" />
        <span className="size-1.5 rounded-full bg-[#28C840]/80" />
      </div>
      <div className="relative min-h-0 flex-1">
        <BackgroundVideo src={active ? project.video : undefined} poster={project.poster} active={active} />
      </div>
    </div>
  );
}

function KineticWord({ word }: { word: string }) {
  return (
    <span className="kinetic-wrap" aria-hidden="true">
      <span className="kinetic-word">
        {word.split("").map((letter, i) => (
          <span key={`${letter}-${i}`} className="kinetic-letter" style={{ "--i": i } as CSSProperties}>
            {letter}
          </span>
        ))}
      </span>
    </span>
  );
}

export function Hall() {
  const [opened, setOpened] = useState<Project | null>(null);

  useEffect(() => {
    if (!opened) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpened(null);
    };
    const prev = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.documentElement.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [opened]);

  return (
    <section id="work" className="relative bg-ink">
      <div id="top" className="sr-only">
        Зал работ
      </div>

      <div className="relative lg:h-dvh lg:overflow-hidden">
        <div className="pointer-events-none absolute inset-0 z-0 hidden overflow-hidden lg:block">
          <DataRain fullscreen={false} count={2200} flowSpeed={0.85} obstacleRadius={72} />
        </div>
        <div className="hall-vignette pointer-events-none absolute inset-0 z-10 hidden lg:block" />

        <div className="relative z-20 px-5 pb-4 pt-28 sm:px-8 lg:pointer-events-none lg:absolute lg:inset-x-0 lg:top-24 lg:px-12 lg:pb-0 lg:pt-0">
          <p className="font-mono text-[12px] tracking-[0.16em] text-ice">01 / ЗАЛ</p>
          <h1 className="mt-3 font-display text-[clamp(22px,6vw,26px)] font-semibold tracking-[-0.02em] text-[#c9d2e6] lg:flex lg:flex-wrap lg:items-baseline lg:gap-3">
            {LINE}
            <span className="sr-only"> {SELL}</span>
            <span className="mt-2 block font-display text-[clamp(40px,6vw,64px)] font-extrabold leading-[0.9] tracking-[-0.04em] lg:mt-0 lg:text-[42px]">
              <KineticWord word={SELL} />
            </span>
          </h1>
        </div>

        <div className={`hall-deck absolute inset-0 z-[12] hidden lg:block${opened ? " invisible pointer-events-none" : ""}`}>
          <CaseStackScroll
            cards={stackCards}
            loop={false}
            height="100%"
            countLabel="работ"
            cursorLabel="Смотреть работы"
            chrome
            ariaLabel="Зал работ"
            onSelect={(_, i) => setOpened(projects[i] ?? null)}
          />
        </div>
      </div>

      <div className="hall-fallback flex flex-col gap-8 px-5 py-8 lg:hidden">
        {projects.map((project) => (
          <button
            key={project.slug}
            type="button"
            className="w-full text-left"
            onClick={() => setOpened(project)}
          >
            <div className="h-[62vh] min-h-[280px] w-full">
              <SiteScreen project={project} active={false} />
            </div>
            <p className="mt-3 font-mono text-[11px] tracking-[0.16em] text-ice">{project.client}</p>
            <p className="mt-1 font-display text-[28px] font-semibold">{project.title}</p>
          </button>
        ))}
      </div>

      <AnimatePresence>
        {opened ? (
          <motion.div
            className="fixed inset-0 z-[60] flex flex-col bg-ink/92 px-4 py-20 backdrop-blur-md sm:px-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
          >
            <button
              type="button"
              onClick={() => setOpened(null)}
              className="absolute right-5 top-6 z-[1] font-mono text-[12px] tracking-[0.14em] text-ice sm:right-10"
            >
              ← Назад в зал
            </button>
            <div className="mx-auto flex h-full w-full max-w-6xl flex-col">
              <div className="min-h-0 flex-1">
                <SiteScreen project={opened} active />
              </div>
              <div className="shrink-0 pt-6">
                <p className="font-mono text-[12px] tracking-[0.16em] text-ice">{opened.client}</p>
                <h2 className="mt-2 font-display text-[clamp(28px,4vw,48px)] font-semibold">{opened.title}</h2>
                <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-mist">{opened.summary}</p>
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </section>
  );
}
