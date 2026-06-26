import { ArrowUpRight, GitFork, Star } from "lucide-react";
import { type GhRepo, langColor } from "@/lib/github";

export function RepoCard({ repo }: { repo: GhRepo }) {
  return (
    <a
      href={repo.html_url}
      target="_blank"
      rel="noreferrer"
      className="group relative flex h-full flex-col rounded-2xl border border-rule bg-white p-6 transition-all hover:-translate-y-1 hover:border-ink hover:shadow-lg"
    >
      <div className="flex items-start justify-between gap-3">
        <h3 className="serif-display text-2xl text-ink">
          {repo.name}
        </h3>
        <ArrowUpRight className="h-5 w-5 shrink-0 text-ink-soft transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-electric" />
      </div>

      <p className="mt-2 line-clamp-3 text-sm leading-relaxed ink-soft">
        {repo.description || "No description provided."}
      </p>

      {repo.topics.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-1.5">
          {repo.topics.slice(0, 4).map((t) => (
            <span
              key={t}
              className="rounded-full border border-rule bg-surface px-2.5 py-0.5 font-mono text-[10px] text-ink-soft"
            >
              {t}
            </span>
          ))}
        </div>
      )}

      <div className="mt-auto flex items-center justify-between pt-5 text-xs ink-soft">
        {repo.language ? (
          <span className="inline-flex items-center gap-1.5 font-medium">
            <span
              className="h-2 w-2 rounded-full"
              style={{ background: langColor(repo.language) }}
            />
            {repo.language}
          </span>
        ) : <span />}
        <span className="inline-flex items-center gap-3">
          <span className="inline-flex items-center gap-1"><Star className="h-3.5 w-3.5" />{repo.stargazers_count}</span>
          <span className="inline-flex items-center gap-1"><GitFork className="h-3.5 w-3.5" />{repo.forks_count}</span>
        </span>
      </div>
    </a>
  );
}
