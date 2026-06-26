import { Link } from "@tanstack/react-router";

export function Logo() {
  return (
    <Link to="/" className="group flex items-center gap-2.5">
      <span className="relative inline-flex h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-ink text-paper">
        <span className="absolute inset-0 bg-gradient-to-br from-[oklch(0.3_0.05_256)] to-ink" />
        <span className="relative font-serif text-[15px] leading-none italic">vo</span>
        <span className="absolute right-1.5 top-1.5 h-1 w-1 rounded-full bg-[oklch(0.7_0.18_200)]" />
      </span>
      <span className="flex flex-col leading-none">
        <span className="font-serif text-[15px] tracking-tight text-ink">Victor Otieno</span>
        <span className="eyebrow mt-0.5 text-[9px]">Ochieng · engineer</span>
      </span>
    </Link>
  );
}
