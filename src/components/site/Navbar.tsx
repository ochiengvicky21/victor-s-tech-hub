import { Link } from "@tanstack/react-router";
import { Menu, X, ArrowUpRight } from "lucide-react";
import { useEffect, useState } from "react";
import { Logo } from "./Logo";

const links = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/projects", label: "Work" },
  { to: "/contact", label: "Contact" },
] as const;

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="sticky top-3 z-50 mx-auto w-full max-w-6xl px-4">
      <nav
        className={`flex items-center justify-between rounded-full border border-rule px-3 py-2 pl-3 transition-all ${
          scrolled ? "bg-white/85 shadow-sm backdrop-blur-md" : "bg-white/60 backdrop-blur"
        }`}
      >
        <Logo />

        <div className="hidden items-center gap-0.5 md:flex">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="rounded-full px-3.5 py-1.5 text-sm font-medium text-ink-soft transition-colors hover:bg-surface-2 hover:text-ink"
              activeProps={{ className: "rounded-full px-3.5 py-1.5 text-sm font-medium text-ink bg-surface-2" }}
              activeOptions={{ exact: l.to === "/" }}
            >
              {l.label}
            </Link>
          ))}
        </div>

        <div className="hidden md:block">
          <Link
            to="/contact"
            className="group inline-flex items-center gap-1.5 rounded-full bg-ink px-4 py-2 text-sm font-medium text-paper transition-transform hover:scale-[1.02]"
          >
            Book a call
            <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </Link>
        </div>

        <button
          aria-label="Toggle menu"
          onClick={() => setOpen((v) => !v)}
          className="rounded-full p-2 text-ink hover:bg-surface-2 md:hidden"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      {open && (
        <div className="mt-2 flex flex-col gap-1 rounded-2xl border border-rule bg-white p-3 shadow-md md:hidden">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              onClick={() => setOpen(false)}
              className="rounded-xl px-3 py-2 text-sm font-medium text-ink-soft hover:bg-surface-2 hover:text-ink"
              activeProps={{ className: "rounded-xl px-3 py-2 text-sm font-medium text-ink bg-surface-2" }}
              activeOptions={{ exact: l.to === "/" }}
            >
              {l.label}
            </Link>
          ))}
          <Link
            to="/contact"
            onClick={() => setOpen(false)}
            className="mt-1 rounded-xl bg-ink px-3 py-2 text-center text-sm font-medium text-paper"
          >
            Book a call
          </Link>
        </div>
      )}
    </header>
  );
}
