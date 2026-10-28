import { useCallback, useEffect, useState } from "react";
import { Plus, RefreshCw, Save, Trash2 } from "lucide-react";
import { adminGetSiteContent, adminSaveSiteContent } from "@/lib/site-content.functions";
import {
  DEFAULT_SITE_CONTENT,
  type PortfolioProject,
  type SiteContent,
  type SiteSection,
} from "@/lib/site-content";

function authHeaders(accessToken: string) {
  return { headers: { Authorization: `Bearer ${accessToken}` } };
}

function errorMessage(error: unknown) {
  return error instanceof Error ? error.message : "Something went wrong. Please try again.";
}

const fieldClass =
  "mt-1 w-full rounded-xl border border-rule bg-white px-3 py-2.5 text-sm text-ink shadow-xs outline-none transition focus:border-electric";
const labelClass = "block text-xs font-medium text-ink-soft";

export function SiteContentEditor({ accessToken }: { accessToken: string }) {
  const [content, setContent] = useState<SiteContent>(DEFAULT_SITE_CONTENT);
  const [sha, setSha] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  const loadContent = useCallback(async () => {
    setBusy(true);
    setMessage("");
    try {
      const saved = await adminGetSiteContent(authHeaders(accessToken));
      setContent(saved.content);
      setSha(saved.sha);
      setMessage("Published site content loaded.");
    } catch (error) {
      setMessage(`Could not load site content: ${errorMessage(error)}`);
    } finally {
      setBusy(false);
    }
  }, [accessToken]);

  useEffect(() => {
    void loadContent();
  }, [loadContent]);

  function updateSection(id: string, updates: Partial<SiteSection>) {
    setContent((current) => ({
      ...current,
      sections: current.sections.map((section) =>
        section.id === id ? { ...section, ...updates } : section,
      ),
    }));
  }

  function updateProject(id: string, updates: Partial<PortfolioProject>) {
    setContent((current) => ({
      ...current,
      projects: current.projects.map((project) =>
        project.id === id ? { ...project, ...updates } : project,
      ),
    }));
  }

  async function saveContent() {
    setBusy(true);
    setMessage("");
    try {
      const saved = await adminSaveSiteContent({
        data: { content, sha },
        ...authHeaders(accessToken),
      });
      setSha(saved.sha);
      setMessage(
        "Site content published. It will appear on the site after the CMS commit is deployed.",
      );
    } catch (error) {
      setMessage(`Could not publish site content: ${errorMessage(error)}`);
    } finally {
      setBusy(false);
    }
  }

  function addSection() {
    const id = `custom-${crypto.randomUUID().slice(0, 8)}`;
    setContent((current) => ({
      ...current,
      sections: [
        ...current.sections,
        { id, kind: "custom", eyebrow: "// new section", title: "", description: "", body: "" },
      ],
    }));
  }

  function addProject() {
    const id = `project-${crypto.randomUUID().slice(0, 8)}`;
    setContent((current) => ({
      ...current,
      projects: [
        ...current.projects,
        {
          id,
          client: "",
          category: "",
          title: "",
          description: "",
          capabilities: [],
          links: [],
        },
      ],
    }));
  }

  function addSnippet() {
    const id = `snippet-${crypto.randomUUID().slice(0, 8)}`;
    setContent((current) => ({
      ...current,
      snippets: [
        ...current.snippets,
        { id, title: "", description: "", sourceUrl: "", license: "", licenseUrl: "" },
      ],
    }));
  }

  return (
    <section className="mt-7 space-y-6">
      <div className="page-intro flex flex-wrap items-center justify-between gap-4 p-5 sm:p-7">
        <div>
          <p className="eyebrow">// live portfolio content</p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-ink">
            Manage site sections
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed ink-soft">
            Edit the homepage introduction and story, add sections, and maintain the project details
            shared with your resume.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            disabled={busy}
            onClick={() => void loadContent()}
            className="inline-flex items-center gap-2 rounded-xl border border-rule bg-white px-4 py-2.5 text-sm font-medium text-ink hover:border-electric disabled:opacity-50"
          >
            <RefreshCw className="h-4 w-4" /> Reload
          </button>
          <button
            type="button"
            disabled={busy}
            onClick={() => void saveContent()}
            className="inline-flex items-center gap-2 rounded-xl bg-ink px-4 py-2.5 text-sm font-semibold text-paper transition hover:bg-electric disabled:opacity-50"
          >
            <Save className="h-4 w-4" /> {busy ? "Publishing…" : "Publish changes"}
          </button>
        </div>
      </div>

      {message && (
        <p
          role="status"
          className="rounded-xl border border-rule bg-white px-4 py-3 text-sm ink-soft"
        >
          {message}
        </p>
      )}

      <div className="grid gap-5 lg:grid-cols-2">
        {content.sections
          .filter((section) => section.kind !== "custom")
          .map((section) => (
            <article key={section.id} className="admin-panel p-5 sm:p-6">
              <p className="eyebrow">{section.kind} section</p>
              <div className="mt-4 space-y-4">
                <label className={labelClass}>
                  Section label
                  <input
                    className={fieldClass}
                    value={section.eyebrow}
                    onChange={(event) => updateSection(section.id, { eyebrow: event.target.value })}
                  />
                </label>
                <label className={labelClass}>
                  Heading
                  <textarea
                    rows={section.kind === "hero" ? 3 : 2}
                    className={fieldClass}
                    value={section.title}
                    onChange={(event) => updateSection(section.id, { title: event.target.value })}
                  />
                </label>
                {section.kind !== "story" && (
                  <label className={labelClass}>
                    Supporting text
                    <textarea
                      rows={3}
                      className={fieldClass}
                      value={section.description}
                      onChange={(event) =>
                        updateSection(section.id, { description: event.target.value })
                      }
                    />
                  </label>
                )}
                {section.kind === "story" && (
                  <label className={labelClass}>
                    Story paragraphs (separate paragraphs with a blank line)
                    <textarea
                      rows={8}
                      className={fieldClass}
                      value={section.body}
                      onChange={(event) => updateSection(section.id, { body: event.target.value })}
                    />
                  </label>
                )}
              </div>
            </article>
          ))}
      </div>

      <section className="admin-panel p-5 sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="eyebrow">Homepage · Additional content</p>
            <h3 className="mt-2 text-xl font-semibold text-ink">Custom sections</h3>
          </div>
          <button
            type="button"
            onClick={addSection}
            className="inline-flex items-center gap-2 rounded-xl border border-rule px-3 py-2 text-sm font-medium hover:border-electric"
          >
            <Plus className="h-4 w-4" /> Add section
          </button>
        </div>
        {content.sections.filter((section) => section.kind === "custom").length === 0 ? (
          <p className="mt-4 text-sm ink-soft">
            No custom sections yet. Add one to publish a new section on the homepage.
          </p>
        ) : (
          <div className="mt-5 space-y-4">
            {content.sections
              .filter((section) => section.kind === "custom")
              .map((section) => (
                <article
                  key={section.id}
                  className="rounded-xl border border-rule bg-surface/50 p-4"
                >
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-mono text-[10px] uppercase tracking-wider text-ink-soft">
                      {section.id}
                    </p>
                    <button
                      type="button"
                      aria-label={`Remove ${section.title || section.id}`}
                      onClick={() =>
                        setContent((current) => ({
                          ...current,
                          sections: current.sections.filter((item) => item.id !== section.id),
                        }))
                      }
                      className="rounded-lg p-2 text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="mt-3 grid gap-3 sm:grid-cols-2">
                    <label className={labelClass}>
                      Section label
                      <input
                        className={fieldClass}
                        value={section.eyebrow}
                        onChange={(event) =>
                          updateSection(section.id, { eyebrow: event.target.value })
                        }
                      />
                    </label>
                    <label className={labelClass}>
                      Heading
                      <input
                        className={fieldClass}
                        value={section.title}
                        onChange={(event) =>
                          updateSection(section.id, { title: event.target.value })
                        }
                      />
                    </label>
                    <label className={`${labelClass} sm:col-span-2`}>
                      Supporting text
                      <textarea
                        rows={2}
                        className={fieldClass}
                        value={section.description}
                        onChange={(event) =>
                          updateSection(section.id, { description: event.target.value })
                        }
                      />
                    </label>
                    <label className={`${labelClass} sm:col-span-2`}>
                      Section content
                      <textarea
                        rows={5}
                        className={fieldClass}
                        value={section.body}
                        onChange={(event) =>
                          updateSection(section.id, { body: event.target.value })
                        }
                      />
                    </label>
                  </div>
                </article>
              ))}
          </div>
        )}
      </section>

      <section className="admin-panel p-5 sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="eyebrow">Portfolio · Resume</p>
            <h3 className="mt-2 text-xl font-semibold text-ink">Featured projects</h3>
            <p className="mt-1 text-sm ink-soft">
              Project edits update both the homepage portfolio and resume.
            </p>
          </div>
          <button
            type="button"
            onClick={addProject}
            className="inline-flex items-center gap-2 rounded-xl border border-rule px-3 py-2 text-sm font-medium hover:border-electric"
          >
            <Plus className="h-4 w-4" /> Add project
          </button>
        </div>
        <div className="mt-5 grid gap-4 lg:grid-cols-2">
          {content.projects.map((project) => (
            <article key={project.id} className="rounded-xl border border-rule bg-surface/50 p-4">
              <div className="flex items-center justify-between gap-3">
                <p className="font-mono text-[10px] uppercase tracking-wider text-ink-soft">
                  {project.id}
                </p>
                <button
                  type="button"
                  aria-label={`Remove ${project.client || project.id}`}
                  onClick={() =>
                    setContent((current) => ({
                      ...current,
                      projects: current.projects.filter((item) => item.id !== project.id),
                    }))
                  }
                  className="rounded-lg p-2 text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              <div className="mt-3 space-y-3">
                <div className="grid gap-3 sm:grid-cols-2">
                  <label className={labelClass}>
                    Client
                    <input
                      className={fieldClass}
                      value={project.client}
                      onChange={(event) =>
                        updateProject(project.id, { client: event.target.value })
                      }
                    />
                  </label>
                  <label className={labelClass}>
                    Category
                    <input
                      className={fieldClass}
                      value={project.category}
                      onChange={(event) =>
                        updateProject(project.id, { category: event.target.value })
                      }
                    />
                  </label>
                </div>
                <label className={labelClass}>
                  Project title
                  <input
                    className={fieldClass}
                    value={project.title}
                    onChange={(event) => updateProject(project.id, { title: event.target.value })}
                  />
                </label>
                <label className={labelClass}>
                  Details
                  <textarea
                    rows={3}
                    className={fieldClass}
                    value={project.description}
                    onChange={(event) =>
                      updateProject(project.id, { description: event.target.value })
                    }
                  />
                </label>
                <label className={labelClass}>
                  Capabilities (comma-separated)
                  <input
                    className={fieldClass}
                    value={project.capabilities.join(", ")}
                    onChange={(event) =>
                      updateProject(project.id, {
                        capabilities: event.target.value
                          .split(",")
                          .map((item) => item.trim())
                          .filter(Boolean),
                      })
                    }
                  />
                </label>
                <div>
                  <p className={labelClass}>Links</p>
                  <div className="mt-2 space-y-2">
                    {project.links.map((link, index) => (
                      <div
                        key={`${project.id}-link-${index}`}
                        className="grid gap-2 sm:grid-cols-[1fr_1.5fr_auto]"
                      >
                        <input
                          aria-label="Link label"
                          className={fieldClass}
                          value={link.label}
                          onChange={(event) =>
                            updateProject(project.id, {
                              links: project.links.map((item, itemIndex) =>
                                itemIndex === index ? { ...item, label: event.target.value } : item,
                              ),
                            })
                          }
                        />
                        <input
                          aria-label="Link URL"
                          type="url"
                          className={fieldClass}
                          value={link.href}
                          onChange={(event) =>
                            updateProject(project.id, {
                              links: project.links.map((item, itemIndex) =>
                                itemIndex === index ? { ...item, href: event.target.value } : item,
                              ),
                            })
                          }
                        />
                        <button
                          type="button"
                          aria-label="Remove project link"
                          onClick={() =>
                            updateProject(project.id, {
                              links: project.links.filter((_, itemIndex) => itemIndex !== index),
                            })
                          }
                          className="mt-1 rounded-lg p-2 text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() =>
                        updateProject(project.id, {
                          links: [...project.links, { label: "", href: "https://", icon: "globe" }],
                        })
                      }
                      className="text-xs font-medium text-electric hover:underline"
                    >
                      + Add link
                    </button>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="admin-panel p-5 sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="eyebrow">Open source · GitHub / GitLab</p>
            <h3 className="mt-2 text-xl font-semibold text-ink">Code snippets</h3>
            <p className="mt-1 max-w-2xl text-sm leading-relaxed ink-soft">
              Add a public file link from a repository with an open-source license. Only short
              excerpts are shown, with the source and license linked.
            </p>
          </div>
          <button
            type="button"
            onClick={addSnippet}
            className="inline-flex items-center gap-2 rounded-xl border border-rule px-3 py-2 text-sm font-medium hover:border-electric"
          >
            <Plus className="h-4 w-4" /> Add source
          </button>
        </div>
        <div className="mt-5 grid gap-4 lg:grid-cols-2">
          {content.snippets.map((snippet) => (
            <article key={snippet.id} className="rounded-xl border border-rule bg-surface/50 p-4">
              <div className="flex items-center justify-between gap-3">
                <p className="font-mono text-[10px] uppercase tracking-wider text-ink-soft">
                  {snippet.id}
                </p>
                <button
                  type="button"
                  aria-label={`Remove ${snippet.title || snippet.id}`}
                  onClick={() =>
                    setContent((current) => ({
                      ...current,
                      snippets: current.snippets.filter((item) => item.id !== snippet.id),
                    }))
                  }
                  className="rounded-lg p-2 text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              <div className="mt-3 space-y-3">
                <label className={labelClass}>
                  Display title
                  <input
                    className={fieldClass}
                    value={snippet.title}
                    onChange={(event) =>
                      setContent((current) => ({
                        ...current,
                        snippets: current.snippets.map((item) =>
                          item.id === snippet.id ? { ...item, title: event.target.value } : item,
                        ),
                      }))
                    }
                  />
                </label>
                <label className={labelClass}>
                  Context
                  <textarea
                    rows={2}
                    className={fieldClass}
                    value={snippet.description}
                    onChange={(event) =>
                      setContent((current) => ({
                        ...current,
                        snippets: current.snippets.map((item) =>
                          item.id === snippet.id
                            ? { ...item, description: event.target.value }
                            : item,
                        ),
                      }))
                    }
                  />
                </label>
                <label className={labelClass}>
                  GitHub/GitLab file URL
                  <input
                    type="url"
                    className={fieldClass}
                    placeholder="https://github.com/owner/repo/blob/main/src/file.ts"
                    value={snippet.sourceUrl}
                    onChange={(event) =>
                      setContent((current) => ({
                        ...current,
                        snippets: current.snippets.map((item) =>
                          item.id === snippet.id
                            ? { ...item, sourceUrl: event.target.value }
                            : item,
                        ),
                      }))
                    }
                  />
                </label>
                <div className="grid gap-3 sm:grid-cols-2">
                  <label className={labelClass}>
                    License name
                    <input
                      className={fieldClass}
                      placeholder="MIT"
                      value={snippet.license}
                      onChange={(event) =>
                        setContent((current) => ({
                          ...current,
                          snippets: current.snippets.map((item) =>
                            item.id === snippet.id
                              ? { ...item, license: event.target.value }
                              : item,
                          ),
                        }))
                      }
                    />
                  </label>
                  <label className={labelClass}>
                    License URL
                    <input
                      type="url"
                      className={fieldClass}
                      value={snippet.licenseUrl}
                      onChange={(event) =>
                        setContent((current) => ({
                          ...current,
                          snippets: current.snippets.map((item) =>
                            item.id === snippet.id
                              ? { ...item, licenseUrl: event.target.value }
                              : item,
                          ),
                        }))
                      }
                    />
                  </label>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </section>
  );
}
