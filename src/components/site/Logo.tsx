import logoAsset from "@/assets/voo-logo.png";
import { Link } from "@tanstack/react-router";

export function Logo({ size = 36 }: { size?: number }) {
  return (
    <Link to="/" className="group flex items-center gap-3">
      <span
        className="relative inline-flex shrink-0 items-center justify-center"
        style={{ width: size, height: size }}
      >
        <span
          aria-hidden
          className="absolute inset-0 rounded-full blur-md opacity-60 group-hover:opacity-90 transition-opacity"
          style={{ background: "var(--gradient-aurora)" }}
        />
        <img
          src={logoAsset}
          width={size}
          height={size}
          alt="VOO — Ochieng Victor Otieno logo"
          className="relative drop-shadow-[0_0_8px_oklch(0.72_0.22_255_/_0.6)]"
        />
      </span>
      <span className="flex flex-col leading-none">
        <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
          voo //
        </span>
        <span className="font-display text-sm font-semibold text-foreground">
          Ochieng Victor
        </span>
      </span>
    </Link>
  );
}
