import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, ArrowUpRight, Download, Github, PhoneCall } from "lucide-react";
import { Section } from "@/components/site/Section";
import { RepoCard } from "@/components/site/RepoCard";
import { ClientWorkSection } from "@/components/site/ClientWorkSection";
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
import { CodeSnippetsSection } from "@/components/site/CodeSnippetsSection";
import { ManagedContentSections } from "@/components/site/ManagedContentSections";
import { TechBadges } from "@/components/site/TechBadges";
import { fetchGhRepos, GITHUB_USERNAME } from "@/lib/github";
import { getPublicSiteContent } from "@/lib/site-content.functions";
import { DEFAULT_SITE_CONTENT, getSiteSection } from "@/lib/site-content";
import { lazy, Suspense, useEffect, useState } from "react";

const photoAsset = { url: "/ochieng-victor.jpg" };
const SpaceScene = lazy(() =>
  import("@/components/site/SpaceScene").then((module) => ({ default: module.SpaceScene })),
);

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Victor Otieno Ochieng — Full Stack Engineer & SaaS Architect" },
      {
        name: "description",
        content:
          "Designing scalable digital systems for ambitious businesses. Full stack engineering, AI systems, SaaS architecture and digital transformation.",
      },
      {
        property: "og:title",
        content: "Victor Otieno Ochieng — Full Stack Engineer & SaaS Architect",
      },
      {
        property: "og:description",
        content: "Designing scalable digital systems for ambitious businesses.",
      },
    ],
  }),
  component: Home,
});

