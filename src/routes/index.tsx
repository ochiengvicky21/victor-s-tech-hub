import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, Github, Sparkles } from "lucide-react";
import photoAsset from "@/assets/ochieng-victor.jpg.asset.json";
import { Section } from "@/components/site/Section";
import { SocialLinks } from "@/components/site/SocialLinks";
import { RepoCard } from "@/components/site/RepoCard";
import { fetchGhRepos, fetchGhUser, GITHUB_USERNAME } from "@/lib/github";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Ochieng Victor Otieno — Developer Portfolio" },
      { name: "description", content: "Software developer crafting electric, modern web experiences. Live GitHub feed, projects, and contact." },
      { property: "og:title", content: "Ochieng Victor Otieno — Developer Portfolio" },
      { property: "og:description", content: "Software developer crafting electric, modern web experiences." },
    ],
  }),
  component: Home,
});

function Home() {
  const repos = useQuery({ queryKey: ["gh", "repos"], queryFn: fetchGhRepos, staleTime: 5 * 60_000 });
  const user = useQuery({ queryKey: ["gh", "user"], queryFn: fetchGhUser, staleTime: 5 * 60_000 });

  const featured = repos.data?.slice(0, 6) ?? [];

  return (
    <>
      {/* HERO */}
      <section className="relative mx-auto w-full max-w-6xl px-4 pt-12 sm:pt-20">
        <div className="grid items-center gap-10 md:grid-cols-[1.1fr_0.9fr]">
          <div>
            <div className="glass inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
              </span>
              <span className="font-mono uppercase tracking-[0.2em] text-muted-foreground">
                Online · Nairobi
              </span>
            </div>

            <h1 className="mt-6 font-display text-4xl font-semibold leading-[1.05] sm:text-6xl">
              <span className="text-foreground">I&apos;m </span>
              <span className="text-gradient">Ochieng Victor</span>
              <br />
              <span className="text-foreground">Otieno</span>
              <span className="text-accent">.</span>
            </h1>

            <p className="mt-5 max-w-xl text-base text-muted-foreground sm:text-lg">
              Software developer engineering electric digital products —
              clean code, sharp UI, real-time data. This site reads my
              GitHub in real time, so every push lands here automatically.
            </p>

            <div className="mt-7 flex flex-wrap items-center gap-3">
              <Link
                to="/projects"
                className="group inline-flex items-center gap-2 rounded-xl bg-electric px-5 py-3 text-sm font-medium text-primary-foreground shadow-[var(--shadow-glow-md)] transition-transform hover:scale-[1.03]"
              >
                See live projects
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
              <a
                href={`https://github.com/${GITHUB_USERNAME}`}
                target="_blank"
                rel="noreferrer"
                className="glass glow-border inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-medium"
              >
                <Github className="h-4 w-4" /> @{GITHUB_USERNAME}
              </a>
            </div>

            <div className="mt-8">
              <SocialLinks />
            </div>
          </div>

          {/* Portrait */}
          <div className="relative mx-auto w-full max-w-sm">
            <div
              aria-hidden
              className="absolute -inset-6 rounded-[2rem] blur-3xl opacity-60 animate-pulse-glow"
              style={{ background: "var(--gradient-aurora)" }}
            />
            <div className="glass-strong glow-border relative overflow-hidden rounded-[2rem] p-2">
              <img
                src={photoAsset.url}
                alt="Portrait of Ochieng Victor Otieno"
                width={720}
                height={960}
                className="aspect-[3/4] w-full rounded-[1.6rem] object-cover"
              />
              <div className="pointer-events-none absolute inset-2 rounded-[1.6rem] ring-1 ring-white/10" />
            </div>

            {/* floating stat chips */}
            <div className="glass animate-float absolute -bottom-4 -left-4 rounded-2xl px-4 py-3 text-sm shadow-[var(--shadow-glow-sm)]">
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">repos</p>
              <p className="text-lg font-semibold text-gradient">
                {user.data?.public_repos ?? "—"}
              </p>
            </div>
            <div className="glass animate-float absolute -top-4 -right-4 rounded-2xl px-4 py-3 text-sm shadow-[var(--shadow-glow-sm)]" style={{ animationDelay: "1.5s" }}>
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">followers</p>
              <p className="text-lg font-semibold text-gradient">
                {user.data?.followers ?? "—"}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* STACK MARQUEE */}
      <Section eyebrow="// stack">
        <div className="glass rounded-2xl px-6 py-5">
          <ul className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 font-mono text-sm text-muted-foreground">
            {["TypeScript", "React", "Node.js", "Python", "Tailwind", "Supabase", "Postgres", "Git", "Linux"].map((t) => (
              <li key={t} className="inline-flex items-center gap-2">
                <Sparkles className="h-3.5 w-3.5 text-accent" /> {t}
              </li>
            ))}
          </ul>
        </div>
      </Section>

      {/* FEATURED REPOS */}
      <Section
        eyebrow="// live from github"
        title="Featured projects"
        description="Pulled automatically from github.com/ochiengvicky21. Push code, see it here."
      >
        {repos.isLoading && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="glass h-44 animate-pulse rounded-2xl" />
            ))}
          </div>
        )}

        {repos.isError && (
          <div className="glass rounded-2xl p-6 text-sm text-muted-foreground">
            Couldn&apos;t reach GitHub right now. Try again in a moment.
          </div>
        )}

        {repos.isSuccess && featured.length === 0 && (
          <div className="glass rounded-2xl p-6 text-sm text-muted-foreground">
            No public repositories yet — check back soon.
          </div>
        )}

        {featured.length > 0 && (
          <>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {featured.map((r) => <RepoCard key={r.id} repo={r} />)}
            </div>
            <div className="mt-8 flex justify-center">
              <Link to="/projects" className="glass glow-border inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-medium hover:ring-electric">
                View all projects <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </>
        )}
      </Section>

      {/* CTA */}
      <Section>
        <div className="glass-strong glow-border relative overflow-hidden rounded-3xl p-10 text-center">
          <div aria-hidden className="absolute inset-0 -z-10 opacity-40" style={{ background: "var(--gradient-aurora)", filter: "blur(80px)" }} />
          <h3 className="text-2xl font-semibold sm:text-3xl">
            Have a project in mind?
          </h3>
          <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
            I&apos;m available for freelance and full-time engineering work. Let&apos;s build something electric.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link to="/contact" className="inline-flex items-center gap-2 rounded-xl bg-electric px-5 py-3 text-sm font-medium text-primary-foreground shadow-[var(--shadow-glow-md)]">
              Start a conversation <ArrowRight className="h-4 w-4" />
            </Link>
            <a href="https://wa.me/254742676542" target="_blank" rel="noreferrer" className="glass inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-medium">
              WhatsApp me
            </a>
          </div>
        </div>
      </Section>
    </>
  );
}
