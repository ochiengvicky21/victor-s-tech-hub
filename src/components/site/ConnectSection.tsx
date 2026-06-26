import { Github, Mail, MessageCircle, Phone, Facebook, ArrowUpRight } from "lucide-react";
import type { ComponentType, SVGProps } from "react";
import { Section } from "./Section";

function TikTokIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.07A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43V8.93a8.16 8.16 0 0 0 4.77 1.52V7a4.85 4.85 0 0 1-1.04-.31z" />
    </svg>
  );
}

type Card = { href: string; label: string; handle: string; icon: ComponentType<SVGProps<SVGSVGElement>> };

const personal: Card[] = [
  { href: "https://www.tiktok.com/@v_o_otoday", label: "TikTok", handle: "@v_o_otoday", icon: TikTokIcon },
  { href: "https://github.com/ochiengvicky21", label: "GitHub", handle: "@ochiengvicky21", icon: Github },
  { href: "https://wa.me/254742676542", label: "WhatsApp", handle: "+254 742 676 542", icon: MessageCircle },
  { href: "tel:+254742676542", label: "Phone", handle: "+254 742 676 542", icon: Phone },
  { href: "mailto:ochiengvicky21@gmail.com", label: "Email", handle: "ochiengvicky21@gmail.com", icon: Mail },
];

const managed: Card[] = [
  { href: "https://www.facebook.com/MungluEcoVillageResort", label: "Munglu · Facebook", handle: "MungluEcoVillageResort", icon: Facebook },
  { href: "https://www.tiktok.com/@mungluecovillage", label: "Munglu · TikTok", handle: "@mungluecovillage", icon: TikTokIcon },
  { href: "https://www.mungluecovillage.co.ke", label: "Munglu · Website", handle: "mungluecovillage.co.ke", icon: ArrowUpRight },
];

function Tile({ s }: { s: Card }) {
  const external = s.href.startsWith("http");
  return (
    <a
      href={s.href}
      target={external ? "_blank" : undefined}
      rel={external ? "noreferrer" : undefined}
      className="group flex items-center gap-3 rounded-2xl border border-rule bg-white p-4 transition-all hover:-translate-y-0.5 hover:border-ink hover:shadow-sm"
    >
      <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-surface text-ink">
        <s.icon className="h-4 w-4" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-sm font-semibold text-ink">{s.label}</span>
        <span className="block truncate font-mono text-xs ink-soft">{s.handle}</span>
      </span>
      <ArrowUpRight className="h-4 w-4 shrink-0 text-ink-soft transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
    </a>
  );
}

export function ConnectSection() {
  return (
    <Section eyebrow="// connect" title={<>Find me <span className="serif-italic text-electric">across the grid.</span></>} description="Personal channels, plus the brands I run.">
      <div className="space-y-10">
        <div>
          <p className="eyebrow mb-4">Personal</p>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {personal.map((s) => <Tile key={s.label} s={s} />)}
          </div>
        </div>
        <div>
          <p className="eyebrow mb-4">Brands I manage</p>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {managed.map((s) => <Tile key={s.label} s={s} />)}
          </div>
        </div>
      </div>
    </Section>
  );
}
