import { Section } from "./Section";
import { Building2, GraduationCap, HeartPulse, Home, Store, Briefcase, Heart, Landmark, ShoppingBag } from "lucide-react";

const industries = [
  { icon: Building2, name: "Hospitality" },
  { icon: GraduationCap, name: "Education" },
  { icon: HeartPulse, name: "Healthcare" },
  { icon: Home, name: "Real Estate" },
  { icon: ShoppingBag, name: "Retail" },
  { icon: Store, name: "Small Businesses" },
  { icon: Briefcase, name: "Professional Services" },
  { icon: Heart, name: "NGOs" },
  { icon: Landmark, name: "Government" },
];

export function IndustriesSection() {
  return (
    <Section
      eyebrow="// industries"
      title={<>Sectors I&apos;ve <span className="serif-italic text-electric">served.</span></>}
      description="Different rooms, same principles: clarity, speed, and software that respects the people using it."
    >
      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-3">
        {industries.map((i) => (
          <li
            key={i.name}
            className="group flex items-center gap-3 rounded-2xl border border-rule bg-white px-5 py-4 transition-all hover:-translate-y-0.5 hover:border-ink hover:shadow-sm"
          >
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-surface text-ink group-hover:bg-ink group-hover:text-paper">
              <i.icon className="h-4 w-4" />
            </span>
            <span className="font-sans text-sm font-medium text-ink">{i.name}</span>
          </li>
        ))}
      </ul>
    </Section>
  );
}
