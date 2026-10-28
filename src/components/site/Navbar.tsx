import { Link } from "@tanstack/react-router";
import { Menu, X, ArrowUpRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Logo } from "./Logo";

const links = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/projects", label: "Projects" },
  { to: "/blog", label: "Writing" },
  { to: "/resume", label: "Resume" },
  { to: "/contact", label: "Contact" },
] as const;

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        menuButtonRef.current?.focus();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  return (
    <header className="sticky top-3 z-50 mx-auto w-full max-w-7xl px-4 sm:px-6">
      <nav
        className={`flex items-center justify-between rounded-2xl border px-3 py-2.5 pl-3 transition-all duration-200 ${
          scrolled
            ? "border-white/10 bg-white/95 shadow-md backdrop-blur-xl"
            : "border-white/10 bg-white/85 shadow-sm backdrop-blur-lg"
        }`}
      >
        <Logo />

        <div className="hidden items-center gap-0.5 md:flex">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="rounded-lg px-3 py-2 text-sm font-medium text-ink-soft transition-colors hover:bg-surface hover:text-ink"
              activeProps={{
                className:
                  "rounded-lg px-3 py-2 text-sm font-semibold text-electric bg-[oklch(0.67_0.25_300_/_0.12)]",
              }}
              activeOptions={{ exact: l.to === "/" }}
            >
              {l.label}
            </Link>
          ))}
        </div>

        <div className="hidden md:block">
          <Link
            to="/contact"
            className="group inline-flex items-center gap-1.5 rounded-xl border border-white/10 bg-[var(--surface-2)] px-4 py-2.5 text-sm font-semibold text-ink transition-all hover:border-electric hover:bg-electric hover:shadow-blue"
          >
            Book a call
            <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </Link>
        </div>

        <button
          ref={menuButtonRef}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          aria-controls="mobile-navigation"
          onClick={() => setOpen((v) => !v)}
          className="rounded-xl p-2.5 text-ink transition-colors hover:bg-surface md:hidden"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      <nav
        id="mobile-navigation"
        aria-label="Mobile navigation"
        hidden={!open}
        className="mt-2 rounded-2xl border border-white/10 bg-white/95 p-3 shadow-lg backdrop-blur-xl md:hidden"
      >
        <div className="flex flex-col gap-1">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              onClick={() => setOpen(false)}
              className="rounded-xl px-3 py-3 text-sm font-medium text-ink-soft transition-colors hover:bg-surface hover:text-ink"
              activeProps={{
                className:
                  "rounded-xl px-3 py-3 text-sm font-semibold text-electric bg-[oklch(0.67_0.25_300_/_0.12)]",
              }}
              activeOptions={{ exact: l.to === "/" }}
            >
              {l.label}
            </Link>
          ))}
          <Link
            to="/contact"
            onClick={() => setOpen(false)}
            className="mt-1 rounded-xl bg-electric px-3 py-3 text-center text-sm font-semibold text-white"
          >
            Book a call
          </Link>
        </div>
      </nav>
    </header>
  );
}
