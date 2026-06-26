import { Section } from "./Section";

const milestones = [
  { year: "Early", title: "Learning programming", body: "Picked up the fundamentals — logic, structure, the joy of making a machine do something." },
  { year: "Then", title: "Building full-stack projects", body: "Stitched frontends to backends, databases to APIs, and shipped the first real things." },
  { year: "Next", title: "Developing business platforms", body: "Started building tools that real businesses used to run real operations." },
  { year: "Now", title: "Exploring AI", body: "Layering intelligence into products — assistants, automation, analysis." },
  { year: "Now", title: "Designing SaaS products", body: "Multi-tenant, role-based, billable — products built to outlast the founder." },
  { year: "Active", title: "Working with SMEs", body: "Partnering with hospitality, education, real-estate and service businesses to digitize." },
  { year: "Next", title: "Preparing enterprise solutions", body: "Scaling architecture and process toward enterprise-grade engagements." },
];

export function TimelineSection() {
  return (
    <Section
      eyebrow="// journey"
      title={<>The path so <span className="serif-italic text-electric">far.</span></>}
      description="A working timeline — not a résumé."
    >
      <ol className="relative ml-3 space-y-10 border-l border-rule pl-8">
        {milestones.map((m, i) => (
          <li key={i} className="relative">
            <span className="absolute -left-[37px] top-1.5 inline-flex h-3.5 w-3.5 items-center justify-center rounded-full border border-rule bg-white">
              <span className="h-1.5 w-1.5 rounded-full bg-electric" />
            </span>
            <p className="eyebrow">{m.year}</p>
            <h3 className="mt-2 serif-display text-2xl text-ink">{m.title}</h3>
            <p className="mt-2 max-w-xl text-sm leading-relaxed ink-soft">{m.body}</p>
          </li>
        ))}
      </ol>
    </Section>
  );
}
