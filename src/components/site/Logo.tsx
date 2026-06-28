import { Link } from "@tanstack/react-router";

export function Logo() {
  return (
    <Link to="/" className="group flex items-center gap-2.5">
      <span className="relative inline-flex h-9 w-9 items-center justify-center overflow-hidden rounded-full ring-1 ring-rule bg-surface">
        <img
          src="/ochieng-victor.jpg"
          alt="Victor Otieno Ochieng"
          className="h-full w-full object-cover"
          loading="eager"
          decoding="async"
        />
      </span>
      <span className="flex flex-col leading-none">
        <span className="font-serif text-[15px] tracking-tight text-ink">Victor Otieno</span>
        <span className="eyebrow mt-0.5 text-[9px]">Ochieng · engineer</span>
      </span>
    </Link>
  );
}
