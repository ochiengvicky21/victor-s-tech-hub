import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { Section } from "@/components/site/Section";
import { RepoCard } from "@/components/site/RepoCard";
import { fetchGhRepos } from "@/lib/github";

export const Route = createFileRoute("/projects")({
  head: () => ({
    meta: [
      { title: "Projects — Ochieng Victor Otieno" },
      { name: "description", content: "Live feed of public repositories from github.com/ochiengvicky21. Search and filter by language." },
      { property: "og:title", content: "Projects — Ochieng Victor Otieno" },
      { property: "og:description", content: "Live feed of public GitHub repositories." },
    ],
  }),
  component: Projects,
});

function Projects() {
  const repos = useQuery({ queryKey: ["gh", "repos"], queryFn: fetchGhRepos, staleTime: 5 * 60_000 });
  const [q, setQ] = useState("");
  const [lang, setLang] = useState<string | null>(null);

  const languages = useMemo(() => {
    const set = new Set<string>();
    repos.data?.forEach((r) => r.language && set.add(r.language));
    return Array.from(set).sort();
  }, [repos.data]);

  const filtered = useMemo(() => {
    return (repos.data ?? []).filter((r) => {
      if (lang && r.language !== lang) return false;
      if (q && !`${r.name} ${r.description ?? ""} ${r.topics.join(" ")}`.toLowerCase().includes(q.toLowerCase())) return false;
      return true;
    });
  }, [repos.data, q, lang]);

  return (
    <Section
      eyebrow="// live from github"
      title="All projects"
      description="Auto-synced from github.com/ochiengvicky21. Updates as I push."
    >
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="glass glow-border flex flex-1 items-center gap-2 rounded-xl px-3 py-2">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search projects…"
            className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setLang(null)}
            className={`rounded-lg px-3 py-1.5 text-xs font-mono transition-colors ${lang === null ? "bg-electric text-primary-foreground" : "glass text-muted-foreground hover:text-foreground"}`}
          >
            ALL
          </button>
          {languages.map((l) => (
            <button
              key={l}
              onClick={() => setLang(l)}
              className={`rounded-lg px-3 py-1.5 text-xs font-mono transition-colors ${lang === l ? "bg-electric text-primary-foreground" : "glass text-muted-foreground hover:text-foreground"}`}
            >
              {l}
            </button>
          ))}
        </div>
      </div>

      {repos.isLoading && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 9 }).map((_, i) => (
            <div key={i} className="glass h-44 animate-pulse rounded-2xl" />
          ))}
        </div>
      )}

      {repos.isError && (
        <div className="glass rounded-2xl p-6 text-sm text-muted-foreground">
          Couldn&apos;t reach GitHub right now. Try again in a moment.
        </div>
      )}

      {repos.isSuccess && (
        <>
          {filtered.length === 0 ? (
            <div className="glass rounded-2xl p-6 text-sm text-muted-foreground">
              No projects match your filters.
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((r) => <RepoCard key={r.id} repo={r} />)}
            </div>
          )}
          <p className="mt-6 text-center font-mono text-xs text-muted-foreground">
            {filtered.length} of {repos.data.length} repositories
          </p>
        </>
      )}
    </Section>
  );
}
