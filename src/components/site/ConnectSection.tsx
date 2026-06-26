import { Github, Mail, MessageCircle, Phone, Facebook, ExternalLink } from "lucide-react";
import type { ComponentType, SVGProps } from "react";
import { Section } from "./Section";

function TikTokIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.07A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43V8.93a8.16 8.16 0 0 0 4.77 1.52V7a4.85 4.85 0 0 1-1.04-.31z" />
    </svg>
  );
}

type SocialCard = {
  href: string;
  label: string;
  handle: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  tint: string; // tailwind text color class
};

const personal: SocialCard[] = [
  { href: "https://www.tiktok.com/@v_o_otoday", label: "TikTok", handle: "@v_o_otoday", icon: TikTokIcon, tint: "text-pink-400" },
  { href: "https://github.com/ochiengvicky21", label: "GitHub", handle: "@ochiengvicky21", icon: Github, tint: "text-foreground" },
  { href: "https://wa.me/254742676542", label: "WhatsApp", handle: "+254 742 676 542", icon: MessageCircle, tint: "text-green-400" },
  { href: "tel:+254742676542", label: "Phone", handle: "+254 742 676 542", icon: Phone, tint: "text-accent" },
  { href: "mailto:ochiengvicky21@gmail.com", label: "Email", handle: "ochiengvicky21@gmail.com", icon: Mail, tint: "text-cyan-300" },
];

const managed: SocialCard[] = [
  { href: "https://www.facebook.com/MungluEcoVillageResort", label: "Munglu Eco Village · Facebook", handle: "MungluEcoVillageResort", icon: Facebook, tint: "text-blue-400" },
  { href: "https://www.tiktok.com/@mungluecovillage", label: "Munglu Eco Village · TikTok", handle: "@mungluecovillage", icon: TikTokIcon, tint: "text-pink-400" },
  { href: "https://www.mungluecovillage.co.ke", label: "Munglu Eco Village · Website", handle: "mungluecovillage.co.ke", icon: ExternalLink, tint: "text-accent" },
];

function Card({ s }: { s: SocialCard }) {
  const external = s.href.startsWith("http");
  return (
    <a
      href={s.href}
      target={external ? "_blank" : undefined}
      rel={external ? "noreferrer" : undefined}
      className="glass glow-border group flex items-center gap-3 rounded-2xl p-4 transition-all hover:-translate-y-0.5 hover:ring-electric"
    >
      <span className={`glass inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${s.tint}`}>
        <s.icon className="h-5 w-5" />
      </span>
      <span className="min-w-0">
        <span className="block text-sm font-semibold text-foreground">{s.label}</span>
        <span className="block truncate font-mono text-xs text-muted-foreground">{s.handle}</span>
      </span>
    </a>
  );
}

export function ConnectSection() {
  return (
    <Section
      eyebrow="// connect"
      title="Find me across the grid"
      description="Personal channels, plus the brands I manage."
    >
      <div className="space-y-6">
        <div>
          <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.3em] text-accent">// personal</p>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {personal.map((s) => <Card key={s.label} s={s} />)}
          </div>
        </div>
        <div>
          <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.3em] text-accent">// brands I manage</p>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {managed.map((s) => <Card key={s.label} s={s} />)}
          </div>
        </div>
      </div>
    </Section>
  );
}
