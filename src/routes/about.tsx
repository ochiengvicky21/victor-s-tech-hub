import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import {
  Code2,
  Cpu,
  Globe,
  Rocket,
  Megaphone,
  Search,
  Database,
  GraduationCap,
  ExternalLink,
  Facebook,
} from "lucide-react";
import type { ComponentType, SVGProps } from "react";
const photoAsset = { url: "/ochieng-victor.jpg" };
import { Section } from "@/components/site/Section";
import { fetchGhUser } from "@/lib/github";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — Ochieng Victor Otieno" },
      {
        name: "description",
        content:
          "Ochieng Victor Otieno — software developer, social media manager, SEO & web revamp specialist, database designer, and English & Literature teacher.",
      },
      { property: "og:title", content: "About — Ochieng Victor Otieno" },
      {
        property: "og:description",
        content:
          "Developer, social media manager, SEO specialist, and English & Literature teacher.",
      },
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
  { icon: Code2, title: "Frontend", body: "React, TypeScript, Tailwind — accessible, animated, fast." },
  { icon: Cpu, title: "Backend", body: "Node.js, Python, REST & realtime APIs." },
  { icon: Globe, title: "Web Revamps", body: "Modernize tired sites — performance, UX, conversion." },
  { icon: Search, title: "SEO", body: "Technical SEO, on-page optimization, search-friendly architecture." },
  { icon: Database, title: "Database Design", body: "Schemas, relations, indexing — Postgres, MySQL, MongoDB." },
  { icon: Megaphone, title: "Social Media Management", body: "Content strategy, posting, growth — Facebook & TikTok." },
  { icon: GraduationCap, title: "English & Literature", body: "Classroom teaching, exam prep, literary analysis." },
  { icon: Rocket, title: "Shipping", body: "From idea to deploy — Git, CI/CD, cloud-native." },
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
    body: "Built and maintain the resort's website. Run their Facebook and TikTok — content planning, posting, audience growth, and community engagement.",
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
      <Section eyebrow="// about" title="The story behind the signal">
        <div className="grid gap-8 md:grid-cols-[0.8fr_1.2fr]">
          <div className="glass-strong glow-border overflow-hidden rounded-3xl p-2">
            <img
              src={photoAsset.url}
              alt="Ochieng Victor Otieno"
              loading="lazy"
              width={720}
              height={960}
              className="aspect-[3/4] w-full rounded-[1.4rem] object-cover"
            />
          </div>
          <div className="space-y-4 text-base leading-relaxed text-muted-foreground">
            <p>
              I&apos;m <span className="text-foreground">Ochieng Victor Otieno</span> — a software developer, social media manager, and educator based in Kenya. I build modern web products, grow brands through content, and teach English and Literature.
            </p>
            <p>
              On the tech side I ship full-stack web apps, run <span className="text-foreground">web revamps</span>, design <span className="text-foreground">databases</span>, and tune sites for <span className="text-foreground">SEO</span>. On the content side I help businesses grow their reach across Facebook and TikTok with strategy, storytelling, and consistent posting.
            </p>
            <p>
              I share tech on TikTok as <a className="text-accent hover:underline" target="_blank" rel="noreferrer" href="https://www.tiktok.com/@v_o_otoday">@v_o_otoday</a>, and in the classroom I&apos;ve taught English and Literature with a focus on clarity, critical thinking, and exam readiness.
            </p>
            {user.data?.bio && (
              <p className="glass rounded-xl p-4 font-mono text-sm text-foreground">
                <span className="text-accent">// github bio </span>
                {user.data.bio}
              </p>
            )}
          </div>
        </div>
      </Section>

      <Section eyebrow="// capabilities" title="What I work with">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {skills.map((s) => (
            <div key={s.title} className="glass glow-border rounded-2xl p-5">
              <div className="glass inline-flex h-10 w-10 items-center justify-center rounded-xl text-accent">
                <s.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 font-semibold">{s.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{s.body}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section
        eyebrow="// experience"
        title="Selected work"
        description="A few places I've built, taught, and managed."
      >
        <div className="grid gap-4 md:grid-cols-2">
          {experience.map((e) => (
            <div key={e.org} className="glass glow-border rounded-2xl p-6">
              <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-accent">
                {e.location ?? "online"}
              </p>
              <h3 className="mt-2 text-lg font-semibold text-gradient">{e.role}</h3>
              <p className="text-sm text-foreground/80">{e.org}</p>
              <p className="mt-3 text-sm text-muted-foreground">{e.body}</p>
              {e.links && (
                <ul className="mt-4 flex flex-wrap gap-2">
                  {e.links.map((l) => (
                    <li key={l.href}>
                      <a
                        href={l.href}
                        target="_blank"
                        rel="noreferrer"
                        className="glass inline-flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground hover:ring-electric"
                      >
                        <l.icon className="h-3.5 w-3.5" /> {l.label}
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </Section>
    </>
  );
}
