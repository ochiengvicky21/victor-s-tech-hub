import { Link } from "@tanstack/react-router";
import { Mail, Phone, ArrowUpRight } from "lucide-react";
import { SocialLinks } from "./SocialLinks";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-white/10 bg-[var(--navy)] text-white">
      <div className="mx-auto w-full max-w-7xl px-5 py-16 sm:px-6">
        <div className="grid gap-12 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-white/50">
              Independent software engineer · Nairobi, Kenya
            </p>
            <h3 className="mt-4 max-w-xl text-3xl font-semibold leading-tight tracking-tight text-white sm:text-4xl">
              Let&apos;s build software that{" "}
              <span className="text-electric">moves your business forward.</span>
            </h3>
            <Link
              to="/contact"
              className="mt-6 inline-flex items-center gap-1.5 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-[var(--navy)] transition-colors hover:bg-[oklch(0.95_0.025_235)]"
            >
              Book a discovery call <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>

          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-white/50">
              Contact
            </p>
            <ul className="mt-4 space-y-3 text-sm">
              <li>
                <a
                  href="mailto:ochiengvicky21@gmail.com"
                  className="inline-flex items-center gap-2 text-white/70 transition-colors hover:text-white"
                >
                  <Mail className="h-4 w-4" /> ochiengvicky21@gmail.com
                </a>
              </li>
              <li>
                <a
                  href="tel:+254742676542"
                  className="inline-flex items-center gap-2 text-white/70 transition-colors hover:text-white"
                >
                  <Phone className="h-4 w-4" /> +254 742 676 542
                </a>
              </li>
              <li>
                <a
                  href="https://wa.me/254742676542"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 text-white/70 transition-colors hover:text-white"
                >
                  WhatsApp · +254 742 676 542
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/ochiengvicky21"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 text-white/70 transition-colors hover:text-white"
                >
                  github.com/ochiengvicky21
                </a>
              </li>
            </ul>
            <div className="mt-5">
              <SocialLinks />
            </div>
          </div>

          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-white/50">
              Brands I manage
            </p>
            <ul className="mt-4 space-y-3 text-sm">
              <li>
                <a
                  href="https://www.mungluecovillage.co.ke"
                  target="_blank"
                  rel="noreferrer"
                  className="group inline-flex items-center gap-1.5 text-white hover:text-electric"
                >
                  Munglu Eco Village Resort
                  <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </a>
                <p className="mt-1 text-xs text-white/50">Website · Facebook · TikTok</p>
              </li>
              <li>
                <a
                  href="https://www.facebook.com/MungluEcoVillageResort"
                  target="_blank"
                  rel="noreferrer"
                  className="text-white/70 transition-colors hover:text-white"
                >
                  facebook.com/MungluEcoVillageResort
                </a>
              </li>
              <li>
                <a
                  href="https://www.tiktok.com/@mungluecovillage"
                  target="_blank"
                  rel="noreferrer"
                  className="text-white/70 transition-colors hover:text-white"
                >
                  tiktok.com/@mungluecovillage
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-start justify-between gap-3 border-t border-white/10 pt-6 text-xs text-white/50 md:flex-row md:items-center">
          <p>© {new Date().getFullYear()} Victor Otieno Ochieng. All rights reserved.</p>
          <p className="font-mono">Designed and engineered in Nairobi · v3.0</p>
        </div>
      </div>
    </footer>
  );
}
