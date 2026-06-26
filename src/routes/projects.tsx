import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { Section } from "@/components/site/Section";
import { RepoCard } from "@/components/site/RepoCard";
import { GithubDashboard } from "@/components/site/GithubDashboard";
import { fetchGhRepos } from "@/lib/github";

export const Route = createFileRoute("/projects")({
  head: () => ({
    meta: [
      { title: "Work — Victor Otieno Ochieng" },
      { name: "description", content: "Case studies and live repositories from github.com/ochiengvicky21." },
      { property: "og:title", content: "Work — Victor Otieno Ochieng" },
    ],
  }),
  component: Projects,
});

function Projects() {
  const repos = useQuery({
    queryKey: ["gh", "repos"],
    queryFn: () => fetchGhRepos(),
    staleTime: 5 * 60_000,
    refetchInterval: 5 * 60_000,
    refetchOnWindowFocus: true,
  });
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
    <>
      <section className="mx-auto w-full max-w-6xl px-5 pt-16 sm:pt-24">
        <p className="eyebrow">// work · live from github</p>
        <h1 className="mt-6 serif-display text-[clamp(3rem,7vw,6rem)]">
          Every project, <span className="serif-italic text-electric">in the open.</span>
        </h1>
        <p className="mt-6 max-w-2xl text-lg ink-soft">
          A live feed of public repositories from <span className="text-ink">github.com/ochiengvicky21</span>.
          Search, filter, and follow the work as it ships.
        </p>
      </section>

      <GithubDashboard />

      <Section eyebrow="// all repositories" title={<>Browse the <span className="serif-italic text-electric">archive.</span></>}>
        <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="flex flex-1 items-center gap-2 rounded-full border border-rule bg-white px-4 py-2.5">
            <Search className="h-4 w-4 text-ink-soft" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search projects…"
              className="w-full bg-transparent text-sm outline-none placeholder:text-ink-soft"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setLang(null)}
              className={`rounded-full px-3 py-1.5 font-mono text-[11px] uppercase tracking-wider transition-colors ${lang === null ? "bg-ink text-paper" : "border border-rule bg-white text-ink-soft hover:text-ink"}`}
            >
              ALL
            </button>
            {languages.map((l) => (
              <button
                key={l}
                onClick={() => setLang(l)}
                className={`rounded-full px-3 py-1.5 font-mono text-[11px] uppercase tracking-wider transition-colors ${lang === l ? "bg-ink text-paper" : "border border-rule bg-white text-ink-soft hover:text-ink"}`}
              >
                {l}
              </button>
            ))}
          </div>
        </div>

        {repos.isLoading && (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 9 }).map((_, i) => (
              <div key={i} className="h-56 animate-pulse rounded-2xl border border-rule bg-surface" />
            ))}
          </div>
        )}
        {repos.isError && (
          <div className="rounded-2xl border border-rule bg-white p-6 text-sm ink-soft">
            Couldn&apos;t reach GitHub right now. Try again in a moment.
          </div>
        )}
        {repos.isSuccess && (
          <>
            {filtered.length === 0 ? (
              <div className="rounded-2xl border border-rule bg-white p-6 text-sm ink-soft">
                No projects match your filters.
              </div>
            ) : (
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {filtered.map((r) => <RepoCard key={r.id} repo={r} />)}
              </div>
            )}
            <p className="mt-8 text-center font-mono text-xs ink-soft">
              {filtered.length} of {repos.data.length} repositories
            </p>
          </>
        )}
      </Section>
    </>
  );
}
