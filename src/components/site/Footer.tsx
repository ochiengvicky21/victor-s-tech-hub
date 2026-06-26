import { Github, Mail, Phone } from "lucide-react";
import { SocialLinks } from "./SocialLinks";

export function Footer() {
  return (
    <footer className="mx-auto mt-24 w-full max-w-6xl px-4 pb-10">
      <div className="glass rounded-3xl p-8">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
              // signal
            </p>
            <h3 className="mt-2 text-lg font-semibold text-gradient">
              Ochieng Victor Otieno
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Building electric digital experiences. Open to collaboration,
              freelance, and full-time roles.
            </p>
          </div>

          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
              // contact
            </p>
            <ul className="mt-3 space-y-2 text-sm">
              <li>
                <a href="mailto:ochienvicky21@gmail.com" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground">
                  <Mail className="h-4 w-4" /> ochienvicky21@gmail.com
                </a>
              </li>
              <li>
                <a href="tel:+254742676542" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground">
                  <Phone className="h-4 w-4" /> +254 742 676 542
                </a>
              </li>
              <li>
                <a href="https://github.com/ochingvicky21" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground">
                  <Github className="h-4 w-4" /> github.com/ochingvicky21
                </a>
              </li>
            </ul>
          </div>

          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
              // network
            </p>
            <div className="mt-3">
              <SocialLinks />
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-col items-center justify-between gap-2 border-t border-white/10 pt-4 text-xs text-muted-foreground md:flex-row">
          <p>© {new Date().getFullYear()} Ochieng Victor Otieno. All systems online.</p>
          <p className="font-mono">v_o_o // built with electric energy</p>
        </div>
      </div>
    </footer>
  );
}
