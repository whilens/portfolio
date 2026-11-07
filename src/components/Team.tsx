import { Reveal } from "@/components/Reveal";

export function Team() {
  return (
    <section id="team" className="px-6 pb-32 pt-10">
      <div className="mx-auto max-w-7xl">
        <Reveal>
          <p className="mb-4 font-mono text-[13px] tracking-[0.12em] text-ice">04 / КОМАНДА</p>
          <h2 className="font-display text-[clamp(34px,4.4vw,60px)] font-extrabold leading-[1.05]">
            Двое разработчиков.
            <br />
            Без менеджеров-посредников.
          </h2>
        </Reveal>
        <div className="mt-16 grid gap-6 md:grid-cols-2">
          <Reveal>
            <article className="flex flex-wrap items-center gap-6 rounded-[28px] border border-white/10 bg-ink-2 p-9 transition hover:-translate-y-1 hover:border-ice/40">
              <div className="grid size-[104px] place-items-center rounded-[28px] bg-gradient-to-br from-blue to-[#0B1B4D] font-display text-[34px] font-extrabold">
                ВА
              </div>
              <div className="min-w-[200px] flex-1">
                <h3 className="font-display text-[22px] font-semibold">Валихан Абдурахманов</h3>
                <p className="mt-2 text-[15px] text-ice">[Роль, например: fullstack-разработчик]</p>
                <p className="mt-3 text-[15px] leading-relaxed text-mist">
                  [Пара слов о себе и стеке]
                </p>
              </div>
            </article>
          </Reveal>
          <Reveal delay={0.1}>
            <article className="flex flex-wrap items-center gap-6 rounded-[28px] border border-white/10 bg-ink-2 p-9 transition hover:-translate-y-1 hover:border-ice/40">
              <div className="grid size-[104px] place-items-center rounded-[28px] bg-gradient-to-br from-white to-ice font-display text-[34px] font-extrabold text-ink">
                [И]
              </div>
              <div className="min-w-[200px] flex-1">
                <h3 className="font-display text-[22px] font-semibold">[Имя коллеги]</h3>
                <p className="mt-2 text-[15px] text-ice">[Роль коллеги]</p>
                <p className="mt-3 text-[15px] leading-relaxed text-mist">
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
