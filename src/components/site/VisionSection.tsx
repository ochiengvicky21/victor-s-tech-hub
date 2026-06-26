import { Section } from "./Section";

export function VisionSection() {
  return (
    <Section eyebrow="// vision" bordered>
      <div className="grid gap-12 md:grid-cols-[1fr_1.4fr]">
        <div>
          <p className="eyebrow">The long horizon</p>
          <h2 className="mt-4 serif-display text-5xl text-ink sm:text-6xl">
            Building the software <span className="serif-italic text-electric">Africa</span> deserves.
          </h2>
        </div>
        <div className="space-y-5 text-base leading-relaxed ink-soft sm:text-lg">
          <p>
            My long-term mission is to build SaaS platforms that help African businesses digitize their
            operations while staying globally competitive. Hospitality, education, property, healthcare —
            sectors where the software either doesn&apos;t exist yet, or wasn&apos;t built for the way we work.
          </p>
          <p>
            That means platforms that speak local payment rails, run on patchy connectivity, scale to
            international users, and remain elegant under pressure. Products that earn the trust of the
            people who depend on them every day.
          </p>
          <p className="text-ink">
            Same standard as Stripe or Linear. Built from <span className="serif-italic">here</span>, for
            <span className="serif-italic"> everywhere.</span>
          </p>
        </div>
      </div>
    </Section>
  );
}
