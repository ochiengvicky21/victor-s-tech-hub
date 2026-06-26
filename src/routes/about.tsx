import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowUpRight,
  Code2,
  Cpu,
  Globe,
  Megaphone,
  Search,
  Database,
  GraduationCap,
  ExternalLink,
  Facebook,
  Workflow,
  CloudCog,
  CreditCard,
  Gauge,
  Lightbulb,
} from "lucide-react";
import type { ComponentType, SVGProps } from "react";
import { Section } from "@/components/site/Section";
import { SocialLinks } from "@/components/site/SocialLinks";
import { fetchGhUser } from "@/lib/github";

const photoAsset = { url: "/ochieng-victor.jpg" };

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — Victor Otieno Ochieng" },
      { name: "description", content: "Victor Otieno Ochieng — full stack engineer, AI systems builder, SaaS architect, social media manager, and English & Literature teacher." },
      { property: "og:title", content: "About — Victor Otieno Ochieng" },
    ],
  }),
  component: About,
});

function TikTokIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.07A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43V8.93a8.16 8.16 0 0 0 4.77 1.52V7a4.85 4.85 0 0 1-1.04-.31z" />
    </svg>
  );
}

const skills: { icon: ComponentType<SVGProps<SVGSVGElement>>; title: string; body: string }[] = [
  { icon: Code2, title: "Frontend Engineering", body: "React, TypeScript, Tailwind — accessible, animated, and editorial." },
  { icon: Cpu, title: "Backend Engineering", body: "Node.js, Python, REST & realtime APIs at scale." },
  { icon: Database, title: "Database Architecture", body: "Postgres, MySQL, Mongo — modelled for the next 3 years." },
  { icon: CloudCog, title: "Cloud & DevOps", body: "Vercel, Netlify, AWS, Supabase — production-grade deploys." },
  { icon: Workflow, title: "Business Automation", body: "Cut the loops — invoices, reminders, onboarding, reporting." },
  { icon: Cpu, title: "AI Systems", body: "Assistants, summarization, retrieval — embedded where it earns its place." },
  { icon: Globe, title: "Web Revamps & SEO", body: "Modernize tired sites — performance, UX, conversion, search." },
  { icon: CreditCard, title: "Payments", body: "M-Pesa, Stripe, PayPal — checkout that earns trust." },
  { icon: Gauge, title: "Performance", body: "Core Web Vitals, edge caching, image strategy." },
  { icon: Lightbulb, title: "Consulting", body: "Architecture reviews, second opinions, hiring help." },
  { icon: Megaphone, title: "Social Media Management", body: "Content strategy, posting, growth — Facebook & TikTok." },
  { icon: GraduationCap, title: "English & Literature", body: "Classroom teaching, exam prep, literary analysis." },
];

type Experience = {
  role: string;
  org: string;
  location?: string;
  body: string;
  links?: { href: string; label: string; icon: ComponentType<SVGProps<SVGSVGElement>> }[];
};

const experience: Experience[] = [
  {
    role: "Web Developer & Social Media Manager",
    org: "Munglu Eco Village Resort",
    body: "Designed, built and maintain the resort's website. Run their Facebook and TikTok — content planning, posting, audience growth, and community engagement.",
    links: [
      { href: "https://www.mungluecovillage.co.ke", label: "mungluecovillage.co.ke", icon: ExternalLink },
      { href: "https://www.facebook.com/MungluEcoVillageResort", label: "Facebook", icon: Facebook },
      { href: "https://www.tiktok.com/@mungluecovillage", label: "@mungluecovillage", icon: TikTokIcon },
    ],
  },
  {
    role: "English & Literature Teacher",
    org: "Sango Academy",
    location: "Homa Bay, Kenya",
    body: "Taught English language and Literature — grammar, composition, set texts, and literary analysis. Focused on clarity, critical thinking, and exam readiness.",
  },
];

