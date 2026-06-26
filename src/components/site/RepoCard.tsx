import { ExternalLink, GitFork, Star } from "lucide-react";
import { type GhRepo, langColor } from "@/lib/github";

export function RepoCard({ repo }: { repo: GhRepo }) {
  return (
    <a
      href={repo.html_url}
      target="_blank"
      rel="noreferrer"
      className="glass glow-border group relative flex h-full flex-col rounded-2xl p-5 transition-all hover:-translate-y-1 hover:shadow-[var(--shadow-glow-md)]"
    >
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-display text-base font-semibold text-foreground group-hover:text-gradient">
          {repo.name}
        </h3>
        <ExternalLink className="h-4 w-4 shrink-0 text-muted-foreground transition-colors group-hover:text-accent" />
      </div>

      <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">
        {repo.description || "No description provided."}
      </p>

      {repo.topics.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {repo.topics.slice(0, 4).map((t) => (
            <span
              key={t}
              className="rounded-md border border-white/10 bg-white/5 px-2 py-0.5 font-mono text-[10px] text-muted-foreground"
            >
              {t}
            </span>
          ))}
        </div>
      )}

      <div className="mt-auto flex items-center justify-between pt-4 text-xs text-muted-foreground">
        {repo.language ? (
          <span className="inline-flex items-center gap-1.5">
            <span
              className="h-2 w-2 rounded-full"
              style={{ background: langColor(repo.language), boxShadow: `0 0 8px ${langColor(repo.language)}` }}
            />
            {repo.language}
          </span>
        ) : (
          <span />
        )}
        <span className="inline-flex items-center gap-3">
          <span className="inline-flex items-center gap-1"><Star className="h-3.5 w-3.5" />{repo.stargazers_count}</span>
          <span className="inline-flex items-center gap-1"><GitFork className="h-3.5 w-3.5" />{repo.forks_count}</span>
        </span>
      </div>
    </a>
  );
}
