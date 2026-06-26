import { Section } from "./Section";
import { ArrowUpRight } from "lucide-react";

type Product = {
  name: string;
  tagline: string;
  status: "Live" | "In Build" | "Roadmap";
  problem: string;
  solution: string;
  market: string;
  features: string[];
  value: string;
};

const products: Product[] = [
  {
    name: "Hotel & Resort SaaS",
    tagline: "An operating system for hospitality.",
    status: "In Build",
    problem: "Resorts juggle bookings, rooms, F&B, staff and reporting across spreadsheets and disconnected tools.",
    solution: "A unified, multi-tenant platform: reservations, channel sync, housekeeping, POS, payments and analytics in one place.",
    market: "Boutique hotels and resorts across East Africa scaling toward international guests.",
    features: ["Reservations & channel manager", "Housekeeping workflows", "Restaurant POS", "Guest CRM", "Owner analytics"],
    value: "Cut administrative load, reduce overbookings, and unlock data-driven decisions.",
  },
  {
    name: "Property Management Platform",
    tagline: "Real estate, digitized end-to-end.",
    status: "In Build",
    problem: "Landlords and agencies still chase rent on paper and lose tenant history between phones.",
    solution: "Tenant onboarding, lease tracking, automated invoicing, M-Pesa & card payments, and maintenance tickets.",
    market: "Property managers, real-estate agencies and landlords with 5–500 units.",
    features: ["Tenant portal", "Lease lifecycle", "Rent automation", "Maintenance tickets", "Financial reports"],
    value: "Predictable cashflow and a complete audit trail for every unit.",
  },
  {
    name: "School Management ERP",
    tagline: "Run a whole school from one dashboard.",
    status: "Roadmap",
    problem: "Schools rely on registers, manual report cards, and disconnected fee tracking.",
    solution: "An ERP covering admissions, attendance, grading, report cards, fees, library and parent comms.",
    market: "Primary and secondary schools modernizing for hybrid learning.",
    features: ["Admissions", "Attendance", "Grading & reports", "Fee management", "Parent portal", "Library system"],
    value: "Teachers reclaim time. Parents stay informed. Administrators see everything.",
  },
  {
    name: "AI Analytics Dashboard",
    tagline: "Plain-English answers from your data.",
    status: "In Build",
    problem: "SMEs sit on data they can't read — sales, stock, customers — and decisions stay gut-driven.",
    solution: "An AI layer that ingests business data and answers natural-language questions with charts and insights.",
    market: "Retail, hospitality and service SMEs ready to act on data.",
    features: ["Natural-language queries", "Auto-generated charts", "Anomaly alerts", "KPI digests"],
    value: "From dashboards nobody opens to answers the team actually uses.",
  },
  {
    name: "Business Automation Suite",
    tagline: "Replace the manual loops.",
    status: "Roadmap",
    problem: "Teams burn hours on repetitive admin: invoicing, reminders, onboarding, reporting.",
    solution: "Modular automations and workflows tailored to each business — built on proven open APIs.",
    market: "Growing service businesses ready to scale without scaling headcount.",
    features: ["Workflow builder", "Document automation", "Email / WhatsApp sequencing", "Integrations"],
    value: "Reclaim the hours your team loses to copy-paste work.",
  },
  {
    name: "Educational Library Platform",
    tagline: "A modern catalog for modern learners.",
    status: "Roadmap",
    problem: "School and community libraries struggle with cataloging, borrowing, and digital resources.",
    solution: "Searchable catalog, borrowing workflows, digital resource hosting, and reader analytics.",
    market: "Schools, community libraries, and learning centers.",
    features: ["Catalog & search", "Borrow / return", "Digital resources", "Reader profiles"],
    value: "Put learning material in front of more learners, faster.",
  },
];

const statusStyles: Record<Product["status"], string> = {
  Live: "bg-[oklch(0.94_0.04_150)] text-[oklch(0.4_0.12_150)]",
  "In Build": "bg-[oklch(0.94_0.04_256)] text-[oklch(0.4_0.18_256)]",
  Roadmap: "bg-surface-2 text-ink-soft",
};

export function ProductsSection() {
  return (
    <Section
      eyebrow="// products"
      title={<>Products I&apos;m <span className="serif-italic text-electric">building.</span></>}
      description="A growing portfolio of SaaS platforms aimed at digitizing the way African businesses operate."
    >
      <div className="grid gap-5 md:grid-cols-2">
        {products.map((p, i) => (
          <article
            key={p.name}
            className="group relative flex flex-col rounded-3xl border border-rule bg-white p-7 transition-all hover:-translate-y-1 hover:border-ink hover:shadow-lg"
          >
            <div className="flex items-start justify-between gap-3">
              <p className="eyebrow">No. {String(i + 1).padStart(2, "0")}</p>
              <span className={`rounded-full px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-wider ${statusStyles[p.status]}`}>
                {p.status}
              </span>
            </div>
            <h3 className="mt-3 serif-display text-3xl text-ink">{p.name}</h3>
            <p className="mt-2 serif-italic text-lg text-ink-soft">{p.tagline}</p>

            <dl className="mt-6 space-y-4 text-sm">
              <div>
                <dt className="eyebrow">Problem</dt>
                <dd className="mt-1 leading-relaxed ink-soft">{p.problem}</dd>
              </div>
              <div>
                <dt className="eyebrow">Solution</dt>
                <dd className="mt-1 leading-relaxed ink-soft">{p.solution}</dd>
              </div>
              <div>
                <dt className="eyebrow">Target market</dt>
                <dd className="mt-1 leading-relaxed ink-soft">{p.market}</dd>
              </div>
              <div>
                <dt className="eyebrow">Features</dt>
                <dd className="mt-2 flex flex-wrap gap-1.5">
                  {p.features.map((f) => (
                    <span key={f} className="rounded-full border border-rule bg-surface px-2.5 py-0.5 font-mono text-[10px] text-ink-soft">
                      {f}
                    </span>
                  ))}
                </dd>
              </div>
            </dl>

            <p className="mt-6 rule-t pt-4 text-sm">
              <span className="eyebrow mr-2">Value</span>
              <span className="text-ink">{p.value}</span>
            </p>

            <ArrowUpRight className="absolute right-6 top-6 h-5 w-5 text-ink-soft opacity-0 transition-all group-hover:opacity-100" />
          </article>
        ))}
      </div>
    </Section>
  );
}
