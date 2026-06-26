import { createFileRoute } from "@tanstack/react-router";
import { Mail, MessageCircle, Phone } from "lucide-react";
import { Section } from "@/components/site/Section";
import { SocialLinks } from "@/components/site/SocialLinks";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Ochieng Victor Otieno" },
      { name: "description", content: "Get in touch with Ochieng Victor Otieno via email, phone, WhatsApp, GitHub or TikTok." },
      { property: "og:title", content: "Contact — Ochieng Victor Otieno" },
      { property: "og:description", content: "Email, phone, WhatsApp, GitHub, TikTok." },
    ],
  }),
  component: Contact,
});

const channels = [
  {
    icon: Mail,
    label: "Email",
    value: "ochienvicky21@gmail.com",
    href: "mailto:ochienvicky21@gmail.com",
    note: "Best for project briefs and long-form messages.",
  },
  {
    icon: MessageCircle,
    label: "WhatsApp",
    value: "+254 742 676 542",
    href: "https://wa.me/254742676542",
    note: "Fastest channel — usually a same-day reply.",
  },
  {
    icon: Phone,
    label: "Call",
    value: "+254 742 676 542",
    href: "tel:+254742676542",
    note: "Available Mon–Sat, 9:00–18:00 EAT.",
  },
] as const;

function Contact() {
  return (
    <Section
      eyebrow="// contact"
      title="Let's build something electric"
      description="Pick a channel — I read everything and reply quickly."
    >
      <div className="grid gap-4 md:grid-cols-3">
        {channels.map((c) => (
          <a
            key={c.label}
            href={c.href}
            target={c.href.startsWith("http") ? "_blank" : undefined}
            rel={c.href.startsWith("http") ? "noreferrer" : undefined}
            className="glass glow-border group rounded-2xl p-6 transition-all hover:-translate-y-1 hover:shadow-[var(--shadow-glow-md)]"
          >
            <div className="glass inline-flex h-11 w-11 items-center justify-center rounded-xl text-accent">
              <c.icon className="h-5 w-5" />
            </div>
            <h3 className="mt-4 font-mono text-[11px] uppercase tracking-[0.25em] text-muted-foreground">
              {c.label}
            </h3>
            <p className="mt-1 text-lg font-semibold text-foreground group-hover:text-gradient">
              {c.value}
            </p>
            <p className="mt-2 text-sm text-muted-foreground">{c.note}</p>
          </a>
        ))}
      </div>

      <div className="glass-strong glow-border mt-10 rounded-3xl p-8">
        <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-accent">// elsewhere</p>
        <h3 className="mt-2 text-xl font-semibold">Find me across the network</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Follow @v_o_otoday on TikTok for tech breakdowns, or check live work on GitHub.
        </p>
        <div className="mt-5">
          <SocialLinks />
        </div>
      </div>
    </Section>
  );
}
