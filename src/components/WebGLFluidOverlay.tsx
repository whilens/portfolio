"use client";

import { useEffect, useRef, useState } from "react";
import { createFluidSimulation, type FluidHandle } from "@/lib/fluid-simulation";

function isWeakGpu() {
  const cores = navigator.hardwareConcurrency ?? 8;
  return cores <= 2;
}

function isNarrow() {
  return window.innerWidth < 768;
}

function shouldDisable() {
  if (typeof window === "undefined") return true;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  return reduce || isWeakGpu();
}

export function WebGLFluidOverlay() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    if (shouldDisable()) return;
    setEnabled(true);
    const canvas = canvasRef.current;
    if (!canvas) return;

    const mobile = isNarrow();
    let handle: FluidHandle | null = null;
    const timer = window.setTimeout(() => {
      handle = createFluidSimulation(canvas, {
        simResolution: mobile ? 96 : 128,
        dyeResolution: mobile ? 256 : 512,
        dpr: 1,
      });
    }, 120);

    return () => {
      window.clearTimeout(timer);
      handle?.destroy();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[1] h-full w-full bg-transparent mix-blend-screen"
      style={{ opacity: enabled ? 0.5 : 0 }}
    />
  );
}
