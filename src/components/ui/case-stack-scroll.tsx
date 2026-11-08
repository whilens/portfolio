"use client";

/**
 * Case Stack Scroll: case studies as a stack of site cards.
 * Filed up and back like folders in a drawer: the nearest card faces you,
 * the ones behind it show only their top strip.
 */

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";
import gsap from "gsap";

export type CaseCard = {
  title: string;
  category: string;
  image?: string;
  href?: string;
};

export type CaseStackScrollProps = {
  cards: CaseCard[];
  tagline?: [string, string] | null;
  ctaLabel?: string | null;
  ctaHref?: string;
  countLabel?: string;
  cursorLabel?: string;
  onSelect?: (card: CaseCard, index: number) => void;
  onFrontChange?: (index: number) => void;
  height?: string;
  className?: string;
  chrome?: boolean;
  loop?: boolean;
  ariaLabel?: string;
};

const FACE_W = 1280;
const FACE_H = 800;
const FALL = 1.6;

export const slotOf = (k: number, roll: number, n: number, loop = true) => {
  if (loop) return ((((k - roll + FALL) % n) + n) % n) - FALL;
  return k - roll;
};

export function cardPose(
  k: number,
  roll: number,
  hover: number,
  lift: number,
  n: number,
  loop = true,
  lifts?: number[],
) {
  const slot = slotOf(k, roll, n, loop);
  let y: number;
  let z: number;
  let rot: number;
  if (slot >= 0) {
    y = -slot * 0.15 - slot * slot * 0.003;
    z = -slot * 0.15;
    rot = Math.min(slot, 1) * 13;
  } else {
    y = -slot * 0.75;
    z = -slot * 0.04;
    rot = 0;
  }

  const applyLift = (h: number, amount: number) => {
    if (amount <= 0.001) return;
    if (k === h) {
      rot *= 1 - amount;
      y -= amount * 0.1;
      z += amount * 0.08;
    } else if (slot < slotOf(h, roll, n, loop)) y += amount * 0.62;
    else y -= amount * 0.05;
  };

  if (lifts && lifts.length) {
    for (let h = 0; h < n; h++) applyLift(h, lifts[h] ?? 0);
  } else if (hover >= 0 && lift > 0) {
    applyLift(hover, lift);
  }

  const back = Math.min(13, n - FALL);
  const opacity =
    slot < -1 ? Math.max(0, (slot + FALL) / 0.6) : slot > back - 1.5 ? Math.max(0, (back - slot) / 1.5) : 1;
  return { y, z, rot, opacity, slot };
}

const reduced = () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function clamp(v: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(hi, v));
}

