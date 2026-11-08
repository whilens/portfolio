import { Reveal } from "@/components/Reveal";

export function Manifesto() {
  return (
    <div className="px-5 py-10 sm:px-6 sm:py-14">
      <Reveal className="mx-auto max-w-7xl">
        <p className="max-w-3xl font-display text-[clamp(22px,3.1vw,36px)] font-semibold leading-[1.22] tracking-[-0.02em] text-[#E8EDF8]">
          Сильный сайт не украшает компанию — он{" "}
          <span className="text-ice">закрывает сделки за вас</span>.
        </p>
      </Reveal>
    </div>
  );
}
