import { Section } from "./Section";

const posts = [
  { category: "AI", title: "When AI actually belongs in your product", excerpt: "A working framework for deciding where intelligence helps — and where it just adds noise.", date: "Coming soon" },
  { category: "SaaS", title: "Designing multi-tenant from day one", excerpt: "What changes between a side project and a real SaaS, and the decisions you can't reverse later.", date: "Coming soon" },
  { category: "Hospitality Tech", title: "The software gap in African resorts", excerpt: "What boutique hotels actually need from a PMS — and why most global tools miss the mark.", date: "Coming soon" },
  { category: "EdTech", title: "Rebuilding the school ERP", excerpt: "Lessons from designing an ERP that teachers, parents and administrators all want to open.", date: "Coming soon" },
  { category: "Engineering", title: "The architecture I default to in 2025", excerpt: "TypeScript, Postgres, edge-first hosting — the stack I reach for unless I have a reason not to.", date: "Coming soon" },
  { category: "Business", title: "Selling outcomes, not stacks", excerpt: "How to price, scope and pitch software work in a market that still thinks in hours.", date: "Coming soon" },
];

export function InsightsSection() {
  return (
    <Section
      eyebrow="// insights"
      title={<>Notes from the <span className="serif-italic text-electric">work.</span></>}
      description="Essays on AI, SaaS, digital transformation, and the craft of building software in 2025."
    >
      <div className="grid gap-px overflow-hidden rounded-3xl border border-rule bg-rule md:grid-cols-2 lg:grid-cols-3">
        {posts.map((p) => (
          <article key={p.title} className="group flex flex-col bg-white p-7 transition-colors hover:bg-paper">
            <p className="eyebrow">{p.category}</p>
            <h3 className="mt-4 serif-display text-2xl text-ink">{p.title}</h3>
            <p className="mt-3 text-sm leading-relaxed ink-soft">{p.excerpt}</p>
            <p className="mt-6 font-mono text-[10px] uppercase tracking-wider text-ink-soft">{p.date}</p>
          </article>
        ))}
      </div>
    </Section>
  );
}
