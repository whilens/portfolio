"use client";

import { useState } from "react";
import { CaseShell } from "@/components/cases/CaseShell";
import { Reveal } from "@/components/Reveal";

const skills = [
  {
    title: "Поиск подрядчиков",
    text: "Собираем пул исполнителей под задачу и сроки, без холодных обзвонов вручную.",
  },
  {
    title: "Сопровождение сделки",
    text: "Документы, этапы и контроль качества — заказчик видит движение проекта.",
  },
  {
    title: "Лидогенерация",
    text: "Сайт квалифицирует заявку до звонка: объём, город, тип работ.",
  },
];

const strip = [
  "/cases/stroy/1.png",
  "/cases/stroy/2.png",
  "/cases/stroy/3.png",
  "/cases/stroy/4.png",
];

export function CaseStroy() {
  const [open, setOpen] = useState(0);

  return (
    <CaseShell slug="stroy" className="bg-[#102016]">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 pb-20 lg:grid-cols-2">
        <div>
          {skills.map((skill, i) => (
            <button
              key={skill.title}
              type="button"
              onClick={() => setOpen(i)}
              className="w-full border-b border-white/10 py-5 text-left"
            >
              <div className="flex items-center justify-between font-display text-xl">
                {skill.title}
                <span className="text-ice">{open === i ? "−" : "+"}</span>
              </div>
              <div
                className="grid transition-[grid-template-rows] duration-300"
                style={{ gridTemplateRows: open === i ? "1fr" : "0fr" }}
              >
                <div className="overflow-hidden">
                  <p className="pt-2 text-mist">{skill.text}</p>
                </div>
              </div>
            </button>
          ))}
        </div>
        <Reveal>
          <div className="flex gap-4 overflow-x-auto pb-4">
            {strip.map((src) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={src}
                src={src}
                alt=""
                className="h-56 w-40 shrink-0 rounded-2xl object-cover"
              />
            ))}
          </div>
        </Reveal>
      </div>
    </CaseShell>
  );
}
