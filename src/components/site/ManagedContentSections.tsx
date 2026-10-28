import { Section } from "./Section";
import type { SiteSection } from "@/lib/site-content";

export function ManagedContentSections({ sections }: { sections: SiteSection[] }) {
  const customSections = sections.filter((section) => section.kind === "custom");
  if (customSections.length === 0) return null;

  return (
    <>
      {customSections.map((section) => (
        <Section
          key={section.id}
          id={section.id}
          eyebrow={section.eyebrow}
          title={section.title}
          description={section.description}
        >
          <div className="max-w-3xl space-y-4 text-base leading-relaxed ink-soft sm:text-lg">
            {section.body
              .split(/\n\s*\n/)
              .filter(Boolean)
              .map((paragraph, index) => (
                <p key={`${section.id}-${index}`}>{paragraph}</p>
              ))}
          </div>
        </Section>
      ))}
    </>
  );
}
