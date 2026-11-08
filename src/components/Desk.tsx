import { type ReactNode } from "react";

export function Desk({ children }: { children: ReactNode }) {
  return (
    <div
      id="desk"
      data-light-section
      className="desk relative z-20 rounded-t-[28px] bg-[#f3f1ec] text-ink shadow-[0_-48px_90px_rgba(0,0,0,0.45)] sm:rounded-t-[40px]"
    >
      {children}
    </div>
  );
}
