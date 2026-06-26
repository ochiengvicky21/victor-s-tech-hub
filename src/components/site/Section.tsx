import type { ReactNode } from "react";

export function Section({
  id,
  eyebrow,
  title,
  description,
  align = "left",
  bordered = false,
  children,
  className = "",
}: {
  id?: string;
  eyebrow?: string;
  title?: ReactNode;
  description?: ReactNode;
  align?: "left" | "center";
  bordered?: boolean;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      id={id}
      className={`relative mx-auto w-full max-w-6xl px-5 py-20 sm:py-28 ${bordered ? "rule-t" : ""} ${className}`}
    >
      {(eyebrow || title || description) && (
        <div className={`mb-12 max-w-3xl ${align === "center" ? "mx-auto text-center" : ""}`}>
          {eyebrow && <p className="eyebrow">{eyebrow}</p>}
          {title && (
            <h2 className="mt-4 serif-display text-4xl sm:text-5xl md:text-6xl">
              {title}
            </h2>
          )}
          {description && (
            <p className="mt-5 max-w-2xl text-base leading-relaxed ink-soft sm:text-lg">
              {description}
            </p>
          )}
        </div>
      )}
      {children}
    </section>
  );
}
