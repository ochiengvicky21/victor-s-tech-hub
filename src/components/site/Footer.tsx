import { Link } from "@tanstack/react-router";
import { Mail, Phone, ArrowUpRight } from "lucide-react";
import { SocialLinks } from "./SocialLinks";

export function Footer() {
  return (
    <footer className="rule-t mt-24 bg-paper">
      <div className="mx-auto w-full max-w-6xl px-5 py-16">
        <div className="grid gap-12 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <p className="eyebrow">Studio · Nairobi, Kenya</p>
            <h3 className="mt-4 serif-display text-4xl text-ink">
              Let&apos;s build the system <span className="serif-italic text-electric">your business deserves.</span>
            </h3>
            <Link
              to="/contact"
              className="mt-6 inline-flex items-center gap-1.5 rounded-full bg-ink px-5 py-3 text-sm font-medium text-paper hover:opacity-90"
            >
              Book a discovery call <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>

          <div>
            <p className="eyebrow">Contact</p>
            <ul className="mt-4 space-y-3 text-sm">
              <li>
                <a href="mailto:ochiengvicky21@gmail.com" className="inline-flex items-center gap-2 text-ink-soft hover:text-ink">
                  <Mail className="h-4 w-4" /> ochiengvicky21@gmail.com
                </a>
              </li>
              <li>
                <a href="tel:+254742676542" className="inline-flex items-center gap-2 text-ink-soft hover:text-ink">
                  <Phone className="h-4 w-4" /> +254 742 676 542
                </a>
              </li>
              <li>
                <a href="https://wa.me/254742676542" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-ink-soft hover:text-ink">
                  WhatsApp · +254 742 676 542
                </a>
              </li>
              <li>
                <a href="https://github.com/ochiengvicky21" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-ink-soft hover:text-ink">
                  github.com/ochiengvicky21
                </a>
              </li>
            </ul>
            <div className="mt-5">
              <SocialLinks />
            </div>
          </div>

          <div>
            <p className="eyebrow">Brands I manage</p>
            <ul className="mt-4 space-y-3 text-sm">
              <li>
                <a href="https://www.mungluecovillage.co.ke" target="_blank" rel="noreferrer" className="group inline-flex items-center gap-1.5 text-ink hover:text-electric">
                  Munglu Eco Village Resort
                  <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </a>
                <p className="mt-1 text-xs ink-soft">Website · Facebook · TikTok</p>
              </li>
              <li>
                <a href="https://www.facebook.com/MungluEcoVillageResort" target="_blank" rel="noreferrer" className="text-ink-soft hover:text-ink">
                  facebook.com/MungluEcoVillageResort
                </a>
              </li>
              <li>
                <a href="https://www.tiktok.com/@mungluecovillage" target="_blank" rel="noreferrer" className="text-ink-soft hover:text-ink">
                  tiktok.com/@mungluecovillage
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="rule-t mt-14 flex flex-col items-start justify-between gap-3 pt-6 text-xs ink-soft md:flex-row md:items-center">
          <p>© {new Date().getFullYear()} Victor Otieno Ochieng. All rights reserved.</p>
          <p className="font-mono">Designed and engineered in Nairobi · v3.0</p>
        </div>
      </div>
    </footer>
  );
}
