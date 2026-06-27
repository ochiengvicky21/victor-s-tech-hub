import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, ArrowUpRight, Download, Github, PhoneCall } from "lucide-react";
import { Section } from "@/components/site/Section";
import { RepoCard } from "@/components/site/RepoCard";
import { ConnectSection } from "@/components/site/ConnectSection";
import { ProductsSection } from "@/components/site/ProductsSection";
import { ServicesSection } from "@/components/site/ServicesSection";
import { GithubDashboard } from "@/components/site/GithubDashboard";
import { IndustriesSection } from "@/components/site/IndustriesSection";
import { WhyMeSection } from "@/components/site/WhyMeSection";
import { ProcessSection } from "@/components/site/ProcessSection";
import { TimelineSection } from "@/components/site/TimelineSection";
import { VisionSection } from "@/components/site/VisionSection";
import { InsightsSection } from "@/components/site/InsightsSection";
import { fetchGhRepos, fetchGhUser, GITHUB_USERNAME } from "@/lib/github";

const photoAsset = { url: "/ochieng-victor.jpg" };

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Victor Otieno Ochieng — Full Stack Engineer & SaaS Architect" },
      { name: "description", content: "Designing scalable digital systems for ambitious businesses. Full stack engineering, AI systems, SaaS architecture and digital transformation." },
      { property: "og:title", content: "Victor Otieno Ochieng — Full Stack Engineer & SaaS Architect" },
      { property: "og:description", content: "Designing scalable digital systems for ambitious businesses." },
    ],
  }),
  component: Home,
});

const titles = [
  "Full Stack Engineer",
  "AI Systems Builder",
  "SaaS Architect",
  "Digital Transformation Consultant",
  "Software Product Engineer",
];

