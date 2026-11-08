import { Reveal } from "@/components/Reveal";

export function Team() {
  return (
    <section id="team" className="px-5 py-10 sm:px-6 sm:py-16">
      <div className="mx-auto max-w-7xl">
        <Reveal>
          <p className="mb-4 font-mono text-[13px] tracking-[0.12em] text-blue">04 / КОМАНДА</p>
          <h2 className="font-display text-[clamp(28px,4vw,52px)] font-extrabold leading-[1.05]">
            Двое разработчиков.
            <br />
            Без менеджеров-посредников.
          </h2>
        </Reveal>
        <div className="mt-12 grid gap-6 md:grid-cols-2">
          <Reveal>
            <article className="flex flex-wrap items-center gap-6 rounded-[28px] border border-[#d8d3ca] bg-white p-6 sm:p-9">
              <div className="grid size-[104px] place-items-center rounded-[28px] bg-gradient-to-br from-blue to-[#0B1B4D] font-display text-[34px] font-extrabold text-white">
                ВА
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="break-words font-display text-[22px] font-semibold">Валихан Абдурахманов</h3>
                <p className="mt-2 text-[15px] text-blue">[Роль, например: fullstack-разработчик]</p>
                <p className="mt-3 text-[15px] leading-relaxed text-[#5c6474]">
                  [Пара слов о себе и стеке]
                </p>
              </div>
            </article>
          </Reveal>
          <Reveal delay={0.1}>
            <article className="flex flex-wrap items-center gap-6 rounded-[28px] border border-[#d8d3ca] bg-white p-6 sm:p-9">
              <div className="grid size-[104px] place-items-center rounded-[28px] bg-gradient-to-br from-[#dbe4ff] to-ice font-display text-[34px] font-extrabold text-ink">
                [И]
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="font-display text-[22px] font-semibold">[Имя коллеги]</h3>
                <p className="mt-2 text-[15px] text-blue">[Роль коллеги]</p>
                <p className="mt-3 text-[15px] leading-relaxed text-[#5c6474]">
                  [Пара слов о коллеге и стеке]
                </p>
              </div>
            </article>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
