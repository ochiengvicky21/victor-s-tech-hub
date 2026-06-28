import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { marked } from "marked";
import {
  type CmsConfig,
  type PostMeta,
  adminDeletePost,
  adminGetPost,
  adminListPosts,
  adminSavePost,
  getConfig,
  getToken,
  setConfig,
  setToken,
} from "@/lib/cms";

export const Route = createFileRoute("/admin")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Admin — Victor Otieno Ochieng" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminPage,
});

function slugify(s: string) {
  return s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 80);
}

function AdminPage() {
  const [token, setTok] = useState("");
  const [cfg, setCfg] = useState<CmsConfig>(() => getConfig());
  const [authed, setAuthed] = useState(false);
  const [posts, setPosts] = useState<PostMeta[] | null>(null);
  const [editing, setEditing] = useState<null | {
    slug: string;
    title: string;
    date: string;
    excerpt: string;
    body: string;
    sha?: string;
    isNew: boolean;
  }>(null);
  const [status, setStatus] = useState<string>("");
  const [busy, setBusy] = useState(false);
  const [showCfg, setShowCfg] = useState(false);

  useEffect(() => {
    const t = getToken();
    if (t) {
      setTok(t);
      setAuthed(true);
    }
  }, []);

  useEffect(() => {
    if (!authed) return;
    refresh();
  }, [authed]);

  async function refresh() {
    setBusy(true);
    setStatus("Loading posts…");
    try {
      const list = await adminListPosts(cfg, token);
      setPosts(list);
      setStatus(`${list.length} post(s) in ${cfg.owner}/${cfg.repo}@${cfg.branch}`);
    } catch (e: any) {
      setStatus(`Error: ${e.message}`);
    } finally {
      setBusy(false);
    }
  }

  function signIn(e: React.FormEvent) {
    e.preventDefault();
    if (!token.trim()) return;
    setToken(token.trim());
    setConfig(cfg);
    setAuthed(true);
  }
  function signOut() {
    setToken("");
    setTok("");
    setAuthed(false);
    setPosts(null);
  }

  async function openNew() {
    setEditing({
      slug: "",
      title: "",
      date: new Date().toISOString().slice(0, 10),
      excerpt: "",
      body: "# Hello\n\nWrite your post in **Markdown**.\n",
      isNew: true,
    });
  }
  async function openEdit(slug: string) {
    setBusy(true);
    try {
      const p = await adminGetPost(cfg, token, slug);
      if (p) setEditing({ ...p, isNew: false });
    } finally {
      setBusy(false);
    }
  }
  async function save() {
    if (!editing) return;
    const slug = editing.slug || slugify(editing.title);
    if (!slug) return setStatus("Slug or title required");
    setBusy(true);
    setStatus("Committing to GitHub…");
    try {
      await adminSavePost(
        cfg,
        token,
        slug,
        { title: editing.title, date: editing.date, excerpt: editing.excerpt },
        editing.body,
        editing.sha,
      );
      setStatus("Saved. Your host will rebuild within ~1 minute.");
      setEditing(null);
      await refresh();
    } catch (e: any) {
      setStatus(`Save failed: ${e.message}`);
    } finally {
      setBusy(false);
    }
  }
  async function remove(p: PostMeta) {
    if (!p.sha) return;
    if (!confirm(`Delete "${p.title}"?`)) return;
    setBusy(true);
    try {
      await adminDeletePost(cfg, token, p.slug, p.sha);
      setStatus("Deleted.");
      await refresh();
    } catch (e: any) {
      setStatus(`Delete failed: ${e.message}`);
    } finally {
      setBusy(false);
    }
  }

  const preview = useMemo(() => (editing ? marked.parse(editing.body) : ""), [editing?.body]);

  if (!authed) {
    return (
      <section className="mx-auto max-w-md px-5 pt-14 pb-20">
        <h1 className="serif-display text-4xl">Admin</h1>
        <p className="mt-2 text-sm ink-soft">
          Sign in with a GitHub personal access token. The token stays in your browser only and is used to
          commit Markdown posts directly to your repository.
        </p>
        <form onSubmit={signIn} className="mt-6 space-y-4 rounded-2xl border border-rule bg-white p-5">
          <div>
            <label className="eyebrow">GitHub PAT (repo scope)</label>
            <input
              type="password"
              value={token}
              onChange={(e) => setTok(e.target.value)}
              placeholder="ghp_…"
              className="mt-1 w-full rounded-lg border border-rule bg-surface px-3 py-2 text-sm"
              required
            />
            <a
              href="https://github.com/settings/tokens/new?scopes=repo&description=Portfolio%20CMS"
              target="_blank"
              rel="noreferrer"
              className="mt-1 inline-block text-xs ink-soft underline"
            >
              Create one →
            </a>
          </div>
          <details>
            <summary className="cursor-pointer text-xs ink-soft">Repository settings</summary>
            <div className="mt-3 grid grid-cols-2 gap-2">
              <input className="rounded border border-rule px-2 py-1.5 text-sm" value={cfg.owner} onChange={(e) => setCfg({ ...cfg, owner: e.target.value })} placeholder="owner" />
              <input className="rounded border border-rule px-2 py-1.5 text-sm" value={cfg.repo} onChange={(e) => setCfg({ ...cfg, repo: e.target.value })} placeholder="repo" />
              <input className="rounded border border-rule px-2 py-1.5 text-sm" value={cfg.branch} onChange={(e) => setCfg({ ...cfg, branch: e.target.value })} placeholder="branch" />
              <input className="rounded border border-rule px-2 py-1.5 text-sm" value={cfg.postsPath} onChange={(e) => setCfg({ ...cfg, postsPath: e.target.value })} placeholder="posts path" />
            </div>
          </details>
          <button className="w-full rounded-full bg-ink py-2.5 text-sm font-medium text-paper">
            Sign in
          </button>
        </form>
        <p className="mt-4 text-xs ink-soft">
          No database. Posts are committed as <code>.md</code> files into your GitHub repo and rendered
          directly from there at <Link to="/blog" className="underline">/blog</Link>.
        </p>
      </section>
    );
  }

  if (editing) {
    return (
      <section className="mx-auto max-w-6xl px-5 pt-10 pb-20">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h1 className="serif-display text-3xl">{editing.isNew ? "New post" : `Edit: ${editing.slug}`}</h1>
          <div className="flex gap-2">
            <button onClick={() => setEditing(null)} className="rounded-full border border-rule px-4 py-2 text-sm">Cancel</button>
            <button disabled={busy} onClick={save} className="rounded-full bg-ink px-5 py-2 text-sm font-medium text-paper disabled:opacity-50">
              {busy ? "Committing…" : "Commit & publish"}
            </button>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-4">
          <input className="rounded border border-rule px-3 py-2 text-sm md:col-span-2" placeholder="Title" value={editing.title} onChange={(e) => setEditing({ ...editing, title: e.target.value })} />
          <input className="rounded border border-rule px-3 py-2 text-sm" placeholder="Slug" value={editing.slug} onChange={(e) => setEditing({ ...editing, slug: slugify(e.target.value) })} disabled={!editing.isNew} />
          <input type="date" className="rounded border border-rule px-3 py-2 text-sm" value={editing.date} onChange={(e) => setEditing({ ...editing, date: e.target.value })} />
          <input className="rounded border border-rule px-3 py-2 text-sm md:col-span-4" placeholder="Excerpt" value={editing.excerpt} onChange={(e) => setEditing({ ...editing, excerpt: e.target.value })} />
        </div>

        <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
          <textarea
            className="min-h-[60vh] w-full rounded-lg border border-rule bg-surface px-3 py-2 font-mono text-sm"
            value={editing.body}
            onChange={(e) => setEditing({ ...editing, body: e.target.value })}
          />
          <article
            className="prose prose-neutral max-w-none rounded-lg border border-rule bg-white p-5"
            dangerouslySetInnerHTML={{ __html: preview as string }}
          />
        </div>
        {status && <p className="mt-3 text-xs ink-soft">{status}</p>}
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-5xl px-5 pt-10 pb-20">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="eyebrow">Admin</p>
          <h1 className="serif-display text-4xl">Content</h1>
          <p className="mt-1 text-xs ink-soft">{status}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button onClick={() => setShowCfg((v) => !v)} className="rounded-full border border-rule px-4 py-2 text-sm">Repo</button>
          <button onClick={refresh} className="rounded-full border border-rule px-4 py-2 text-sm">Refresh</button>
          <button onClick={openNew} className="rounded-full bg-ink px-5 py-2 text-sm font-medium text-paper">+ New post</button>
          <button onClick={signOut} className="rounded-full border border-rule px-4 py-2 text-sm">Sign out</button>
        </div>
      </div>

      {showCfg && (
        <div className="mt-4 grid grid-cols-2 gap-2 rounded-xl border border-rule bg-surface p-4 md:grid-cols-4">
          <input className="rounded border border-rule px-2 py-1.5 text-sm" value={cfg.owner} onChange={(e) => setCfg({ ...cfg, owner: e.target.value })} />
          <input className="rounded border border-rule px-2 py-1.5 text-sm" value={cfg.repo} onChange={(e) => setCfg({ ...cfg, repo: e.target.value })} />
          <input className="rounded border border-rule px-2 py-1.5 text-sm" value={cfg.branch} onChange={(e) => setCfg({ ...cfg, branch: e.target.value })} />
          <input className="rounded border border-rule px-2 py-1.5 text-sm" value={cfg.postsPath} onChange={(e) => setCfg({ ...cfg, postsPath: e.target.value })} />
          <button onClick={() => { setConfig(cfg); refresh(); }} className="md:col-span-4 rounded-full bg-ink px-4 py-2 text-sm font-medium text-paper">Save & reload</button>
        </div>
      )}

      <div className="mt-8 divide-y divide-rule rounded-2xl border border-rule bg-white">
        {posts === null ? (
          <p className="p-6 text-sm ink-soft">Loading…</p>
        ) : posts.length === 0 ? (
          <p className="p-6 text-sm ink-soft">
            No posts yet. Click <strong>+ New post</strong>. If the repo or folder doesn&apos;t exist yet,
            your first commit will create it.
          </p>
        ) : (
          posts.map((p) => (
            <div key={p.slug} className="flex flex-wrap items-center justify-between gap-3 p-5">
              <div className="min-w-0">
                <p className="font-serif text-lg text-ink">{p.title}</p>
                <p className="text-xs ink-soft">{p.date} · {p.slug}</p>
              </div>
              <div className="flex gap-2">
                <Link to="/blog/$slug" params={{ slug: p.slug }} className="rounded-full border border-rule px-3 py-1.5 text-xs">View</Link>
                <button onClick={() => openEdit(p.slug)} className="rounded-full border border-rule px-3 py-1.5 text-xs">Edit</button>
                <button onClick={() => remove(p)} className="rounded-full border border-rule px-3 py-1.5 text-xs text-red-600">Delete</button>
              </div>
            </div>
          ))
        )}
      </div>

      <p className="mt-6 text-xs ink-soft">
        Each save commits a <code>.md</code> file to <code>{cfg.owner}/{cfg.repo}</code> on <code>{cfg.branch}</code>.
        Your host (Netlify) auto-deploys on push, so posts go live in about a minute.
      </p>
    </section>
  );
}
