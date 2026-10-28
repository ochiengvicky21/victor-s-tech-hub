import { useState } from "react";
import { ArrowUpRight, Layers3 } from "lucide-react";
import { Section } from "./Section";
import type { PortfolioProject } from "@/lib/site-content";

export function TimelineSection({ projects }: { projects: PortfolioProject[] }) {
  const [selectedId, setSelectedId] = useState(projects[0]?.id ?? "");
  const selectedProject = projects.find((project) => project.id === selectedId) ?? projects[0];

  if (!selectedProject) return null;

  return (
    <Section
      eyebrow="// build timeline"
      title={
        <>
          Project <span className="serif-italic text-electric">field notes.</span>
        </>
      }
      description="Select a project to explore its focus, capabilities, and live links."
    >
      <div role="tablist" aria-label="Portfolio projects" className="flex flex-wrap gap-2">
        {projects.map((project) => (
          <button
            key={project.id}
            id={`project-tab-${project.id}`}
            type="button"
            role="tab"
            aria-selected={project.id === selectedProject.id}
            aria-controls={`project-panel-${project.id}`}
            tabIndex={project.id === selectedProject.id ? 0 : -1}
            onClick={() => setSelectedId(project.id)}
            onKeyDown={(event) => {
              const tabs =
                event.currentTarget.parentElement?.querySelectorAll<HTMLButtonElement>(
                  '[role="tab"]',
                );
              if (!tabs?.length) return;
              const currentIndex = Array.from(tabs).indexOf(event.currentTarget);
              let nextIndex: number | undefined;
              if (event.key === "ArrowRight") nextIndex = (currentIndex + 1) % tabs.length;
              if (event.key === "ArrowLeft")
                nextIndex = (currentIndex - 1 + tabs.length) % tabs.length;
              if (event.key === "Home") nextIndex = 0;
              if (event.key === "End") nextIndex = tabs.length - 1;
              if (nextIndex !== undefined) {
                event.preventDefault();
                tabs[nextIndex].focus();
                setSelectedId(projects[nextIndex].id);
              }
            }}
            className="timeline-tab rounded-lg border border-white/10 bg-white/[0.03] px-4 py-2.5 font-mono text-xs text-white/60 transition hover:border-electric/50 hover:text-white"
          >
            {project.client}
          </button>
        ))}
      </div>

      <article
        id={`project-panel-${selectedProject.id}`}
        role="tabpanel"
        aria-labelledby={`project-tab-${selectedProject.id}`}
        className="mt-5 grid gap-8 overflow-hidden rounded-2xl border border-white/10 bg-[var(--surface)] p-6 sm:p-8 lg:grid-cols-[1.05fr_0.95fr] lg:p-10"
      >
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-electric">
            {selectedProject.category}
          </p>
          <h3 className="mt-4 font-mono text-2xl font-bold leading-tight tracking-tight text-white sm:text-3xl">
            {selectedProject.title}
          </h3>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-ink-soft sm:text-base">
            {selectedProject.description}
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            {selectedProject.capabilities.map((capability) => (
              <span
                key={capability}
                className="rounded-md border border-white/10 bg-white/[0.04] px-3 py-2 font-mono text-[10px] text-white/75"
              >
                {capability}
              </span>
            ))}
          </div>
          <div className="mt-7 flex flex-wrap gap-4">
            {selectedProject.links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-electric hover:text-white"
              >
                {link.label} <ArrowUpRight className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>

        <div className="relative flex min-h-56 items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-[var(--navy)] p-6">
          <div className="absolute inset-0 opacity-60 [background-image:linear-gradient(oklch(1_0_0_/_0.045)_1px,transparent_1px),linear-gradient(90deg,oklch(1_0_0_/_0.045)_1px,transparent_1px)] [background-size:24px_24px]" />
          <div className="relative w-full max-w-sm rounded-xl border border-white/10 bg-black/35 p-5 shadow-2xl backdrop-blur-sm">
            <div className="flex items-center gap-2 border-b border-white/10 pb-4">
              <span className="h-2 w-2 rounded-full bg-electric" />
              <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-white/45">
                build // {selectedProject.id}
              </span>
            </div>
            <div className="mt-5 flex items-center gap-4">
              <span className="flex h-12 w-12 items-center justify-center rounded-xl border border-electric/30 bg-electric/10 text-electric">
                <Layers3 className="h-5 w-5" />
              </span>
              <div>
                <p className="font-mono text-xs text-white/45">CLIENT</p>
                <p className="mt-1 font-mono text-sm font-semibold text-white">
                  {selectedProject.client}
                </p>
              </div>
            </div>
            <p className="mt-5 border-l border-electric/50 pl-3 font-mono text-xs leading-relaxed text-white/60">
              {selectedProject.capabilities.slice(0, 3).join("  /  ")}
            </p>
          </div>
        </div>
      </article>
    </Section>
  );
}
