import { Github, Mail, MessageCircle, Phone } from "lucide-react";
import type { ComponentType, SVGProps } from "react";

function TikTokIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.07A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43V8.93a8.16 8.16 0 0 0 4.77 1.52V7a4.85 4.85 0 0 1-1.04-.31z" />
    </svg>
  );
}

type Social = {
  href: string;
  label: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  external?: boolean;
};

const socials: Social[] = [
  { href: "https://github.com/ochiengvicky21", label: "GitHub", icon: Github, external: true },
  { href: "https://www.tiktok.com/@v_o_otoday", label: "TikTok @v_o_otoday", icon: TikTokIcon, external: true },
  { href: "https://wa.me/254742676542", label: "WhatsApp", icon: MessageCircle, external: true },
  { href: "tel:+254742676542", label: "Call", icon: Phone },
  { href: "mailto:ochiengvicky21@gmail.com", label: "Email", icon: Mail },
];

export function SocialLinks({ size = 16 }: { size?: number }) {
  return (
    <ul className="flex flex-wrap gap-2">
      {socials.map((s) => (
        <li key={s.label}>
          <a
            href={s.href}
            target={s.external ? "_blank" : undefined}
            rel={s.external ? "noreferrer" : undefined}
            aria-label={s.label}
            title={s.label}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-rule bg-white text-ink-soft transition-all hover:-translate-y-0.5 hover:border-ink hover:text-ink"
          >
            <s.icon style={{ width: size, height: size }} />
          </a>
        </li>
      ))}
    </ul>
  );
}
