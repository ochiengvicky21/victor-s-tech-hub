import { ArrowUpRight, Building2, Facebook, Globe, GraduationCap, Layers3 } from "lucide-react";
import { Section } from "./Section";
import type { PortfolioProject, SiteSection } from "@/lib/site-content";

function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.07A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43V8.93a8.16 8.16 0 0 0 4.77 1.52V7a4.85 4.85 0 0 1-1.04-.31z" />
    </svg>
  );
}

export function ClientWorkSection({
  projects,
  section,
}: {
  projects: PortfolioProject[];
  section: SiteSection;
}) {
  return (
    <Section
      id="client-work"
      eyebrow={section.eyebrow}
      title={section.title}
      description={section.description}
    >
      <div className="grid gap-5 sm:grid-cols-2">
        {projects.map((project, index) => (
          <article key={project.id} className="tech-card group flex h-full flex-col p-5 sm:p-7">
            <div
              aria-hidden="true"
              className="project-preview relative mb-6 overflow-hidden rounded-xl border border-white/10 bg-[var(--navy)] p-5 sm:p-6"
            >
              <div className="project-preview-grid absolute inset-0 opacity-70" />
              <div className="relative flex items-center justify-between gap-4">
                <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/50">
                  Project // {String(index + 1).padStart(2, "0")}
                </span>
                <span className="rounded-md border border-white/10 bg-black/20 px-2.5 py-1 font-mono text-[9px] uppercase tracking-wider text-white/60">
                  {project.category.split("·")[0].trim()}
                </span>
              </div>
              <div className="relative mt-8 flex min-h-20 items-end justify-between gap-4">
                <div>
                  <p className="max-w-[16rem] font-mono text-lg font-semibold leading-snug text-white sm:text-xl">
                    {project.client}
                  </p>
                  <p className="mt-2 font-mono text-[10px] text-electric">
                    {project.capabilities[0]}
                  </p>
                </div>
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-electric/25 bg-electric/10 text-electric shadow-[0_0_30px_oklch(0.67_0.25_300_/_0.12)]">
                  {project.category.toLowerCase().includes("education") ? (
                    <GraduationCap className="h-5 w-5" />
                  ) : project.category.toLowerCase().includes("hospitality") ? (
                    <Building2 className="h-5 w-5" />
                  ) : (
                    <Layers3 className="h-5 w-5" />
                  )}
                </span>
              </div>
            </div>
            <div className="flex items-start justify-between gap-4">
              <span className="font-mono text-xs text-ink-soft">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span className="rounded-lg border border-rule bg-surface px-3 py-1.5 font-mono text-[10px] uppercase tracking-wider text-ink-soft">
                {project.category}
              </span>
            </div>

            <p className="eyebrow mt-6">{project.client}</p>
            <h3 className="mt-2 font-mono text-xl font-semibold leading-snug tracking-tight text-ink sm:text-2xl">
              {project.title}
            </h3>
            <p className="mt-3 text-sm leading-relaxed ink-soft">{project.description}</p>

            <ul className="mt-5 flex flex-wrap gap-2">
              {project.capabilities.map((capability) => (
                <li
                  key={capability}
                  className="rounded-lg border border-rule bg-surface/70 px-2.5 py-1 text-xs text-ink-soft"
                >
                  {capability}
                </li>
              ))}
            </ul>

            <div className="mt-auto flex flex-wrap gap-x-5 gap-y-3 pt-6">
              {project.links.map((link) => {
                return (
                  <a
                    key={link.href}
                    href={link.href}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-ink transition-colors hover:text-electric"
                  >
                    {link.icon === "tiktok" ? (
                      <TikTokIcon className="h-4 w-4" />
                    ) : link.icon === "facebook" ? (
                      <Facebook className="h-4 w-4" />
                    ) : (
                      <Globe className="h-4 w-4" />
                    )}
                    {link.label}
                    <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </a>
                );
              })}
            </div>
          </article>
        ))}
      </div>
    </Section>
  );
}
