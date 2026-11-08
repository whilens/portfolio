import { Reveal } from "@/components/Reveal";

const stats = [
  { value: "от 5 дней", label: "запуск сайта-визитки" },
  { value: "от 10 000 ₽", label: "стоимость сайта" },
  { value: "0 ₽", label: "первая консультация" },
];

const items = [
  {
    kicker: "САЙТ",
    title: "Сайт-визитка",
    text: "Услуги, цены, портфолио, онлайн-запись или заявка, кнопки мессенджеров.",
    price: "от 10 000 ₽",
    time: "от 5 дней",
    dark: false,
  },
  {
    kicker: "ПРИЛОЖЕНИЕ",
    title: "Мобильное приложение",
    text: "iOS и Android: запись, заказы, бонусы и push-уведомления для постоянных клиентов.",
    price: "от 30 000 ₽",
    time: "от 15 дней",
    dark: true,
  },
  {
    kicker: "СЛОЖНЫЕ ПРОЕКТЫ",
    title: "Магазины и платформы",
    text: "Интернет-магазины, ИИ-консультанты, личные кабинеты, микросервисы.",
    price: "[цена]",
    time: "по задаче",
    dark: false,
  },
];

export function Services() {
  return (
    <section id="services" className="px-5 pb-8 pt-20 sm:px-6 sm:pt-28">
      <div className="mx-auto max-w-7xl">
        <Reveal>
          <p className="mb-3 font-mono text-[13px] tracking-[0.12em] text-blue">Стол сделки</p>
          <p className="max-w-3xl font-display text-[clamp(26px,3.4vw,42px)] font-semibold leading-[1.2] tracking-[-0.02em]">
            Сильный сайт не украшает компанию — он{" "}
            <span className="text-blue">закрывает сделки за вас</span>.
          </p>
        </Reveal>

        <Reveal delay={0.08}>
          <p className="mb-4 mt-16 font-mono text-[13px] tracking-[0.12em] text-blue">02 / УСЛУГИ И ЦЕНЫ</p>
          <h2 className="max-w-3xl font-display text-[clamp(28px,4vw,52px)] font-extrabold leading-[1.05] tracking-[-0.02em]">
            Понятные цифры до старта работы
          </h2>
          <div className="mt-10 grid gap-5 sm:grid-cols-3 sm:gap-8">
            {stats.map((item) => (
              <div key={item.label} className="border-t border-[#d8d3ca] pt-5">
                <div className="font-display text-[clamp(28px,3.6vw,44px)] font-extrabold tracking-[-0.03em]">
                  {item.value}
                </div>
                <div className="mt-2 text-sm text-[#5c6474]">{item.label}</div>
              </div>
            ))}
          </div>
        </Reveal>

        <div className="mt-14 grid gap-5 md:grid-cols-3">
          {items.map((item, i) => (
            <Reveal key={item.title} delay={i * 0.08}>
              <article
                className={`relative flex min-h-[240px] flex-col gap-4 overflow-hidden rounded-[28px] p-8 ${
                  item.dark ? "bg-ink text-white" : "border border-[#d8d3ca] bg-white"
                }`}
              >
                <div className={`font-mono text-[13px] ${item.dark ? "text-ice" : "text-[#5c6474]"}`}>
                  {item.kicker}
                </div>
                <h3 className="font-display text-[24px] font-semibold">{item.title}</h3>
                <p className={`text-[15px] leading-relaxed ${item.dark ? "text-mist" : "text-[#5c6474]"}`}>
                  {item.text}
                </p>
                <div
                  className={`mt-auto flex flex-wrap items-baseline justify-between gap-2 border-t pt-5 ${
                    item.dark ? "border-white/15" : "border-[#d8d3ca]"
                  }`}
                >
                  <span className="font-display text-[26px] font-extrabold">{item.price}</span>
                  <span className={item.dark ? "text-mist" : "text-[#5c6474]"}>{item.time}</span>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