function About() {
  const user = useQuery({ queryKey: ["gh", "user"], queryFn: fetchGhUser, staleTime: 5 * 60_000 });

  return (
    <>
      {/* HEADER */}
      <section className="mx-auto w-full max-w-6xl px-5 pt-16 sm:pt-24">
        <p className="eyebrow">// about</p>
        <h1 className="mt-6 serif-display text-[clamp(3rem,7vw,6rem)]">
          The story behind <span className="serif-italic text-electric">the work.</span>
        </h1>
      </section>

      {/* PORTRAIT + BIO */}
      <Section>
        <div className="grid gap-12 md:grid-cols-[0.9fr_1.4fr]">
          <figure className="relative">
            <div className="overflow-hidden rounded-[2rem] border border-rule bg-white shadow-md">
              <img
                src={photoAsset.url}
                alt="Victor Otieno Ochieng"
                loading="lazy"
                width={720}
                height={960}
                className="aspect-[3/4] w-full object-cover"
              />
            </div>
            <figcaption className="mt-4 flex items-center justify-between font-mono text-[10px] uppercase tracking-wider ink-soft">
              <span>Victor Otieno Ochieng</span>
              <span>Nairobi · Kenya</span>
            </figcaption>
          </figure>

          <div className="space-y-6 text-lg leading-relaxed ink-soft">
            <p className="font-serif text-3xl italic text-ink">
              &ldquo;I build software the way good architects build buildings — for the people who&apos;ll live inside it.&rdquo;
            </p>
            <p>
              I&apos;m <span className="text-ink">Victor Otieno Ochieng</span> — a full stack engineer
              and SaaS architect based in Kenya. I design and build software for businesses that
              want to operate like enterprises: hotels, resorts, schools, property managers,
              clinics, NGOs, and the next wave of SMEs going digital.
            </p>
            <p>
              I&apos;ve designed systems for hotel management, resort operations, property and real
              estate, educational platforms, school ERPs, library systems, AI dashboards, business
              automation, booking platforms, payment systems, role-based access, multi-tenant SaaS,
              administrative dashboards and analytics.
            </p>
            <p>
              Outside the editor I manage social media for businesses — most recently{" "}
              <a className="text-ink underline-offset-4 hover:underline" href="https://www.mungluecovillage.co.ke" target="_blank" rel="noreferrer">
                Munglu Eco Village Resort
              </a>
              {" "}— and I&apos;ve taught English and Literature at Sango Academy in Homa Bay. I post
              tech work as{" "}
              <a className="text-ink underline-offset-4 hover:underline" href="https://www.tiktok.com/@v_o_otoday" target="_blank" rel="noreferrer">
                @v_o_otoday
              </a>{" "}
              on TikTok.
            </p>
            {user.data?.bio && (
              <p className="rounded-2xl border border-rule bg-white p-5 font-mono text-sm text-ink">
                <span className="text-electric">// github bio </span>
                {user.data.bio}
              </p>
            )}
            <div className="pt-2">
              <SocialLinks />
            </div>
          </div>
        </div>
      </Section>

      {/* CAPABILITIES */}
      <Section
        eyebrow="// capabilities"
        title={<>What I bring to the <span className="serif-italic text-electric">table.</span></>}
      >
        <div className="grid gap-px overflow-hidden rounded-3xl border border-rule bg-rule sm:grid-cols-2 lg:grid-cols-3">
          {skills.map((s) => (
            <div key={s.title} className="bg-white p-6">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-surface text-ink">
                <s.icon className="h-4 w-4" />
              </span>
              <h3 className="mt-4 font-sans text-base font-semibold text-ink">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed ink-soft">{s.body}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* EXPERIENCE */}
      <Section
        eyebrow="// experience"
        title={<>Selected <span className="serif-italic text-electric">work.</span></>}
        description="A few places I've built, taught, and managed."
      >
        <div className="grid gap-5 md:grid-cols-2">
          {experience.map((e) => (
            <article key={e.org} className="rounded-3xl border border-rule bg-white p-7">
              <p className="eyebrow">{e.location ?? "online"}</p>
              <h3 className="mt-3 serif-display text-3xl text-ink">{e.role}</h3>
              <p className="mt-1 text-sm font-medium ink-soft">{e.org}</p>
              <p className="mt-4 text-base leading-relaxed ink-soft">{e.body}</p>
              {e.links && (
                <ul className="mt-5 flex flex-wrap gap-2">
                  {e.links.map((l) => (
                    <li key={l.href}>
                      <a
                        href={l.href}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 rounded-full border border-rule bg-white px-3 py-1.5 text-xs text-ink-soft hover:border-ink hover:text-ink"
                      >
                        <l.icon className="h-3.5 w-3.5" /> {l.label}
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </article>
          ))}
        </div>
      </Section>

      {/* CTA */}
      <Section>
        <div className="rule-t flex flex-col items-start justify-between gap-6 pt-12 md:flex-row md:items-end">
          <h3 className="serif-display text-4xl text-ink sm:text-5xl">
            Want to build something <span className="serif-italic text-electric">like this</span> for your business?
          </h3>
          <Link to="/contact" className="inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3 text-sm font-medium text-paper">
            Book a discovery call <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
      </Section>
    </>
  );
}
