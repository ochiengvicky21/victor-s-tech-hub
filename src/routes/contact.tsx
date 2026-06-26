import { createFileRoute } from "@tanstack/react-router";
import { Mail, MessageCircle, Phone, ArrowUpRight, MapPin, Clock, Briefcase } from "lucide-react";
import { Section } from "@/components/site/Section";
import { SocialLinks } from "@/components/site/SocialLinks";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Victor Otieno Ochieng" },
      { name: "description", content: "Get in touch with Victor Otieno Ochieng — email, phone, WhatsApp, GitHub, TikTok. Open to remote, hybrid and international opportunities." },
      { property: "og:title", content: "Contact — Victor Otieno Ochieng" },
    ],
  }),
  component: Contact,
});

const channels = [
  { icon: Mail, label: "Email", value: "ochiengvicky21@gmail.com", href: "mailto:ochiengvicky21@gmail.com", note: "Best for project briefs and proposals." },
  { icon: MessageCircle, label: "WhatsApp", value: "+254 742 676 542", href: "https://wa.me/254742676542", note: "Fastest channel — usually same-day." },
  { icon: Phone, label: "Call", value: "+254 742 676 542", href: "tel:+254742676542", note: "Mon–Sat · 9:00–18:00 EAT." },
] as const;

const meta = [
  { icon: MapPin, label: "Location", value: "Nairobi, Kenya" },
  { icon: Clock, label: "Time zone", value: "EAT · UTC+3" },
  { icon: Briefcase, label: "Open to", value: "Remote · Hybrid · International" },
];

function Contact() {
  return (
    <>
      <section className="mx-auto w-full max-w-6xl px-5 pt-16 sm:pt-24">
        <p className="eyebrow">// contact</p>
        <h1 className="mt-6 serif-display text-[clamp(3rem,7vw,6rem)]">
          Let&apos;s build <span className="serif-italic text-electric">something serious.</span>
        </h1>
        <p className="mt-6 max-w-2xl text-lg ink-soft">
          Pick a channel — I read everything and reply quickly. For new projects, a short brief
          via email gets the fastest, deepest response.
        </p>
      </section>

      <Section>
        <div className="grid gap-5 md:grid-cols-3">
          {channels.map((c) => (
            <a
              key={c.label}
              href={c.href}
              target={c.href.startsWith("http") ? "_blank" : undefined}
              rel={c.href.startsWith("http") ? "noreferrer" : undefined}
              className="group rounded-3xl border border-rule bg-white p-7 transition-all hover:-translate-y-1 hover:border-ink hover:shadow-md"
            >
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-surface text-ink group-hover:bg-ink group-hover:text-paper">
                <c.icon className="h-5 w-5" />
              </span>
              <p className="eyebrow mt-5">{c.label}</p>
              <p className="mt-2 serif-display text-2xl text-ink group-hover:text-electric">{c.value}</p>
              <p className="mt-3 text-sm ink-soft">{c.note}</p>
              <span className="mt-5 inline-flex items-center gap-1 text-xs font-medium text-ink-soft group-hover:text-ink">
                Open <ArrowUpRight className="h-3 w-3" />
              </span>
            </a>
          ))}
        </div>

        {/* CTAs */}
        <div className="mt-10 grid gap-5 md:grid-cols-2">
          <a href="https://wa.me/254742676542?text=Hi%20Victor%2C%20I%27d%20like%20to%20book%20a%20discovery%20call." target="_blank" rel="noreferrer" className="group rounded-3xl border border-rule bg-ink p-8 text-paper transition-all hover:opacity-95">
            <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-paper/60">// schedule</p>
            <h3 className="mt-3 serif-display text-3xl">Book a discovery call</h3>
            <p className="mt-3 text-sm text-paper/70">A 30-minute call to understand your business, your constraints, and what we&apos;d build.</p>
            <span className="mt-5 inline-flex items-center gap-1 text-sm font-medium">Open WhatsApp <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" /></span>
          </a>
          <a href="mailto:ochiengvicky21@gmail.com?subject=Project%20proposal%20request" className="group rounded-3xl border border-ink bg-white p-8 text-ink transition-all hover:bg-paper">
            <p className="eyebrow">// proposal</p>
            <h3 className="mt-3 serif-display text-3xl">Request a proposal</h3>
            <p className="mt-3 text-sm ink-soft">Send a brief and you&apos;ll receive a scoped proposal — timeline, deliverables, investment.</p>
            <span className="mt-5 inline-flex items-center gap-1 text-sm font-medium">Compose email <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" /></span>
          </a>
        </div>

        {/* Meta */}
        <div className="mt-10 grid gap-px overflow-hidden rounded-3xl border border-rule bg-rule sm:grid-cols-3">
          {meta.map((m) => (
            <div key={m.label} className="bg-white p-6">
              <p className="eyebrow inline-flex items-center gap-2"><m.icon className="h-3.5 w-3.5" /> {m.label}</p>
              <p className="mt-2 serif-display text-2xl text-ink">{m.value}</p>
            </div>
          ))}
        </div>

        {/* Elsewhere */}
        <div className="mt-10 rounded-3xl border border-rule bg-white p-8">
          <p className="eyebrow">// elsewhere</p>
          <h3 className="mt-3 serif-display text-3xl text-ink">Find me across the network</h3>
          <p className="mt-3 max-w-xl text-sm ink-soft">Follow @v_o_otoday on TikTok for tech work, or check live code on GitHub.</p>
          <div className="mt-5">
            <SocialLinks />
          </div>
        </div>
      </Section>
    </>
  );
}
