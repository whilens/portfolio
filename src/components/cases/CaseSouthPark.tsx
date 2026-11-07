"use client";

import { useEffect, useRef } from "react";
import { CaseShell } from "@/components/cases/CaseShell";
import { registerGsap } from "@/lib/gsap";

export function CaseSouthPark() {
  const stageRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const stage = stageRef.current;
    const img = imgRef.current;
    if (!stage || !img) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const { gsap } = registerGsap();
    const ctx = gsap.context(() => {
      gsap.fromTo(
        img,
        { scale: 0.82 },
        {
          scale: 1.35,
          ease: "none",
          scrollTrigger: {
            trigger: stage,
            start: "top top",
            end: "+=160%",
            pin: true,
            scrub: 0.8,
          },
        },
      );
    }, stage);

    return () => ctx.revert();
  }, []);

  return (
    <CaseShell slug="southpark" className="bg-[#fdfbf5] text-[#1a1a1a]">
      <div ref={stageRef} className="flex min-h-screen items-center justify-center px-6">
        <div className="relative w-full max-w-5xl overflow-hidden rounded-[32px] border border-black/10 bg-white shadow-2xl">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            ref={imgRef}
            src="/cases/southpark/frame.png"
            alt=""
            className="h-[70vh] w-full origin-center object-cover"
          />
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#fdfbf5] to-transparent p-8">
            <p className="font-mono text-xs tracking-[0.16em] text-[#5B7C5A]">PIN + ZOOM</p>
            <p className="mt-2 font-display text-3xl text-[#1a1a1a]">Кадр растёт вместе со скроллом</p>
          </div>
        </div>
      </div>
    </CaseShell>
  );
}
