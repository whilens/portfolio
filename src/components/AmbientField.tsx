"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useEffect, useState } from "react";

export function AmbientField() {
  const [mounted, setMounted] = useState(false);
  const reducePref = useReducedMotion();
  const reduce = mounted && Boolean(reducePref);
  const { scrollY } = useScroll();
  const ySlow = useTransform(scrollY, [0, 2400], [0, reduce ? 0 : -220]);
  const yFast = useTransform(scrollY, [0, 2400], [0, reduce ? 0 : -460]);
  const rotate = useTransform(scrollY, [0, 3200], [0, reduce ? 0 : 8]);
  const [mouse, setMouse] = useState({ x: 0, y: 0 });

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || reduce) return;
    const onMove = (e: PointerEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 40;
      const y = (e.clientY / window.innerHeight - 0.5) * 28;
      setMouse({ x, y });
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [mounted, reduce]);

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <motion.div
        className="absolute inset-0 opacity-80"
        style={mounted ? { y: ySlow, x: mouse.x * 0.4, rotate, scale: 1.12 } : undefined}
      >
        <svg viewBox="0 0 1440 900" className="h-full w-full" preserveAspectRatio="xMidYMid slice">
          <defs>
            <linearGradient id="glowA" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#7C9BFF" stopOpacity="0" />
              <stop offset="45%" stopColor="#7C9BFF" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#2B4FE0" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="glowB" x1="1" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#9DB4FF" stopOpacity="0" />
              <stop offset="50%" stopColor="#4C6FFF" stopOpacity="0.75" />
              <stop offset="100%" stopColor="#2B4FE0" stopOpacity="0" />
            </linearGradient>
            <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="6" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          <path
            d="M-80 180C180 40 360 260 560 210C780 150 900 40 1180 120C1320 170 1480 90 1600 160"
            fill="none"
            stroke="url(#glowA)"
            strokeWidth="1.4"
            filter="url(#softGlow)"
            className="glow-draw"
          />
          <path
            d="M-40 520C160 430 420 610 680 540C920 470 1100 620 1440 500"
            fill="none"
            stroke="url(#glowB)"
            strokeWidth="1.1"
            filter="url(#softGlow)"
            className="glow-draw glow-draw-delay"
          />
        </svg>
      </motion.div>

      <motion.div
        className="absolute inset-0 opacity-70"
        style={mounted ? { y: yFast, x: -mouse.x * 0.6, scale: 1.08 } : undefined}
      >
        <svg viewBox="0 0 1440 900" className="h-full w-full" preserveAspectRatio="xMidYMid slice">
          <path
            d="M200 -40C240 180 80 340 260 520C420 680 180 760 420 980"
            fill="none"
            stroke="#7C9BFF"
            strokeOpacity="0.35"
            strokeWidth="1.2"
            className="glow-draw"
          />
          <path
            d="M1180 -20C1120 200 1320 340 1200 560C1080 760 1360 820 1240 1020"
            fill="none"
            stroke="#2B4FE0"
            strokeOpacity="0.4"
            strokeWidth="1.2"
            className="glow-draw glow-draw-delay"
          />
          <path
            d="M-20 760C300 700 520 820 820 740C1080 670 1280 810 1500 730"
            fill="none"
            stroke="#C9D6FF"
            strokeOpacity="0.22"
            strokeWidth="0.8"
            className="glow-draw"
          />
        </svg>
      </motion.div>

      <div
        className="glow-orbs absolute inset-0"
        style={mounted ? { transform: `translate3d(0, ${mouse.y}px, 0)` } : undefined}
      >
        <span className="glow-orb left-[12%] top-[18%]" />
        <span className="glow-orb right-[16%] top-[42%]" />
        <span className="glow-orb left-[48%] bottom-[12%]" />
      </div>
    </div>
  );
}
