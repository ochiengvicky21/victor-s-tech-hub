import { CMS, API_BASE, RAW_BASE } from "./cms-config";

const TOKEN_KEY = "voo_admin_token";
const CFG_KEY = "voo_admin_cfg";

export interface CmsConfig {
  owner: string;
  repo: string;
  branch: string;
  postsPath: string;
}

export function getConfig(): CmsConfig {
  if (typeof window === "undefined") return { ...CMS };
  try {
    const raw = localStorage.getItem(CFG_KEY);
    if (raw) return { ...CMS, ...JSON.parse(raw) };
  } catch {}
  return { ...CMS };
}
export function setConfig(c: CmsConfig) {
  localStorage.setItem(CFG_KEY, JSON.stringify(c));
}
export function getToken(): string {
  if (typeof window === "undefined") return "";
  return localStorage.getItem(TOKEN_KEY) || "";
}
export function setToken(t: string) {
  if (t) localStorage.setItem(TOKEN_KEY, t);
  else localStorage.removeItem(TOKEN_KEY);
}

function b64encode(s: string) {
  return btoa(unescape(encodeURIComponent(s)));
}
function b64decode(s: string) {
  return decodeURIComponent(escape(atob(s.replace(/\n/g, ""))));
}

function api(cfg: CmsConfig, path = "") {
  return `https://api.github.com/repos/${cfg.owner}/${cfg.repo}/contents/${path}`;
}

function headers(token: string) {
  const h: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
  };
  if (token) h.Authorization = `Bearer ${token}`;
  return h;
}

export interface PostMeta {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  sha?: string;
}

export interface Post extends PostMeta {
  body: string;
  raw: string;
}

export function parseFrontmatter(raw: string): { meta: Record<string, string>; body: string } {
  const m = raw.match(/^---\s*\n([\s\S]*?)\n---\s*\n?([\s\S]*)$/);
  if (!m) return { meta: {}, body: raw };
  const meta: Record<string, string> = {};
  m[1].split("\n").forEach((line) => {
    const i = line.indexOf(":");
    if (i > 0) {
      const k = line.slice(0, i).trim();
      let v = line.slice(i + 1).trim();
      if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
        v = v.slice(1, -1);
      }
      meta[k] = v;
    }
  });
  return { meta, body: m[2] };
}

export function buildMarkdown(meta: { title: string; date: string; excerpt: string }, body: string): string {
  const esc = (s: string) => s.replace(/"/g, '\\"');
  return `---\ntitle: "${esc(meta.title)}"\ndate: "${esc(meta.date)}"\nexcerpt: "${esc(meta.excerpt)}"\n---\n\n${body}`;
}

// PUBLIC reads (no auth) — used by /blog
export async function listPostsPublic(): Promise<PostMeta[]> {
  const url = `${API_BASE}/${CMS.postsPath}?ref=${CMS.branch}`;
  const res = await fetch(url, { headers: { Accept: "application/vnd.github+json" } });
  if (res.status === 404) return [];
  if (!res.ok) throw new Error(`GitHub ${res.status}`);
  const files = (await res.json()) as Array<{ name: string; path: string; sha: string }>;
  const mdFiles = files.filter((f) => f.name.endsWith(".md"));
  const posts = await Promise.all(
    mdFiles.map(async (f) => {
      const slug = f.name.replace(/\.md$/, "");
      const raw = await fetch(`${RAW_BASE}/${f.path}`).then((r) => r.text());
      const { meta } = parseFrontmatter(raw);
      return {
        slug,
        title: meta.title || slug,
        date: meta.date || "",
        excerpt: meta.excerpt || "",
        sha: f.sha,
      } as PostMeta;
    }),
  );
  return posts.sort((a, b) => (a.date < b.date ? 1 : -1));
}

export async function getPostPublic(slug: string): Promise<Post | null> {
  const raw = await fetch(`${RAW_BASE}/${CMS.postsPath}/${slug}.md`).then((r) =>
    r.ok ? r.text() : null,
  );
  if (!raw) return null;
  const { meta, body } = parseFrontmatter(raw);
  return {
    slug,
    title: meta.title || slug,
    date: meta.date || "",
    excerpt: meta.excerpt || "",
    body,
    raw,
  };
}

// ADMIN ops (auth required)
export async function adminListPosts(cfg: CmsConfig, token: string): Promise<PostMeta[]> {
  const res = await fetch(`${api(cfg, cfg.postsPath)}?ref=${cfg.branch}`, { headers: headers(token) });
  if (res.status === 404) return [];
  if (!res.ok) throw new Error(`GitHub ${res.status}: ${await res.text()}`);
  const files = (await res.json()) as Array<{ name: string; sha: string; path: string }>;
  return Promise.all(
    files
      .filter((f) => f.name.endsWith(".md"))
      .map(async (f) => {
        const slug = f.name.replace(/\.md$/, "");
        const fileRes = await fetch(`${api(cfg, f.path)}?ref=${cfg.branch}`, { headers: headers(token) });
        const data = (await fileRes.json()) as { content: string; sha: string };
        const raw = b64decode(data.content);
        const { meta } = parseFrontmatter(raw);
        return {
          slug,
          title: meta.title || slug,
          date: meta.date || "",
          excerpt: meta.excerpt || "",
          sha: data.sha,
        };
      }),
  );
}

export async function adminGetPost(cfg: CmsConfig, token: string, slug: string): Promise<Post & { sha: string } | null> {
  const path = `${cfg.postsPath}/${slug}.md`;
  const res = await fetch(`${api(cfg, path)}?ref=${cfg.branch}`, { headers: headers(token) });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`GitHub ${res.status}`);
  const data = (await res.json()) as { content: string; sha: string };
  const raw = b64decode(data.content);
  const { meta, body } = parseFrontmatter(raw);
  return {
    slug,
    title: meta.title || slug,
    date: meta.date || "",
    excerpt: meta.excerpt || "",
    body,
    raw,
    sha: data.sha,
  };
}

export async function adminSavePost(
  cfg: CmsConfig,
  token: string,
  slug: string,
  meta: { title: string; date: string; excerpt: string },
  body: string,
  sha?: string,
): Promise<void> {
  const path = `${cfg.postsPath}/${slug}.md`;
  const content = buildMarkdown(meta, body);
  const res = await fetch(api(cfg, path), {
    method: "PUT",
    headers: { ...headers(token), "Content-Type": "application/json" },
    body: JSON.stringify({
      message: sha ? `cms: update ${slug}` : `cms: create ${slug}`,
      content: b64encode(content),
      branch: cfg.branch,
      sha,
    }),
  });
  if (!res.ok) throw new Error(`GitHub ${res.status}: ${await res.text()}`);
}

export async function adminDeletePost(cfg: CmsConfig, token: string, slug: string, sha: string): Promise<void> {
  const path = `${cfg.postsPath}/${slug}.md`;
  const res = await fetch(api(cfg, path), {
    method: "DELETE",
    headers: { ...headers(token), "Content-Type": "application/json" },
    body: JSON.stringify({ message: `cms: delete ${slug}`, branch: cfg.branch, sha }),
  });
  if (!res.ok) throw new Error(`GitHub ${res.status}: ${await res.text()}`);
}