export default function CaseStackScroll({
  cards,
  tagline = null,
  ctaLabel = null,
  ctaHref = "#",
  countLabel = "проектов",
  cursorLabel = "Смотреть работы",
  onSelect,
  onFrontChange,
  height = "100svh",
  className = "",
  chrome = true,
  loop = true,
  ariaLabel = "Зал работ",
}: CaseStackScrollProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const cursorRef = useRef<HTMLDivElement>(null);
  const onFrontChangeRef = useRef(onFrontChange);
  const loopRef = useRef(loop);
  const state = useRef({
    roll: 0,
    target: 0,
    hover: -1,
    want: -1,
    lifts: [] as number[],
    ch: 300,
    cw: 480,
    front: 0,
  });
  const [front, setFront] = useState(0);
  const [hover, setHover] = useState(-1);
  const n = cards.length;

  onFrontChangeRef.current = onFrontChange;
  loopRef.current = loop;

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root || n === 0) return;
    const st = state.current;
    st.lifts = cards.map((_, i) => st.lifts[i] ?? 0);

    const size = () => {
      const w = root.clientWidth;
      const h = root.clientHeight;
      const narrow = w < 720;
      st.cw = Math.min(narrow ? w * 0.84 : w * 0.5, (h * 0.62 * FACE_W) / FACE_H);
      st.ch = (st.cw * FACE_H) / FACE_W;
      root.style.setProperty("--cs-cw", `${st.cw}px`);
      root.style.setProperty("--cs-ch", `${st.ch}px`);
    };

    const place = () => {
      const looping = loopRef.current;
      for (let k = 0; k < n; k++) {
        const el = cardRefs.current[k];
        if (!el) continue;
        const p = cardPose(k, st.roll, st.hover, 0, n, looping, st.lifts);
        el.style.transform = `translate3d(-50%,${(p.y * st.ch).toFixed(2)}px,${(p.z * st.ch).toFixed(2)}px) rotateX(${(-p.rot).toFixed(2)}deg)`;
        el.style.opacity = p.opacity.toFixed(3);
        const liftBoost = k === st.want ? (st.lifts[k] ?? 0) * 80 : 0;
        el.style.zIndex = String(Math.round(1000 - p.slot * 10 + liftBoost));
        el.style.visibility = p.opacity <= 0 ? "hidden" : "visible";
        el.style.setProperty("--cs-shade", Math.min(0.22, Math.max(0, (p.slot - 3) * 0.025)).toFixed(3));
      }
    };

    const tick = () => {
      const ease = reduced() ? 1 : 0.085;
      st.roll += (st.target - st.roll) * ease;
      if (Math.abs(st.target - st.roll) < 0.0005) st.roll = st.target;
      const liftEase = reduced() ? 1 : 0.1;
      for (let k = 0; k < n; k++) {
        const goal = k === st.want ? 1 : 0;
        st.lifts[k] = (st.lifts[k] ?? 0) + (goal - (st.lifts[k] ?? 0)) * liftEase;
      }
      if (st.want < 0 && st.hover >= 0 && (st.lifts[st.hover] ?? 0) < 0.002) {
        st.hover = -1;
      }
      const f = loopRef.current
        ? (((Math.round(st.roll) % n) + n) % n)
        : clamp(Math.round(st.roll), 0, n - 1);
      if (f !== st.front) {
        st.front = f;
        setFront(f);
        onFrontChangeRef.current?.(f);
      }
      place();
    };

    size();
    place();
    const ro = new ResizeObserver(() => {
      size();
      place();
    });
    ro.observe(root);
    gsap.ticker.add(tick);
    return () => {
      ro.disconnect();
      gsap.ticker.remove(tick);
    };
  }, [n, cards]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root || n === 0) return;
    const st = state.current;
    let snap = 0;

    const bound = (v: number) => (loopRef.current ? v : clamp(v, 0, n - 1));

    const onWheel = (e: WheelEvent) => {
      const d = Math.abs(e.deltaY) > Math.abs(e.deltaX) ? e.deltaY : e.deltaX;
      const px = e.deltaMode === 1 ? d * 32 : d;
      if (!loopRef.current) {
        const atStart = st.roll <= 0.02 && px < 0;
        const atEnd = st.roll >= n - 1 - 0.02 && px > 0;
        if (atStart || atEnd) return;
      }
      e.preventDefault();
      st.target = bound(st.target + px / 420);
      clearTimeout(snap);
      snap = window.setTimeout(() => {
        st.target = bound(Math.round(st.target));
      }, 160);
    };

    let drag: { id: number; y: number; t: number; moved: boolean } | null = null;
    const onDown = (e: PointerEvent) => {
      if (e.pointerType === "mouse" && e.button !== 0) return;
      drag = { id: e.pointerId, y: e.clientY, t: st.target, moved: false };
    };
    const onMove = (e: PointerEvent) => {
      if (!drag || drag.id !== e.pointerId) return;
      const d = drag.y - e.clientY;
      if (!drag.moved && Math.abs(d) > 6) {
        drag.moved = true;
        try {
          root.setPointerCapture(e.pointerId);
        } catch {
          /* pointer may already be up */
        }
      }
      if (drag.moved) st.target = bound(drag.t + d / (st.ch * 0.42));
    };
    const onUp = (e: PointerEvent) => {
      if (!drag || drag.id !== e.pointerId) return;
      if (drag.moved) {
        st.target = bound(Math.round(st.target));
        root.addEventListener("click", (c) => c.stopPropagation(), { capture: true, once: true });
      }
      drag = null;
    };

    root.addEventListener("wheel", onWheel, { passive: false });
    root.addEventListener("pointerdown", onDown);
    root.addEventListener("pointermove", onMove);
    root.addEventListener("pointerup", onUp);
    root.addEventListener("pointercancel", onUp);
    return () => {
      root.removeEventListener("wheel", onWheel);
      root.removeEventListener("pointerdown", onDown);
      root.removeEventListener("pointermove", onMove);
      root.removeEventListener("pointerup", onUp);
      root.removeEventListener("pointercancel", onUp);
      clearTimeout(snap);
    };
  }, [n]);

  useEffect(() => {
    const root = rootRef.current;
    const cur = cursorRef.current;
    if (!root || !cur) return;
    const x = gsap.quickTo(cur, "x", { duration: reduced() ? 0 : 0.35, ease: "power3.out" });
    const y = gsap.quickTo(cur, "y", { duration: reduced() ? 0 : 0.35, ease: "power3.out" });
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      const r = root.getBoundingClientRect();
      x(e.clientX - r.left);
      y(e.clientY - r.top);
    };
    root.addEventListener("pointermove", onMove);
    return () => root.removeEventListener("pointermove", onMove);
  }, []);

  const setLift = (k: number) => {
    const st = state.current;
    st.want = k;
    if (k >= 0) st.hover = k;
    setHover(k);
  };

  const go = (d: number) => {
    const st = state.current;
    const next = Math.round(st.target) + d;
    st.target = loopRef.current ? next : clamp(next, 0, n - 1);
  };

  const shown = hover >= 0 ? hover : front;
  const card = cards[shown];

  return (
    <div
      ref={rootRef}
      role="region"
      aria-label={ariaLabel}
      tabIndex={0}
      className={`cs-root${hover >= 0 ? " cs-lifting" : ""}${className ? ` ${className}` : ""}`}
      style={{ "--cs-h": height } as CSSProperties}
      onKeyDown={(e) => {
        if (e.key === "ArrowDown" || e.key === "PageDown") {
          e.preventDefault();
          go(1);
        } else if (e.key === "ArrowUp" || e.key === "PageUp") {
          e.preventDefault();
          go(-1);
        }
      }}
    >
      <style>{CSS}</style>

      <div className="cs-stage">
        {cards.map((c, k) => (
          <button
            key={`${c.title}-${k}`}
            ref={(el) => {
              cardRefs.current[k] = el;
            }}
            type="button"
            className={`cs-card${k === hover ? " cs-on" : ""}`}
            aria-label={`${c.title}, ${c.category}`}
            tabIndex={k === front ? 0 : -1}
            onPointerEnter={(e) => e.pointerType === "mouse" && setLift(k)}
            onPointerLeave={(e) => {
              if (e.pointerType !== "mouse" || state.current.want !== k) return;
              const next = e.relatedTarget;
              if (next instanceof Element && next.closest(".cs-card")) return;
              setLift(-1);
            }}
            onFocus={() => setLift(k)}
            onBlur={() => setLift(-1)}
            onClick={() => {
              if (hover !== k) {
                setLift(k);
                return;
              }
              onSelect?.(c, k);
              if (c.href) window.location.href = c.href;
            }}
          >
            <span className="cs-card-in">
              {chrome ? (
                <span className="cs-chrome" aria-hidden>
                  <i />
                  <i />
                  <i />
                </span>
              ) : null}
              {c.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={c.image} alt="" draggable={false} />
              ) : null}
            </span>
          </button>
        ))}
      </div>

      <div className="cs-label cs-left" aria-live="polite">
        <span className="cs-mono">{hover >= 0 ? card?.category : `${shown + 1} / ${n}`}</span>
        <span className="cs-big">{hover >= 0 ? card?.title : card?.category}</span>
      </div>
      <div className="cs-label cs-right">
        <span className="cs-big">
          {n} {countLabel}
        </span>
      </div>
      {tagline ? (
        <div className="cs-mono cs-tag">
          {tagline[0]}
          <br />
          {tagline[1]}
        </div>
      ) : null}
      {ctaLabel ? (
        <a className="cs-mono cs-cta" href={ctaHref}>
          <span aria-hidden="true">↳</span> {ctaLabel}
        </a>
      ) : null}

      <div ref={cursorRef} className="cs-cursor" aria-hidden="true">
        <span>
          {cursorLabel}
          <svg viewBox="0 0 12 12" width="12" height="12">
            <path d="M2 1l9 5-4 1-2 4z" fill="currentColor" />
          </svg>
        </span>
      </div>
    </div>
  );
}

