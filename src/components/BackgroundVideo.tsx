"use client";

import { useEffect, useRef, useState } from "react";

type BackgroundVideoProps = {
  src?: string;
  poster: string;
  active?: boolean;
  className?: string;
};

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function BackgroundVideo({
  src,
  poster,
  active = true,
  className = "",
}: BackgroundVideoProps) {
  const ref = useRef<HTMLVideoElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const video = ref.current;
    if (!video || !src || !mounted) return;

    const sync = (inView: boolean) => {
      const shouldPlay =
        inView && active && !document.hidden && !prefersReducedMotion();
      if (shouldPlay) {
        void video.play().catch(() => undefined);
      } else {
        video.pause();
      }
    };

    const io = new IntersectionObserver(
      ([entry]) => sync(Boolean(entry?.isIntersecting)),
      { threshold: 0.35 },
    );

    const onVisibility = () => {
      const inView = video.getBoundingClientRect().top < window.innerHeight;
      sync(inView);
    };

    io.observe(video);
    document.addEventListener("visibilitychange", onVisibility);
    sync(false);
    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [src, active, mounted]);

  return (
    <div className={`absolute inset-0 overflow-hidden ${className}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={poster} alt="" className="h-full w-full object-cover" />
      {mounted && src ? (
        <video
          ref={ref}
          className="absolute inset-0 h-full w-full object-cover"
          poster={poster}
          muted
          loop
          playsInline
          preload="none"
          suppressHydrationWarning
        >
          <source src={src} />
        </video>
      ) : null}
    </div>
  );
}
