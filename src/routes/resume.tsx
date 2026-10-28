import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Download, Printer, ArrowLeft } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { PROFILE } from "@/lib/profile";
import { DEFAULT_SITE_CONTENT, getSiteSection } from "@/lib/site-content";
import { getPublicSiteContent } from "@/lib/site-content.functions";

export const Route = createFileRoute("/resume")({
  head: () => ({
    meta: [
      { title: "Resume — Victor Otieno Ochieng" },
      {
        name: "description",
        content:
          "ATS-friendly resume of Victor Otieno Ochieng — Full Stack Engineer, AI Systems Builder and SaaS Architect.",
      },
      { property: "og:title", content: "Resume — Victor Otieno Ochieng" },
      { property: "og:description", content: "Full Stack Engineer · AI Systems · SaaS Architect." },
    ],
  }),
  component: ResumePage,
});

function ResumePage() {
  const portfolio = useQuery({
    queryKey: ["site-content", "resume"],
    queryFn: () => getPublicSiteContent({ data: { includeCode: false } }),
    staleTime: 60_000,
  });
  const projects = portfolio.data?.content.projects ?? DEFAULT_SITE_CONTENT.projects;
  const resumeSummary =
    getSiteSection(portfolio.data?.content ?? DEFAULT_SITE_CONTENT, "resume-summary")
      ?.description ?? PROFILE.summary;
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

      <section className="mx-auto w-full max-w-7xl px-4 pb-16 pt-8 sm:px-6 sm:pt-12">
        <div className="page-intro no-print mb-8 p-6 sm:p-9">
          <p className="eyebrow">// resume · verified portfolio data</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
            Experience, skills & selected work.
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed ink-soft sm:text-base">
            The project list below is shared with the public portfolio and is updated when site
            content is published in the admin.
          </p>
          {portfolio.isError && (
            <p role="status" className="mt-3 text-sm text-amber-800">
              Could not refresh published projects; showing the saved portfolio defaults.
            </p>
          )}
        </div>
        <div className="no-print mb-6 flex flex-wrap items-center justify-between gap-3">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-sm text-ink-soft hover:text-ink"
          >
            <ArrowLeft className="h-4 w-4" /> Back
          </Link>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={print}
              className="inline-flex items-center gap-2 rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-paper hover:opacity-90"
            >
              <Download className="h-4 w-4" /> Download PDF (ATS)
            </button>
            <button
              onClick={print}
              className="inline-flex items-center gap-2 rounded-full border border-ink px-5 py-2.5 text-sm font-medium text-ink hover:bg-ink hover:text-paper"
            >
              <Printer className="h-4 w-4" /> Print
            </button>
          </div>
        </div>

        {/* ATS-FRIENDLY SHEET: black & white, single column, no tables, no graphics */}
        <article className="resume-sheet mx-auto max-w-[8.27in] rounded-2xl border border-rule bg-white p-7 text-[11pt] leading-relaxed text-black shadow-lg shadow-slate-900/5 sm:p-10">
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
            <p className="mt-2">{resumeSummary}</p>
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
            <h2 className="text-[12pt] font-bold uppercase tracking-wider">
              Professional Experience
            </h2>
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
              {projects.map((project) => (
                <li key={project.id}>
                  <span className="font-semibold">
                    {project.client} — {project.title}
                  </span>{" "}
                  {project.description}{" "}
                  {project.links.map((link, index) => (
                    <span key={link.href}>
                      {index === 0 ? "(" : " · "}
                      <a href={link.href}>{link.label}</a>
                      {index === project.links.length - 1 ? ")" : ""}
                    </span>
                  ))}
                </li>
              ))}
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
          Tip: use “Save as PDF” in the print dialog. The page is formatted for A4 with 14&nbsp;mm
          margins.
        </div>
      </section>
    </>
  );
}