const CSS = `
.cs-root{position:relative;height:var(--cs-h);min-height:420px;width:100%;overflow:hidden;background:transparent;color:#fff;font-family:var(--font-unbounded),ui-sans-serif,system-ui,sans-serif;container:cs/inline-size;user-select:none;-webkit-user-select:none;outline:none}
.cs-root:focus-visible{box-shadow:inset 0 0 0 2px #2b4fe0}
.cs-root img{max-width:none}
.cs-stage{position:absolute;inset:0;perspective:1100px;perspective-origin:50% 0%;touch-action:pan-x}
.cs-card{position:absolute;left:50%;top:88%;width:var(--cs-cw);height:var(--cs-ch);margin-top:calc(var(--cs-ch) / -2);padding:0;border:0;background:#070b16;border-radius:18px;overflow:hidden;cursor:pointer;transform-origin:50% 50%;backface-visibility:hidden;will-change:transform;outline:none;box-shadow:0 0 0 1px rgba(255,255,255,.14),0 24px 70px -24px rgba(0,0,0,.85)}
.cs-card::after{content:"";position:absolute;inset:0;background:#000;opacity:var(--cs-shade,0);pointer-events:none;transition:opacity .2s}
.cs-card:focus-visible{outline:2px solid #2b4fe0;outline-offset:4px}
.cs-card-in{position:absolute;inset:0;overflow:hidden;display:flex;flex-direction:column}
.cs-chrome{display:flex;align-items:center;gap:6px;flex-shrink:0;height:28px;padding:0 12px;border-bottom:1px solid rgba(255,255,255,.1);background:rgba(255,255,255,.04)}
.cs-chrome i{width:6px;height:6px;border-radius:50%;display:block}
.cs-chrome i:nth-child(1){background:rgba(255,95,87,.8)}
.cs-chrome i:nth-child(2){background:rgba(254,188,46,.8)}
.cs-chrome i:nth-child(3){background:rgba(40,200,64,.8)}
.cs-card-in img{width:100%;flex:1;min-height:0;object-fit:cover;object-position:top;display:block}
.cs-root.cs-lifting .cs-card.cs-on{cursor:none}
.cs-label{position:absolute;top:50%;transform:translateY(-50%);display:flex;flex-direction:column;gap:.35rem;pointer-events:none;z-index:20}
.cs-left{left:clamp(16px,2.4cqw,36px)}
.cs-right{right:clamp(16px,2.4cqw,36px);text-align:right}
.cs-big{font-size:clamp(15px,1.35cqw,22px);font-weight:500;letter-spacing:-.01em;line-height:1.1}
.cs-mono{font-family:var(--font-jetbrains),ui-monospace,monospace;font-size:clamp(9px,.68cqw,11px);letter-spacing:.04em;text-transform:uppercase;line-height:1.45;color:#7c9bff}
.cs-tag{position:absolute;left:clamp(16px,2.4cqw,36px);bottom:clamp(16px,2.6cqw,34px);z-index:20;pointer-events:none}
.cs-cta{position:absolute;right:clamp(16px,2.4cqw,36px);bottom:clamp(14px,2.4cqw,30px);z-index:20;color:inherit;text-decoration:none;padding:.5em .85em;background:rgba(255,255,255,.07);border-radius:3px;transition:background-color .2s}
.cs-cta:hover{background:rgba(255,255,255,.14)}
.cs-cursor{position:absolute;left:0;top:0;z-index:30;pointer-events:none;width:0;height:0}
.cs-cursor span{position:absolute;left:-58px;top:-58px;width:116px;height:116px;border-radius:50%;background:#2b4fe0;color:#fff;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:6px;font-family:var(--font-unbounded),ui-sans-serif,sans-serif;font-size:11px;letter-spacing:.06em;text-align:center;line-height:1.2;padding:0 18px;transform:scale(0);transition:transform .35s cubic-bezier(.2,.8,.2,1);box-shadow:0 12px 40px rgba(43,79,224,.45)}
.cs-root.cs-lifting .cs-cursor span{transform:scale(1)}
@media (hover: none){.cs-cursor{display:none}}
@container cs (max-width: 720px){
  .cs-stage{top:64px;bottom:72px;overflow:hidden}
  .cs-card{top:82%}
  .cs-label{top:clamp(16px,4cqw,28px);transform:none}
  .cs-big{font-size:15px}
}
@media (prefers-reduced-motion: reduce){
  .cs-cursor span,.cs-card::after,.cs-cta{transition:none}
}
`;
