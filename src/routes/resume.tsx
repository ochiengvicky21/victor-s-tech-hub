import { createFileRoute } from "@tanstack/react-router";
import { Download, Printer, ArrowLeft } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { PROFILE } from "@/lib/profile";

export const Route = createFileRoute("/resume")({
  head: () => ({
    meta: [
      { title: "Resume — Victor Otieno Ochieng" },
      { name: "description", content: "ATS-friendly resume of Victor Otieno Ochieng — Full Stack Engineer, AI Systems Builder and SaaS Architect." },
      { property: "og:title", content: "Resume — Victor Otieno Ochieng" },
      { property: "og:description", content: "Full Stack Engineer · AI Systems · SaaS Architect." },
    ],
  }),
  component: ResumePage,
});

function ResumePage() {
  const print = () => window.print();
  return (
    <>
      <style>{`
        @media print {
          @page { size: A4; margin: 14mm; }
          html, body { background: #fff !important; }
          .no-print { display: none !important; }
          .resume-sheet { box-shadow: none !important; border: 0 !important; padding: 0 !important; max-width: none !important; }
          a { color: #000 !important; text-decoration: none !important; }
          .branded-only { display: none !important; }
        }
      `}</style>

      <section className="mx-auto w-full max-w-4xl px-5 pt-10 pb-16">
        <div className="no-print mb-6 flex flex-wrap items-center justify-between gap-3">
          <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-ink-soft hover:text-ink">
            <ArrowLeft className="h-4 w-4" /> Back
          </Link>
          <div className="flex flex-wrap gap-2">
            <button onClick={print} className="inline-flex items-center gap-2 rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-paper hover:opacity-90">
              <Download className="h-4 w-4" /> Download PDF (ATS)
            </button>
            <button onClick={print} className="inline-flex items-center gap-2 rounded-full border border-ink px-5 py-2.5 text-sm font-medium text-ink hover:bg-ink hover:text-paper">
              <Printer className="h-4 w-4" /> Print
            </button>
          </div>
        </div>

        {/* ATS-FRIENDLY SHEET: black & white, single column, no tables, no graphics */}
        <article className="resume-sheet mx-auto max-w-[8.27in] rounded-lg border border-rule bg-white p-10 text-[11pt] leading-relaxed text-black shadow-sm">
          <header className="border-b border-black pb-4">
            <h1 className="text-[22pt] font-bold tracking-tight">{PROFILE.name}</h1>
            <p className="mt-1 text-[11pt] font-medium uppercase tracking-wider">
              {PROFILE.titles.slice(0, 3).join(" · ")}
            </p>
            <p className="mt-2 text-[10pt]">
              {PROFILE.location} · {PROFILE.email} · {PROFILE.phone} ·{" "}
              <a href={PROFILE.github}>{PROFILE.github.replace("https://", "")}</a>
            </p>
          </header>

          <section className="mt-5">
            <h2 className="text-[12pt] font-bold uppercase tracking-wider">Professional Summary</h2>
            <p className="mt-2">{PROFILE.summary}</p>
          </section>

          <section className="mt-5">
            <h2 className="text-[12pt] font-bold uppercase tracking-wider">Core Skills</h2>
            <ul className="mt-2 space-y-1">
              {Object.entries(PROFILE.skills).map(([k, v]) => (
                <li key={k}>
                  <span className="font-semibold">{k}:</span> {v.join(", ")}
                </li>
              ))}
            </ul>
          </section>

          <section className="mt-5">
            <h2 className="text-[12pt] font-bold uppercase tracking-wider">Professional Experience</h2>
            {PROFILE.experience.map((e) => (
              <div key={e.role + e.org} className="mt-3">
                <p className="font-semibold">
                  {e.role} — {e.org}
                </p>
                <p className="text-[10pt] italic">
                  {e.period} · {e.location}
                </p>
                <ul className="mt-1 list-disc pl-5">
                  {e.bullets.map((b, i) => (
                    <li key={i}>{b}</li>
                  ))}
                </ul>
              </div>
            ))}
          </section>

          <section className="mt-5">
            <h2 className="text-[12pt] font-bold uppercase tracking-wider">Selected Projects</h2>
            <ul className="mt-2 list-disc pl-5">
              <li>
                <span className="font-semibold">Munglu Eco Village Resort —</span> Designed, built and shipped
                the production website (<a href="https://www.mungluecovillage.co.ke">mungluecovillage.co.ke</a>).
              </li>
              <li>
                <span className="font-semibold">Personal SaaS systems —</span> Hotel SaaS, property management
                and AI-assisted business tooling. Live source on GitHub.
              </li>
              <li>
                <span className="font-semibold">Open-source portfolio —</span> Active repositories at{" "}
                <a href={PROFILE.github}>{PROFILE.github}</a>.
              </li>
            </ul>
          </section>

          <section className="mt-5">
            <h2 className="text-[12pt] font-bold uppercase tracking-wider">Education</h2>
            <ul className="mt-2 list-disc pl-5">
              {PROFILE.education.map((ed, i) => (
                <li key={i}>
                  <span className="font-semibold">{ed.school}</span> — {ed.detail}
                </li>
              ))}
            </ul>
          </section>

          <section className="mt-5">
            <h2 className="text-[12pt] font-bold uppercase tracking-wider">Achievements</h2>
            <ul className="mt-2 list-disc pl-5">
              {PROFILE.achievements.map((a, i) => (
                <li key={i}>{a}</li>
              ))}
            </ul>
          </section>

          <section className="mt-5">
            <h2 className="text-[12pt] font-bold uppercase tracking-wider">Languages</h2>
            <p className="mt-1">English (Native proficiency), Kiswahili (Native proficiency).</p>
          </section>
        </article>

        {/* BRANDED VERSION (screen + print as page 2 only via separate route is overkill; keep ATS as canonical) */}
        <div className="no-print mt-8 text-center text-xs ink-soft">
          Tip: use “Save as PDF” in the print dialog. The page is formatted for A4 with 14&nbsp;mm margins.
        </div>
      </section>
    </>
  );
}
