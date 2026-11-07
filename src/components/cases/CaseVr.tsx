"use client";

import { CaseShell } from "@/components/cases/CaseShell";
import { Reveal } from "@/components/Reveal";

export function CaseVr() {
  return (
    <CaseShell slug="vr" className="bg-[#252532]">
      <div className="relative mx-auto max-w-7xl overflow-hidden px-6 pb-24">
        <div className="vr-pulse absolute left-[12%] top-10 size-40 rounded-full bg-violet-500/20 [animation:vrPulse_3s_ease-in-out_infinite]" />
        <div className="vr-pulse absolute right-[18%] top-32 size-28 rounded-full bg-cyan-400/20 [animation:vrPulse_3.6s_ease-in-out_infinite]" />
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div>
            <Reveal from="left">
              <p className="font-mono text-xs tracking-[0.2em] text-violet-300">VR EVENTS</p>
              <h3 className="mt-4 font-display text-4xl font-semibold md:text-5xl">
                Сцена собирается
                <br />
                по скроллу
              </h3>
            </Reveal>
            <Reveal from="up" delay={0.15} className="mt-5 max-w-md text-white/70">
              Блоки выезжают слева и снизу, круги пульсируют — как в референсе, но без WOW.js.
            </Reveal>
          </div>
          <div className="relative">
            <Reveal from="left" delay={0.1}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/cases/vr/man.png" alt="" className="relative z-10 w-full max-w-md" />
            </Reveal>
            <Reveal delay={0.25} className="absolute -right-4 bottom-6 z-20 w-40">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/cases/vr/child.png" alt="" className="rounded-2xl" />
            </Reveal>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/cases/vr/light.png"
              alt=""
              className="pointer-events-none absolute -top-10 right-0 w-56 opacity-80"
            />
          </div>
        </div>
      </div>
    </CaseShell>
  );
}