function Home() {
  const repos = useQuery({ queryKey: ["gh", "repos"], queryFn: fetchGhRepos, staleTime: 5 * 60_000, refetchInterval: 5 * 60_000, refetchOnWindowFocus: true });
  const user = useQuery({ queryKey: ["gh", "user"], queryFn: fetchGhUser, staleTime: 5 * 60_000, refetchInterval: 5 * 60_000, refetchOnWindowFocus: true });

  const featured = repos.data?.slice(0, 6) ?? [];

  return (
    <>
      {/* HERO — magazine cover */}
      <section className="relative mx-auto w-full max-w-6xl px-5 pt-16 sm:pt-24">
        <div className="grid items-end gap-12 md:grid-cols-[1.3fr_1fr]">
          <div className="animate-rise">
            <div className="flex items-center gap-3">
              <p className="eyebrow">Volume 03 · 2025</p>
              <span className="h-px flex-1 bg-rule" />
              <p className="font-mono text-[10px] uppercase tracking-wider ink-soft">Nairobi · Kenya</p>
            </div>

            <h1 className="mt-8 serif-display text-[clamp(3rem,8vw,7rem)]">
              Building software<br />
              that <span className="serif-italic text-electric">transforms</span><br />
              businesses.
            </h1>

            <p className="mt-8 max-w-xl text-lg leading-relaxed ink-soft">
              I&apos;m <span className="text-ink">Victor Otieno Ochieng</span> — a full stack engineer
              and SaaS architect designing scalable digital systems for hospitality, education,
              real estate and the businesses ready to operate like enterprises.
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-3">
              <Link
                to="/projects"
                className="group inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3 text-sm font-medium text-paper transition-transform hover:scale-[1.02]"
              >
                View work
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
              <Link
                to="/contact"
                className="group inline-flex items-center gap-2 rounded-full border border-ink px-6 py-3 text-sm font-medium text-ink hover:bg-ink hover:text-paper"
              >
                <PhoneCall className="h-4 w-4" /> Book a discovery call
              </Link>
              <a
                href={`https://github.com/${GITHUB_USERNAME}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-rule bg-white px-5 py-3 text-sm font-medium text-ink-soft hover:text-ink"
              >
                <Github className="h-4 w-4" /> @{GITHUB_USERNAME}
              </a>
              <Link
                to="/resume"
                className="inline-flex items-center gap-2 rounded-full border border-rule bg-white px-5 py-3 text-sm font-medium text-ink-soft hover:text-ink"
              >
                <Download className="h-4 w-4" /> Download CV
              </Link>
            </div>

            {/* Title marquee */}
            <div className="mt-12 overflow-hidden rule-t pt-6">
              <div className="flex animate-marquee gap-10 whitespace-nowrap font-mono text-xs uppercase tracking-[0.2em] text-ink-soft">
                {[...titles, ...titles, ...titles].map((t, i) => (
                  <span key={i} className="inline-flex items-center gap-10">
                    <span>{t}</span><span className="text-electric">·</span>
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Portrait — editorial frame */}
          <figure className="relative mx-auto w-full max-w-md">
            <div className="relative overflow-hidden rounded-[2rem] border border-rule bg-white shadow-lg">
              <img
                src={photoAsset.url}
                alt="Portrait of Victor Otieno Ochieng"
                width={720}
                height={960}
                className="aspect-[3/4] w-full object-cover"
              />
            </div>

            <div className="absolute -bottom-4 -left-4 rounded-2xl border border-rule bg-white px-4 py-3 shadow-md animate-float">
              <p className="eyebrow">Repos</p>
              <p className="serif-display text-3xl text-ink">{user.data?.public_repos ?? "—"}</p>
            </div>
            <div className="absolute -top-4 -right-4 rounded-2xl border border-rule bg-white px-4 py-3 shadow-md animate-float" style={{ animationDelay: "1.5s" }}>
              <p className="eyebrow">Followers</p>
              <p className="serif-display text-3xl text-ink">{user.data?.followers ?? "—"}</p>
            </div>

            <figcaption className="mt-5 flex items-center justify-between font-mono text-[10px] uppercase tracking-wider ink-soft">
              <span>Fig. 01 — Engineer at work</span>
              <span className="text-electric">● Live</span>
            </figcaption>
          </figure>
        </div>
      </section>

      {/* STORY — magazine feature */}
      <Section eyebrow="// the story">
        <div className="grid gap-12 md:grid-cols-[1fr_1.6fr]">
          <h2 className="serif-display text-5xl text-ink sm:text-6xl">
            Software, treated like <span className="serif-italic text-electric">infrastructure.</span>
          </h2>
          <div className="space-y-5 text-base leading-relaxed ink-soft sm:text-lg">
            <p>
              I build software the way good architects build buildings — for the people who&apos;ll live
              inside it, and for the decades after launch. Every line of code is in service of a
              business outcome.
            </p>
            <p>
              My work spans hotel and resort management, property and real-estate platforms,
              educational systems, school ERPs, library systems, AI dashboards, business automation,
              booking platforms, payment systems, role-based access, multi-tenant SaaS,
              administrative dashboards and analytics.
            </p>
            <p>
              Long term, I&apos;m building enterprise-grade SaaS products used by businesses across
              Africa and internationally — software that doesn&apos;t apologize for where it&apos;s built.
            </p>
            <Link to="/about" className="group inline-flex items-center gap-1.5 text-sm font-medium text-ink">
              Read the full story
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </Link>
          </div>
        </div>
      </Section>

      <ProductsSection />
      <ServicesSection />
      <GithubDashboard />

      {/* FEATURED REPOS */}
      <Section
        eyebrow="// featured work"
        title={<>Selected <span className="serif-italic text-electric">case studies.</span></>}
        description="A live cut of recent public repositories — auto-synced from GitHub."
      >
        {repos.isLoading && (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-56 animate-pulse rounded-2xl border border-rule bg-surface" />
            ))}
          </div>
        )}
        {repos.isError && (
          <div className="rounded-2xl border border-rule bg-white p-6 text-sm ink-soft">
            Couldn&apos;t reach GitHub right now. Try again in a moment.
          </div>
        )}
        {featured.length > 0 && (
          <>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {featured.map((r) => <RepoCard key={r.id} repo={r} />)}
            </div>
            <div className="mt-10 flex justify-center">
              <Link to="/projects" className="group inline-flex items-center gap-2 rounded-full border border-ink px-5 py-3 text-sm font-medium hover:bg-ink hover:text-paper">
                View all projects <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>
          </>
        )}
      </Section>

      <IndustriesSection />
      <ProcessSection />
      <WhyMeSection />
      <TimelineSection />
      <VisionSection />
      <InsightsSection />
      <ConnectSection />

      {/* CTA */}
      <Section>
        <div className="relative overflow-hidden rounded-3xl border border-rule bg-ink p-12 text-paper sm:p-16">
          <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-paper/60">// let&apos;s build together</p>
          <h3 className="mt-4 max-w-3xl serif-display text-5xl sm:text-6xl">
            Have an ambitious system <span className="serif-italic text-[oklch(0.78_0.14_256)]">to build?</span>
          </h3>
          <p className="mt-5 max-w-xl text-base text-paper/70">
            I take on a small number of engagements each quarter. If you&apos;re ready to digitize,
            scale, or rebuild what you have — let&apos;s talk.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/contact" className="inline-flex items-center gap-2 rounded-full bg-paper px-6 py-3 text-sm font-medium text-ink hover:opacity-90">
              Start a conversation <ArrowRight className="h-4 w-4" />
            </Link>
            <a href="https://wa.me/254742676542" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full border border-paper/30 px-6 py-3 text-sm font-medium text-paper hover:bg-paper/10">
              WhatsApp me
            </a>
            <a href="mailto:ochiengvicky21@gmail.com" className="inline-flex items-center gap-2 rounded-full border border-paper/30 px-6 py-3 text-sm font-medium text-paper hover:bg-paper/10">
              Request a proposal
            </a>
          </div>
        </div>
      </Section>
    </>
  );
}
