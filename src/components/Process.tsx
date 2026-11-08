import { Reveal } from "@/components/Reveal";

const steps = [
  {
    n: "01",
    title: "Бесплатная консультация",
    text: "Объясняем простыми словами: что сделать, сколько стоит, сколько займёт и почему именно так.",
  },
  {
    n: "02",
    title: "Уникальный дизайн",
    text: "Рисуем под ваш бренд и ваших клиентов — никаких шаблонов. Правки до полного согласия.",
  },
  {
    n: "03",
    title: "Разработка",
    text: "Пишем код с нуля, поэтому сайт работает быстрее конструкторов. Показываем прогресс по ходу.",
  },
  {
    n: "04",
    title: "Запуск и поддержка",
    text: "Публикуем проект и поддерживаем его в оговорённый срок: исправления, обновления, советы.",
  },
];

export function Process() {
  return (
    <section id="process" className="px-5 py-16 sm:px-6 sm:py-24">
      <div className="mx-auto max-w-7xl">
        <Reveal>
          <p className="mb-4 font-mono text-[13px] tracking-[0.12em] text-blue">03 / КАК МЫ РАБОТАЕМ</p>
          <h2 className="max-w-3xl font-display text-[clamp(28px,4vw,52px)] font-extrabold leading-[1.05]">
            От идеи до запуска — всегда на связи
          </h2>
        </Reveal>
        <div className="mt-12 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {steps.map((step, i) => (
            <Reveal key={step.n} delay={i * 0.08}>
              <article className="flex min-h-[240px] flex-col rounded-3xl border border-[#d8d3ca] bg-white p-8">
                <div className="font-display text-5xl font-extrabold text-blue/35">{step.n}</div>
                <h3 className="mt-auto font-display text-xl font-semibold">{step.title}</h3>
                <p className="mt-3 text-[15px] leading-relaxed text-[#5c6474]">{step.text}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
