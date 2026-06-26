import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Code2, Cpu, Globe, Rocket } from "lucide-react";
import photoAsset from "@/assets/ochieng-victor.jpg.asset.json";
import { Section } from "@/components/site/Section";
import { fetchGhUser } from "@/lib/github";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — Ochieng Victor Otieno" },
      { name: "description", content: "About Ochieng Victor Otieno — software developer, builder, and creator behind the @v_o_otoday channel." },
      { property: "og:title", content: "About — Ochieng Victor Otieno" },
      { property: "og:description", content: "Software developer, builder, and creator." },
    ],
  }),
  component: About,
});

const skills = [
  { icon: Code2, title: "Frontend", body: "React, TypeScript, Tailwind — accessible, animated, fast." },
  { icon: Cpu, title: "Backend", body: "Node.js, Python, REST & realtime APIs, Postgres." },
  { icon: Globe, title: "Web Platforms", body: "Full-stack apps, dashboards, and content systems." },
  { icon: Rocket, title: "Shipping", body: "From idea to deploy — Git, CI/CD, cloud-native." },
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
              I&apos;m <span className="text-foreground">Ochieng Victor Otieno</span> — a software developer based in Kenya. I build modern web products with a focus on clean architecture, sharp interfaces, and meaningful user experiences.
            </p>
            <p>
              My work moves between frontend craft and backend systems. I enjoy projects where design, data, and code intersect — dashboards, real-time apps, content platforms.
            </p>
            <p>
              Outside of code I share tech on TikTok as <a className="text-accent hover:underline" target="_blank" rel="noreferrer" href="https://www.tiktok.com/@v_o_otoday">@v_o_otoday</a>, breaking down ideas for a curious audience.
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
    </>
  );
}
