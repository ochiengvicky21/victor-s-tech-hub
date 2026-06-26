import type { ReactNode } from "react";

export function Section({
  id,
  eyebrow,
  title,
  description,
  children,
}: {
  id?: string;
  eyebrow?: string;
  title?: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className="relative mx-auto w-full max-w-6xl px-4 py-16 sm:py-20">
      {(eyebrow || title || description) && (
        <div className="mb-10 max-w-2xl">
          {eyebrow && (
            <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-accent">
              {eyebrow}
            </p>
          )}
          {title && (
            <h2 className="mt-3 text-3xl font-semibold sm:text-4xl">
              <span className="text-gradient">{title}</span>
            </h2>
          )}
          {description && (
            <p className="mt-3 text-base text-muted-foreground">{description}</p>
          )}
        </div>
      )}
      {children}
    </section>
  );
}
