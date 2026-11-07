"use client";

import useEmblaCarousel from "embla-carousel-react";
import { useCallback, useEffect, useState } from "react";
import { BackgroundVideo } from "@/components/BackgroundVideo";
import { Reveal } from "@/components/Reveal";
import { projects } from "@/data/projects";

export function Cases() {
  const [ready, setReady] = useState(false);
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: "center" });
  const [index, setIndex] = useState(0);
  const [hovered, setHovered] = useState(false);

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
    if (hovered) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setInterval(() => emblaApi?.scrollNext(), 5600);
    return () => window.clearInterval(id);
  }, [emblaApi, hovered]);

  return (
    <section id="work" className="relative pb-20 pt-16">
      <div className="mx-auto max-w-7xl px-6 pb-8">
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
          className="relative mx-auto max-w-7xl px-6"
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          <div className="overflow-hidden rounded-[28px]" ref={ready ? emblaRef : undefined} suppressHydrationWarning>
            <div className="flex">
              {projects.map((project, i) => (
                <article key={project.slug} className="min-w-0 flex-[0_0_100%]">
                  <div className="relative h-[52vh] min-h-[340px] overflow-hidden">
                    <BackgroundVideo src={project.video} poster={project.poster} active={index === i} />
                    <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/25 to-transparent" />
                    <div className="absolute inset-x-0 bottom-0 p-6 md:p-8">
                      <p className="font-mono text-[11px] tracking-[0.16em] text-ice">{project.client}</p>
                      <h3 className="mt-2 font-display text-[clamp(28px,4vw,48px)] font-semibold">
                        {project.title}
                      </h3>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={() => emblaApi?.scrollPrev()}
            className="absolute left-8 top-1/2 z-10 hidden size-11 -translate-y-1/2 rounded-full border border-white/25 bg-ink/40 text-lg backdrop-blur-md md:grid md:place-items-center"
            aria-label="Предыдущий проект"
          >
            ←
          </button>
          <button
            type="button"
            onClick={() => emblaApi?.scrollNext()}
            className="absolute right-8 top-1/2 z-10 hidden size-11 -translate-y-1/2 rounded-full border border-white/25 bg-ink/40 text-lg backdrop-blur-md md:grid md:place-items-center"
            aria-label="Следующий проект"
          >
            →
          </button>
        </div>
      </Reveal>

      <div className="mt-6 flex justify-center gap-2">
        {projects.map((project, i) => (
          <button
            key={project.slug}
            type="button"
            aria-label={project.title}
            onClick={() => emblaApi?.scrollTo(i)}
            className={`h-1.5 rounded-full transition-all ${
              index === i ? "w-8 bg-white" : "w-1.5 bg-white/30"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
