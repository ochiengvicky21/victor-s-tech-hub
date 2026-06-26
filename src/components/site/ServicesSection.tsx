import { Section } from "./Section";
import {
  Globe,
  Cpu,
  Workflow,
  LayoutDashboard,
  Boxes,
  CalendarRange,
  GraduationCap,
  HeartPulse,
  Building2,
  CloudCog,
  Plug,
  Database,
  CreditCard,
  Gauge,
  Lightbulb,
} from "lucide-react";

const services = [
  { icon: Globe, title: "Enterprise Websites", body: "Marketing sites that close deals — fast, on-brand, and built to scale." },
  { icon: LayoutDashboard, title: "Custom Web Applications", body: "Bespoke tools that fit the way your team actually works." },
  { icon: Workflow, title: "Business Automation", body: "Cut manual loops — invoices, reminders, onboarding, reporting." },
  { icon: Cpu, title: "AI Integration", body: "Bring intelligence to existing products: assistants, search, summaries." },
  { icon: Gauge, title: "Workflow Automation", body: "Stitch the tools you already pay for into one reliable pipeline." },
  { icon: LayoutDashboard, title: "Dashboards & Analytics", body: "Decisions become obvious when the numbers are clear and live." },
  { icon: Boxes, title: "SaaS Development", body: "Multi-tenant platforms with billing, roles and admin built in." },
  { icon: CalendarRange, title: "Booking Platforms", body: "Reservations, calendars, payments — for hotels, salons, services." },
  { icon: GraduationCap, title: "Educational Systems", body: "School ERPs, libraries, e-learning — purpose-built for schools." },
  { icon: HeartPulse, title: "Healthcare Systems", body: "Clinic management, patient records, scheduling — secure by design." },
  { icon: Building2, title: "Property Management", body: "Lease, rent, maintenance and tenant comms in one platform." },
  { icon: CloudCog, title: "Cloud Deployment", body: "Production-grade hosting on Vercel, Netlify, AWS or Supabase." },
  { icon: Plug, title: "API Development", body: "REST and realtime APIs that other systems can trust." },
  { icon: Database, title: "Database Architecture", body: "Schemas, relations, indexing and scaling on Postgres or MySQL." },
  { icon: CreditCard, title: "Payment Integration", body: "M-Pesa, Stripe, PayPal — checkout that just works." },
  { icon: Gauge, title: "Performance Optimization", body: "Speed, SEO, Core Web Vitals — engineered, not guessed." },
  { icon: Lightbulb, title: "Technical Consulting", body: "Strategy, architecture reviews, and second opinions you can act on." },
];

export function ServicesSection() {
  return (
    <Section
      eyebrow="// services"
      title={<>What I do for <span className="serif-italic text-electric">businesses.</span></>}
      description="I sell outcomes, not stacks. Each engagement is designed around the result you actually need."
    >
      <div className="grid gap-px overflow-hidden rounded-3xl border border-rule bg-rule sm:grid-cols-2 lg:grid-cols-3">
        {services.map((s) => (
          <div key={s.title} className="group bg-white p-7 transition-colors hover:bg-paper">
            <div className="flex items-center gap-3">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-surface text-ink transition-colors group-hover:bg-ink group-hover:text-paper">
                <s.icon className="h-4 w-4" />
              </span>
              <h3 className="font-sans text-base font-semibold text-ink">{s.title}</h3>
            </div>
            <p className="mt-4 text-sm leading-relaxed ink-soft">{s.body}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}
