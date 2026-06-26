import { Section } from "./Section";

const steps = [
  { n: "01", title: "Discovery", body: "We map the business, the users, and the wins that actually matter." },
  { n: "02", title: "Research", body: "Audit existing tools, study the market, surface real constraints." },
  { n: "03", title: "Architecture", body: "Pick the right stack and shape the system for the next 3 years." },
  { n: "04", title: "UX Design", body: "Editorial, accessible interfaces — usable on day one, beautiful on day one hundred." },
  { n: "05", title: "Development", body: "Modular, typed, tested code with CI on every push." },
  { n: "06", title: "Testing", body: "Manual, automated, and user-facing — before anything ships." },
  { n: "07", title: "Deployment", body: "Production-grade hosting with observability and rollbacks ready." },
  { n: "08", title: "Optimization", body: "Tighten performance, SEO, conversion — measured, not assumed." },
  { n: "09", title: "Support", body: "I stay close after launch. Software is a relationship, not a delivery." },
  { n: "10", title: "Continuous Improvement", body: "Quarterly reviews, roadmap updates, and the next horizon." },
];

export function ProcessSection() {
  return (
    <Section
      eyebrow="// process"
      title={<>How I <span className="serif-italic text-electric">work.</span></>}
      description="A repeatable system from first conversation to long-term partnership."
    >
      <ol className="grid gap-px overflow-hidden rounded-3xl border border-rule bg-rule sm:grid-cols-2 lg:grid-cols-5">
        {steps.map((s) => (
          <li key={s.n} className="bg-white p-6">
            <p className="font-mono text-xs text-electric">{s.n}</p>
            <h3 className="mt-3 font-sans text-sm font-semibold text-ink">{s.title}</h3>
            <p className="mt-2 text-xs leading-relaxed ink-soft">{s.body}</p>
          </li>
        ))}
      </ol>
    </Section>
  );
}
