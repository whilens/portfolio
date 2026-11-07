import { servicesMarquee } from "@/data/projects";

export function Marquee() {
  const items = [...servicesMarquee, ...servicesMarquee];
  return (
    <div className="overflow-hidden border-y border-white/10 bg-navy py-3 sm:py-5">
      <div className="pf-track flex w-max gap-8 font-display text-[16px] font-semibold text-[#DCE3F5] sm:gap-12 sm:text-[22px]">
        {items.map((item, i) => (
          <span key={`${item}-${i}`} className="flex items-center gap-12">
            {item}
            <span className="text-ice">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}
