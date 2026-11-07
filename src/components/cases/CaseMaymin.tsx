"use client";

import { useRef, useState } from "react";
import { BackgroundVideo } from "@/components/BackgroundVideo";
import { CaseShell } from "@/components/cases/CaseShell";

const screens = [
  "Главная",
  "Решения",
  "Задачи",
  "Расчёт",
  "Услуги",
  "IT-решения",
  "Функционал",
  "3D-модель",
];

export function CaseMaymin() {
  const [screen, setScreen] = useState(0);
  const areaRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ x: 40, y: 40 });

  return (
    <CaseShell slug="maymin" className="bg-[#1a0f0c]">
      <div
        ref={areaRef}
        className="relative mx-6 mb-20 min-h-[80vh] overflow-hidden rounded-[28px] border border-white/10"
        onMouseMove={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          setPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
        }}
      >
        <BackgroundVideo src="/videos/progresco.webm" poster="/posters/maymin.png" />
        <div className="absolute inset-0 bg-black/45" />
        <aside className="absolute left-6 top-1/2 z-10 hidden -translate-y-1/2 flex-col gap-3 md:flex">
          <div className="font-mono text-xs text-white/70">
            {String(screen + 1).padStart(2, "0")}
          </div>
          <div className="h-40 overflow-hidden">
            <div
              className="flex flex-col gap-2 transition-transform duration-500"
              style={{ transform: `translateY(${-screen * 22}px)` }}
            >
              {screens.map((name, i) => (
                <button
                  key={name}
                  type="button"
                  onClick={() => setScreen(i)}
                  className={`text-left text-sm ${i === screen ? "text-white" : "text-white/35"}`}
                >
                  {name}
                </button>
              ))}
            </div>
          </div>
        </aside>
        <div className="absolute bottom-10 left-10 right-10 z-10 max-w-xl">
          <p className="font-mono text-xs tracking-[0.16em] text-[#F48C71]">PROGRESCO</p>
          <h3 className="mt-3 font-display text-4xl font-semibold">{screens[screen]}</h3>
          <p className="mt-3 text-mist">
            Боковая пагинация ведёт по экранам, а кнопка следует за курсором внутри кадра.
          </p>
        </div>
        <div
          className="pointer-events-none absolute z-20 hidden md:block"
          style={{
            left: pos.x,
            top: pos.y,
            transform: "translate(-50%, -50%)",
          }}
        >
          <div className="grid size-28 place-items-center rounded-full border border-[#D75B3B] bg-[#D75B3B]/80 text-center text-xs font-semibold">
            Оставить
            <br />
            заявку
          </div>
        </div>
      </div>
    </CaseShell>
  );
}
