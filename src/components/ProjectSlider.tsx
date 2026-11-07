"use client";

import useEmblaCarousel from "embla-carousel-react";
import { useCallback, useEffect, useState } from "react";
import { BackgroundVideo } from "@/components/BackgroundVideo";
import { projects } from "@/data/projects";

export function ProjectSlider() {
  const [ready, setReady] = useState(false);
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: "start" });
  const [index, setIndex] = useState(0);

  useEffect(() => {
    setReady(true);
  }, []);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
  }, [emblaApi, onSelect]);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setInterval(() => emblaApi?.scrollNext(), 6400);
    return () => window.clearInterval(id);
  }, [emblaApi]);

  return (
    <section id="work" className="relative">
      <div className="pointer-events-none absolute left-0 top-8 z-10 hidden w-full overflow-hidden px-4 font-display text-[clamp(72px,14vw,220px)] font-extrabold leading-none text-transparent [-webkit-text-stroke:1px_rgba(125,155,255,.16)] md:block">
        РАБОТЫ · ПРОЕКТЫ
      </div>
      <div className="relative mx-auto flex max-w-7xl items-end justify-between gap-6 px-6 pb-6 pt-16">
        <div>
          <p className="mb-4 font-mono text-[13px] tracking-[0.12em] text-ice">01 / РАБОТЫ</p>
          <h2 className="font-display text-[clamp(34px,4.4vw,60px)] font-extrabold leading-[1.05] tracking-[-0.02em]">
            Избранные проекты
          </h2>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => emblaApi?.scrollPrev()}
            className="size-12 rounded-full border border-white/20 text-xl transition hover:border-ice hover:text-ice"
            aria-label="Предыдущий проект"
          >
            ←
          </button>
          <button
            type="button"
            onClick={() => emblaApi?.scrollNext()}
            className="size-12 rounded-full border border-white/20 text-xl transition hover:border-ice hover:text-ice"
            aria-label="Следующий проект"
          >
            →
          </button>
        </div>
      </div>

      <div className="overflow-hidden" ref={ready ? emblaRef : undefined} suppressHydrationWarning>
        <div className="flex">
          {projects.map((project, i) => (
            <article key={project.slug} className="relative min-w-0 flex-[0_0_100%]">
              <div className="relative mx-6 mb-8 h-[56vh] min-h-[380px] overflow-hidden rounded-[28px] border border-white/10">
                <BackgroundVideo
                  src={project.video}
                  poster={project.poster}
                  active={index === i}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/55 to-ink/20" />
                <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-12">
                  <span className="mb-4 w-fit rounded-full border border-white/15 bg-ink/50 px-3 py-1 font-mono text-xs text-[#C9D6FF]">
                    {project.client}
                  </span>
                  <h3 className="font-display text-[clamp(32px,4vw,56px)] font-semibold">
                    {project.title}
                  </h3>
                  <p className="mt-2 max-w-xl text-sm text-mist md:text-base">{project.summary}</p>
                  <div className="mt-4 flex flex-wrap gap-2 font-mono text-xs">
                    {project.tags.map((tag) => (
                      <span key={tag} className="rounded-full border border-white/15 px-3 py-1">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>

      <div className="mx-6 mb-16 rounded-[28px] border border-dashed border-ice/40 bg-[#060A18] px-8 py-10 md:px-12">
        <div className="flex flex-wrap items-center justify-between gap-6">
          <div>
            <div className="font-display text-[28px] font-semibold">Здесь может быть ваш проект</div>
            <div className="mt-2 text-mist">Расскажите задачу — предложим решение и честную смету.</div>
          </div>
          <a
            href="#contact"
            className="inline-flex min-h-12 items-center rounded-full bg-white px-6 font-bold text-ink"
          >
            Обсудить проект →
          </a>
        </div>
      </div>

      <div className="flex justify-center gap-2 pb-8" suppressHydrationWarning>
        {projects.map((project, i) => (
          <button
            key={project.slug}
            type="button"
            aria-label={project.title}
            onClick={() => emblaApi?.scrollTo(i)}
            className={`h-2 rounded-full transition-all ${
              index === i ? "w-8 bg-white" : "w-2 bg-white/30"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
