import { Section } from "./Section";

const reasons = [
  { title: "Business-first thinking", body: "Code is the easy part. I start with the outcome you actually need." },
  { title: "Scalable architecture", body: "Built so version two doesn't require throwing away version one." },
  { title: "Modern UI", body: "Editorial-grade design — clear, calm, and respectful of attention." },
  { title: "Performance", body: "Sub-second loads, lean bundles, fast on the devices your customers actually use." },
  { title: "Security", body: "Auth, roles, audit trails and sensible defaults from day one." },
  { title: "Maintainability", body: "Typed, tested, documented — the next engineer can move on day one." },
  { title: "Long-term support", body: "I stay around. Quarterly reviews and a real upgrade path." },
  { title: "Enterprise mindset", body: "SLAs, environments, observability and DR planning — not afterthoughts." },
  { title: "AI-first solutions", body: "Where AI adds clarity or removes work, I bring it in — quietly and well." },
];

export function WhyMeSection() {
  return (
    <Section
      eyebrow="// why me"
      title={<>What you get when we <span className="serif-italic text-electric">work together.</span></>}
    >
      <div className="grid gap-px overflow-hidden rounded-3xl border border-rule bg-rule sm:grid-cols-2 lg:grid-cols-3">
        {reasons.map((r) => (
          <div key={r.title} className="bg-white p-7">
            <h3 className="font-sans text-base font-semibold text-ink">{r.title}</h3>
            <p className="mt-3 text-sm leading-relaxed ink-soft">{r.body}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}
