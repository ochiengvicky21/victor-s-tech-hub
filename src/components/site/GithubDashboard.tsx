import { useQuery } from "@tanstack/react-query";
import { Section } from "./Section";
import { fetchGhRepos, fetchGhUser, fetchGhEvents, GITHUB_USERNAME, langColor } from "@/lib/github";
import { Star, GitFork, GitCommit, GitPullRequest, GitBranch, Github, ArrowUpRight } from "lucide-react";

function eventLabel(t: string) {
  return ({
    PushEvent: "pushed",
    CreateEvent: "created",
    PullRequestEvent: "PR on",
    IssuesEvent: "issue on",
    WatchEvent: "starred",
    ForkEvent: "forked",
    ReleaseEvent: "released",
  } as Record<string, string>)[t] ?? t.replace("Event", "").toLowerCase();
}

function timeAgo(iso: string) {
  const diff = (Date.now() - new Date(iso).getTime()) / 1000;
  if (diff < 60) return `${Math.floor(diff)}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 86400 * 30) return `${Math.floor(diff / 86400)}d ago`;
  return new Date(iso).toLocaleDateString();
}

export function GithubDashboard() {
  const user = useQuery({ queryKey: ["gh", "user"], queryFn: fetchGhUser, staleTime: 5 * 60_000, refetchInterval: 5 * 60_000 });
  const repos = useQuery({ queryKey: ["gh", "repos"], queryFn: fetchGhRepos, staleTime: 5 * 60_000, refetchInterval: 5 * 60_000 });
  const events = useQuery({ queryKey: ["gh", "events"], queryFn: fetchGhEvents, staleTime: 60_000, refetchInterval: 60_000 });

  const totalStars = repos.data?.reduce((a, r) => a + r.stargazers_count, 0) ?? 0;
  const totalForks = repos.data?.reduce((a, r) => a + r.forks_count, 0) ?? 0;

  const langTotals = (() => {
    const m = new Map<string, number>();
    repos.data?.forEach((r) => { if (r.language) m.set(r.language, (m.get(r.language) ?? 0) + 1); });
    const total = Array.from(m.values()).reduce((a, b) => a + b, 0) || 1;
    return Array.from(m.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([name, count]) => ({ name, count, pct: (count / total) * 100 }));
  })();

  const latest = repos.data?.slice(0, 5) ?? [];

  const stats = [
    { label: "Public repos", value: user.data?.public_repos ?? "—" },
    { label: "Followers", value: user.data?.followers ?? "—" },
    { label: "Following", value: user.data?.following ?? "—" },
    { label: "Total stars", value: totalStars },
    { label: "Total forks", value: totalForks },
  ];

  return (
    <Section
      eyebrow="// github · live"
      title={<>The work, <span className="serif-italic text-electric">in real time.</span></>}
      description={
        <>
          Streaming directly from{" "}
          <a className="text-ink underline-offset-4 hover:underline" href={`https://github.com/${GITHUB_USERNAME}`} target="_blank" rel="noreferrer">
            github.com/{GITHUB_USERNAME}
          </a>. Every push lands here within minutes.
        </>
      }
    >
      {/* Stats */}
      <div className="grid grid-cols-2 gap-px overflow-hidden rounded-3xl border border-rule bg-rule sm:grid-cols-3 md:grid-cols-5">
        {stats.map((s) => (
          <div key={s.label} className="bg-white px-5 py-6">
            <p className="eyebrow">{s.label}</p>
            <p className="mt-2 serif-display text-4xl text-ink">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.2fr_1fr]">
        {/* Languages */}
        <div className="rounded-3xl border border-rule bg-white p-7">
          <div className="flex items-center justify-between">
            <h3 className="font-sans text-sm font-semibold uppercase tracking-wider text-ink">Language breakdown</h3>
            <span className="font-mono text-[10px] text-ink-soft">{repos.data?.length ?? 0} repos</span>
          </div>
          {/* Stacked bar */}
          <div className="mt-5 flex h-3 w-full overflow-hidden rounded-full bg-surface">
            {langTotals.map((l) => (
              <span key={l.name} style={{ width: `${l.pct}%`, background: langColor(l.name) }} title={`${l.name} — ${l.pct.toFixed(0)}%`} />
            ))}
          </div>
          <ul className="mt-5 grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
            {langTotals.map((l) => (
              <li key={l.name} className="flex items-center justify-between">
                <span className="inline-flex items-center gap-2 text-ink">
                  <span className="h-2 w-2 rounded-full" style={{ background: langColor(l.name) }} />
                  {l.name}
                </span>
                <span className="font-mono text-xs ink-soft">{l.pct.toFixed(0)}%</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Activity */}
        <div className="rounded-3xl border border-rule bg-white p-7">
          <div className="flex items-center justify-between">
            <h3 className="font-sans text-sm font-semibold uppercase tracking-wider text-ink">Latest activity</h3>
            <span className="relative inline-flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-electric opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-electric" />
            </span>
          </div>
          <ul className="mt-5 space-y-3 text-sm">
            {(events.data ?? []).slice(0, 6).map((e) => (
              <li key={e.id} className="flex items-start gap-3">
                <span className="mt-0.5 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-surface text-ink">
                  {e.type === "PushEvent" ? <GitCommit className="h-3.5 w-3.5" />
                    : e.type === "PullRequestEvent" ? <GitPullRequest className="h-3.5 w-3.5" />
                    : e.type === "CreateEvent" ? <GitBranch className="h-3.5 w-3.5" />
                    : <Github className="h-3.5 w-3.5" />}
                </span>
                <p className="min-w-0 flex-1 leading-snug">
                  <span className="text-ink-soft">{eventLabel(e.type)}</span>{" "}
                  <a href={`https://github.com/${e.repo.name}`} target="_blank" rel="noreferrer" className="font-mono text-ink hover:text-electric">
                    {e.repo.name.split("/")[1]}
                  </a>
                  <span className="ml-2 font-mono text-[10px] ink-soft">{timeAgo(e.created_at)}</span>
                </p>
              </li>
            ))}
            {events.isLoading && Array.from({ length: 4 }).map((_, i) => (
              <li key={i} className="h-7 animate-pulse rounded bg-surface" />
            ))}
            {events.isSuccess && (events.data?.length ?? 0) === 0 && (
              <li className="text-sm ink-soft">No recent public activity.</li>
            )}
          </ul>
        </div>
      </div>

      {/* Latest repos */}
      <div className="mt-6 rounded-3xl border border-rule bg-white p-7">
        <div className="flex items-center justify-between">
          <h3 className="font-sans text-sm font-semibold uppercase tracking-wider text-ink">Latest repositories</h3>
          <a
            href={`https://github.com/${GITHUB_USERNAME}?tab=repositories`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 text-xs text-ink-soft hover:text-ink"
          >
            View all on GitHub <ArrowUpRight className="h-3 w-3" />
          </a>
        </div>
        <ul className="mt-4 divide-y divide-rule">
          {latest.map((r) => (
            <li key={r.id} className="py-3">
              <a href={r.html_url} target="_blank" rel="noreferrer" className="group flex items-center gap-4">
                <span className="font-mono text-sm text-ink group-hover:text-electric">{r.name}</span>
                <span className="hidden flex-1 truncate text-sm ink-soft sm:block">{r.description}</span>
                {r.language && (
                  <span className="inline-flex items-center gap-1.5 font-mono text-[10px] ink-soft">
                    <span className="h-1.5 w-1.5 rounded-full" style={{ background: langColor(r.language) }} />
                    {r.language}
                  </span>
                )}
                <span className="inline-flex items-center gap-1 font-mono text-[10px] ink-soft"><Star className="h-3 w-3" />{r.stargazers_count}</span>
                <span className="inline-flex items-center gap-1 font-mono text-[10px] ink-soft"><GitFork className="h-3 w-3" />{r.forks_count}</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </Section>
  );
}