function Home() {
  const contentQuery = useQuery({
    queryKey: ["site-content", "home"],
    queryFn: () => getPublicSiteContent({ data: { includeCode: true } }),
    staleTime: 60_000,
  });
  const repos = useQuery({
    queryKey: ["gh", "repos"],
    queryFn: fetchGhRepos,
    staleTime: 5 * 60_000,
    refetchInterval: 5 * 60_000,
    refetchOnWindowFocus: true,
  });

  const featured = repos.data?.slice(0, 6) ?? [];
  const siteContent = contentQuery.data?.content ?? DEFAULT_SITE_CONTENT;
  const hero = getSiteSection(siteContent, "hero") ?? DEFAULT_SITE_CONTENT.sections[0];
  const story = getSiteSection(siteContent, "story") ?? DEFAULT_SITE_CONTENT.sections[1];
  const clientWork = getSiteSection(siteContent, "client-work") ?? DEFAULT_SITE_CONTENT.sections[2];
  const [typedTitle, setTypedTitle] = useState(hero.title);

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) {
      setTypedTitle(hero.title);
      return;
    }

    let index = 0;
    setTypedTitle("");
    let timeout = 0;
    const typeNextCharacter = () => {
      index += 1;
      setTypedTitle(hero.title.slice(0, index));
      if (index < hero.title.length) {
        timeout = window.setTimeout(typeNextCharacter, 45);
      }
    };
    timeout = window.setTimeout(typeNextCharacter, 260);

    return () => window.clearTimeout(timeout);
  }, [hero.title]);

  const heroLines = typedTitle.split("\n");

  return (
    <>
      <section className="tech-hero mx-auto w-full max-w-7xl px-5 pb-12 pt-0 sm:px-12 sm:pb-20">
        <Suspense fallback={<div aria-hidden="true" className="space-scene" />}>
          <SpaceScene />
        </Suspense>
        <div className="animate-rise relative z-10">
          <h1
            aria-label={hero.title.replace("\n", " ")}
            className="max-w-full whitespace-pre-line font-mono text-[clamp(2.5rem,7.1vw,6.6rem)] font-bold leading-[0.98] tracking-[-0.075em] text-white"
          >
            {heroLines.map((line, index) => (
              <span key={`${line}-${index}`} className="block">
                {line.split(/(Victor)/g).map((part, partIndex) =>
                  part === "Victor" ? (
                    <span key={partIndex} className="text-electric">
                      {part}
                    </span>
                  ) : (
                    <span key={partIndex}>{part}</span>
                  ),
                )}
                {index === heroLines.length - 1 && (
                  <span aria-hidden="true" className="typewriter-cursor text-electric">
                    _
                  </span>
                )}
              </span>
            ))}
          </h1>
        </div>

        <div className="relative z-10 mt-32 grid items-center gap-10 lg:grid-cols-[0.85fr_1.15fr]">
          <div className="relative z-10">
            <figure className="tech-hero-image !mx-0">
              <div className="relative h-36 w-36 overflow-hidden rounded-full border-2 border-electric bg-surface shadow-[0_0_40px_oklch(0.67_0.25_300_/_0.2)] sm:h-40 sm:w-40">
                <img
                  src={photoAsset.url}
                  alt="Portrait of Victor Otieno Ochieng"
                  width={720}
                  height={960}
                  className="h-full w-full object-cover object-center grayscale"
                />
              </div>
              <span className="absolute bottom-1 left-28 rounded-full bg-electric px-3 py-1 font-mono text-[9px] font-semibold text-white shadow-lg">
                Nairobi, KE
              </span>
            </figure>
            <h2 className="mt-6 font-mono text-2xl font-bold tracking-tight text-white sm:text-3xl">
              Victor Otieno Ochieng
            </h2>
            <p className="mt-2 text-sm text-ink-soft sm:text-base">
              Software engineer · SaaS architect · Digital systems builder
            </p>
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-ink-soft sm:text-base">
              {hero.description}
            </p>

            <p className="eyebrow mb-3 mt-6 text-white/55">Technologies & tools</p>
            <div className="flex items-center gap-4">
              <TechBadges />
              <a
                href="https://github.com/ochiengvicky21"
                target="_blank"
                rel="noreferrer"
                className="shrink-0 font-mono text-[10px] text-white/55 transition hover:text-electric"
              >
                GitHub <ArrowUpRight className="inline h-3 w-3" />
              </a>
            </div>
            <div className="mt-7 flex flex-wrap gap-3">
              <a
                href="#client-work"
                className="group inline-flex items-center gap-2 rounded-lg bg-electric px-4 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:shadow-blue"
              >
                Explore projects
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </a>
              <Link
                to="/resume"
                className="inline-flex items-center gap-2 rounded-lg border border-white/15 px-4 py-3 text-sm font-medium text-white/80 transition hover:border-electric hover:text-white"
              >
                <Download className="h-4 w-4" /> View resume
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 rounded-lg border border-white/15 px-4 py-3 text-sm font-medium text-white/80 transition hover:border-electric hover:text-white"
              >
                <PhoneCall className="h-4 w-4" /> Contact
              </Link>
            </div>
          </div>

          <div aria-hidden="true" className="hidden min-h-[25rem] lg:block" />
        </div>
      </section>

      {contentQuery.isError && (
        <p role="status" className="mx-auto mt-4 max-w-7xl px-6 text-sm text-amber-800">
          Published site content could not be refreshed; showing the saved local portfolio content.
        </p>
      )}

      <ClientWorkSection projects={siteContent.projects} section={clientWork} />
      <CodeSnippetsSection snippets={contentQuery.data?.codeSnippets ?? []} />

      <Section eyebrow={story.eyebrow}>
        <div className="grid gap-12 md:grid-cols-[1fr_1.6fr]">
          <h2 className="serif-display text-4xl text-ink sm:text-5xl">{story.title}</h2>
          <div className="space-y-5 text-base leading-relaxed ink-soft sm:text-lg">
            {story.body
              .split(/\n\s*\n/)
              .filter(Boolean)
              .map((paragraph, index) => (
                <p key={`story-${index}`}>{paragraph}</p>
              ))}
            <Link
              to="/about"
              className="group inline-flex items-center gap-1.5 text-sm font-medium text-ink"
            >
              Read the full story
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </Link>
          </div>
        </div>
      </Section>
      <ManagedContentSections sections={siteContent.sections} />

      <ProductsSection />
      <ServicesSection />
      <GithubDashboard />

      {/* FEATURED REPOS */}
      <Section
        eyebrow="// open-source work"
        title={
          <>
            Selected <span className="serif-italic text-electric">repositories.</span>
          </>
        }
        description="Recent public repositories from GitHub, updated as projects ship."
      >
        {repos.isLoading && (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="h-56 animate-pulse rounded-2xl border border-rule bg-surface"
              />
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
              {featured.map((r) => (
                <RepoCard key={r.id} repo={r} />
              ))}
            </div>
            <div className="mt-10 flex justify-center">
              <Link
                to="/projects"
                className="group inline-flex items-center gap-2 rounded-full border border-ink px-5 py-3 text-sm font-medium hover:bg-ink hover:text-paper"
              >
                View all projects{" "}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>
          </>
        )}
      </Section>

      <IndustriesSection />
      <ProcessSection />
      <WhyMeSection />
      <TimelineSection projects={siteContent.projects} />
      <VisionSection />
      <InsightsSection />
      <ConnectSection />

      {/* CTA */}
      <Section>
        <div className="relative overflow-hidden rounded-3xl border border-rule bg-ink p-12 text-paper sm:p-16">
          <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-paper/60">
            // let&apos;s build together
          </p>
          <h3 className="mt-4 max-w-3xl serif-display text-5xl sm:text-6xl">
            Have an ambitious system{" "}
            <span className="serif-italic text-[oklch(0.78_0.14_256)]">to build?</span>
          </h3>
          <p className="mt-5 max-w-xl text-base text-paper/70">
            I take on a small number of engagements each quarter. If you&apos;re ready to digitize,
            scale, or rebuild what you have — let&apos;s talk.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 rounded-full bg-paper px-6 py-3 text-sm font-medium text-ink hover:opacity-90"
            >
              Start a conversation <ArrowRight className="h-4 w-4" />
            </Link>
            <a
              href="https://wa.me/254742676542"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-paper/30 px-6 py-3 text-sm font-medium text-paper hover:bg-paper/10"
            >
              WhatsApp me
            </a>
            <a
              href="mailto:ochiengvicky21@gmail.com"
              className="inline-flex items-center gap-2 rounded-full border border-paper/30 px-6 py-3 text-sm font-medium text-paper hover:bg-paper/10"
            >
              Request a proposal
            </a>
          </div>
        </div>
      </Section>
    </>
  );
}
