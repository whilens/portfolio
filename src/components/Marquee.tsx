import { servicesMarquee } from "@/data/projects";

export function Marquee() {
  const items = [...servicesMarquee, ...servicesMarquee];
  return (
    <div className="overflow-hidden border-y border-white/10 bg-navy py-5">
      <div className="pf-track flex w-max gap-12 font-display text-[22px] font-semibold text-[#DCE3F5]">
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
