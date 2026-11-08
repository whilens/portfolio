"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import { BackgroundVideo } from "@/components/BackgroundVideo";
import { Reveal } from "@/components/Reveal";
import { projects } from "@/data/projects";

const COUNT = projects.length;
const VISIBLE = 3;

export function Cases() {
  const [ready, setReady] = useState(false);
  const [reduce, setReduce] = useState(false);
  const [index, setIndex] = useState(0);
  const [hovered, setHovered] = useState(false);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const pointer = useRef({ x: 0, y: 0, dragged: false });

  useEffect(() => {
    setReady(true);
    setReduce(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  const go = useCallback((delta: number) => {
    setIndex((current) => (current + delta + COUNT) % COUNT);
  }, []);

  const goTo = useCallback((next: number) => {
    setIndex((next + COUNT) % COUNT);
  }, []);

  useEffect(() => {
    if (!ready || hovered || reduce) return;
    const id = window.setInterval(() => go(1), 5600);
    return () => window.clearInterval(id);
  }, [ready, hovered, reduce, go, index]);

  const active = projects[index];

  return (
    <section id="work" className="relative overflow-x-clip pb-16 pt-12 sm:pb-20 sm:pt-16">
      <div className="mx-auto max-w-7xl px-5 pb-6 sm:px-6 sm:pb-8">
        <Reveal>
          <p className="mb-4 font-mono text-[13px] tracking-[0.12em] text-ice">01 / РАБОТЫ</p>
          <h2 className="font-display text-[clamp(34px,4.4vw,60px)] font-extrabold leading-[1.05]">
            Избранные проекты
          </h2>
        </Reveal>
      </div>

      <Reveal delay={0.12}>
        <div
          data-work-slider
          className="relative mx-auto max-w-7xl px-5 sm:px-6"
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => {
            setHovered(false);
            setTilt({ x: 0, y: 0 });
          }}
          onPointerMove={(e) => {
            if (!ready || reduce || e.pointerType !== "mouse") return;
            const rect = e.currentTarget.getBoundingClientRect();
            const px = (e.clientX - rect.left) / rect.width - 0.5;
            const py = (e.clientY - rect.top) / rect.height - 0.5;
            setTilt({ x: py * -6, y: px * 8 });
            if (Math.abs(e.clientX - pointer.current.x) > 12) pointer.current.dragged = true;
          }}
          onPointerDown={(e) => {
            pointer.current = { x: e.clientX, y: e.clientY, dragged: false };
            if (e.pointerType !== "mouse") setHovered(true);
          }}
          onPointerUp={(e) => {
            if ((e.target as HTMLElement).closest("button")) return;
            const dx = e.clientX - pointer.current.x;
            const dy = e.clientY - pointer.current.y;
            if (Math.abs(dx) > 56 && Math.abs(dx) > Math.abs(dy) * 1.4) go(dx < 0 ? 1 : -1);
            if (e.pointerType !== "mouse") setHovered(false);
          }}
          onPointerCancel={() => {
            setHovered(false);
            setTilt({ x: 0, y: 0 });
          }}
        >
          <div className="work-stack relative mx-auto h-[min(56vh,560px)] min-h-[280px] w-full max-w-5xl select-none touch-pan-y">
            {projects.map((project, i) => {
              const d = (i - index + COUNT) % COUNT;
              const hidden = d > VISIBLE;
              const visual = Math.min(d, VISIBLE + 1);
              const isFront = d === 0;

              return (
                <motion.article
                  key={project.slug}
                  className="work-stack-item absolute inset-x-0 top-0 h-[calc(100%-6.5rem)] origin-top"
                  style={{
                    zIndex: hidden ? 0 : 20 - d,
                    pointerEvents: hidden ? "none" : "auto",
                  }}
                  animate={{
                    x: reduce ? 0 : visual * 10,
                    y: reduce ? 0 : visual * 36,
                    z: ready && !reduce ? visual * -72 : 0,
                    scale: reduce ? 1 : 1 - visual * 0.035,
                    opacity: reduce ? (isFront ? 1 : 0) : hidden ? 0 : 1 - visual * 0.1,
                    rotateX: ready && !reduce && isFront ? tilt.x : 0,
                    rotateY: ready && !reduce && isFront ? tilt.y : 0,
                  }}
                  transition={{ type: "spring", stiffness: 170, damping: 24 }}
                  onClick={() => {
                    if (isFront || pointer.current.dragged) return;
                    goTo(i);
                  }}
                >
                  <div
                    className={`flex h-full flex-col overflow-hidden rounded-[22px] border border-white/12 bg-ink-2 shadow-[0_28px_70px_-24px_rgba(0,0,0,0.75)] ${
                      isFront ? "" : "cursor-pointer"
                    }`}
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
                      <BackgroundVideo
                        src={isFront ? project.video : undefined}
                        poster={project.poster}
                        active={isFront && ready}
                      />
                    </div>
                  </div>
                </motion.article>
              );
            })}

            <button
              type="button"
              onClick={() => go(-1)}
              className="absolute left-0 top-[42%] z-30 grid size-10 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-white/25 bg-ink/50 text-lg backdrop-blur-md sm:size-11 lg:-translate-x-full"
              aria-label="Предыдущий проект"
            >
              ←
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              className="absolute right-0 top-[42%] z-30 grid size-10 translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-white/25 bg-ink/50 text-lg backdrop-blur-md sm:size-11 lg:translate-x-full"
              aria-label="Следующий проект"
            >
              →
            </button>
          </div>

          <div className="relative z-20 mt-2 flex items-end justify-between gap-6">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={active.slug}
                initial={ready && !reduce ? { opacity: 0, y: 10 } : false}
                animate={{ opacity: 1, y: 0 }}
                exit={ready && !reduce ? { opacity: 0, y: -8 } : undefined}
                transition={{ duration: 0.32, ease: [0.2, 0.7, 0.2, 1] }}
              >
                <p className="font-mono text-[11px] tracking-[0.16em] text-ice">{active.client}</p>
                <h3 className="mt-2 font-display text-[clamp(28px,4vw,48px)] font-semibold">
                  {active.title}
                </h3>
              </motion.div>
            </AnimatePresence>

            <div className="mb-2 flex shrink-0 justify-center gap-2">
              {projects.map((project, i) => (
                <button
                  key={project.slug}
                  type="button"
                  aria-label={project.title}
                  onClick={() => goTo(i)}
                  className={`h-1.5 rounded-full transition-all ${
                    index === i ? "w-8 bg-white" : "w-1.5 bg-white/30"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
