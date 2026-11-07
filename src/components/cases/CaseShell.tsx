import type { ReactNode } from "react";
import { projects } from "@/data/projects";

export function CaseShell({
  slug,
  children,
  className = "",
}: {
  slug: string;
  children: ReactNode;
  className?: string;
}) {
  const project = projects.find((item) => item.slug === slug);
  if (!project) return null;

  return (
    <section id={`case-${slug}`} className={`relative ${className}`}>
      <div className="mx-auto max-w-7xl px-6 pb-6 pt-20">
        <p className="font-mono text-[13px] tracking-[0.12em] text-ice">КЕЙС / {project.title}</p>
        <h2 className="mt-3 max-w-3xl font-display text-[clamp(28px,3.6vw,48px)] font-extrabold">
          {project.summary}
        </h2>
      </div>
      {children}
    </section>
  );
}
