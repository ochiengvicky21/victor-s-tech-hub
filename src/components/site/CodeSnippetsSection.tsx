import { ArrowUpRight, Code2, ExternalLink } from "lucide-react";
import { Section } from "./Section";
import type { FetchedCodeSnippet } from "@/lib/site-content";

export function CodeSnippetsSection({ snippets }: { snippets: FetchedCodeSnippet[] }) {
  if (snippets.length === 0) return null;

  return (
    <Section
      eyebrow="// open-source field notes"
      title={
        <>
          Code worth <span className="serif-italic text-electric">studying.</span>
        </>
      }
      description="Small, attributed excerpts from public open-source repositories. Each source and its license are linked."
    >
      <div className="grid gap-5 lg:grid-cols-2">
        {snippets.map((snippet, index) => (
          <article key={snippet.id} className="code-card overflow-hidden">
            <header className="flex items-start justify-between gap-4 border-b border-white/10 px-5 py-4">
              <div className="min-w-0">
                <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-cyan-300">
                  snippet // {String(index + 1).padStart(2, "0")}
                </p>
                <h3 className="mt-1 truncate text-base font-semibold text-white">
                  {snippet.title}
                </h3>
                {snippet.description && (
                  <p className="mt-1 text-sm leading-relaxed text-white/60">
                    {snippet.description}
                  </p>
                )}
              </div>
              <Code2 className="mt-1 h-5 w-5 shrink-0 text-cyan-300" />
            </header>

            {snippet.code !== null ? (
              <pre className="max-h-72 overflow-auto px-5 py-4 text-xs leading-relaxed text-slate-200 sm:text-sm">
                <code>{snippet.code}</code>
              </pre>
            ) : (
              <p role="status" className="px-5 py-6 text-sm text-amber-200/90">
                This source could not be loaded: {snippet.error}
              </p>
            )}

            {snippet.code !== null && snippet.error && (
              <p className="px-5 pb-2 text-xs text-white/45">{snippet.error}</p>
            )}

            <footer className="flex flex-wrap items-center justify-between gap-3 border-t border-white/10 px-5 py-3">
              <a
                href={snippet.licenseUrl}
                target="_blank"
                rel="noreferrer"
                className="text-xs text-white/55 underline decoration-white/25 underline-offset-4 transition-colors hover:text-white"
              >
                License: {snippet.license}
              </a>
              <a
                href={snippet.sourceUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-medium text-cyan-200 transition-colors hover:text-white"
              >
                View source <ExternalLink className="h-3.5 w-3.5" />
                <ArrowUpRight className="h-3 w-3" />
              </a>
            </footer>
          </article>
        ))}
      </div>
    </Section>
  );
}
