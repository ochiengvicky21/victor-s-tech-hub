import { CMS, API_BASE, RAW_BASE } from "./cms-config";

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
  const match = raw.match(/^---\s*\n([\s\S]*?)\n---\s*\n?([\s\S]*)$/);
  if (!match) return { meta: {}, body: raw };

  const meta: Record<string, string> = {};
  match[1].split("\n").forEach((line) => {
    const separator = line.indexOf(":");
    if (separator <= 0) return;

    const key = line.slice(0, separator).trim();
    let value = line.slice(separator + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    meta[key] = value;
  });
  return { meta, body: match[2] };
}

export function buildMarkdown(
  meta: { title: string; date: string; excerpt: string },
  body: string,
) {
  const escape = (value: string) => value.replace(/"/g, '\\"');
  return `---\ntitle: "${escape(meta.title)}"\ndate: "${escape(meta.date)}"\nexcerpt: "${escape(meta.excerpt)}"\n---\n\n${body}`;
}

export async function listPostsPublic(): Promise<PostMeta[]> {
  const response = await fetch(`${API_BASE}/${CMS.postsPath}?ref=${CMS.branch}`, {
    headers: { Accept: "application/vnd.github+json" },
  });
  if (response.status === 404) return [];
  if (!response.ok) throw new Error(`GitHub ${response.status}`);

  const files = (await response.json()) as Array<{ name: string; path: string; sha: string }>;
  const posts = await Promise.all(
    files
      .filter((file) => file.name.endsWith(".md"))
      .map(async (file): Promise<PostMeta> => {
        const slug = file.name.replace(/\.md$/, "");
        const response = await fetch(`${RAW_BASE}/${file.path}`);
        if (!response.ok)
          throw new Error(`Could not load post "${slug}" (HTTP ${response.status}).`);

        const { meta } = parseFrontmatter(await response.text());
        return {
          slug,
          title: meta.title || slug,
          date: meta.date || "",
          excerpt: meta.excerpt || "",
          sha: file.sha,
        };
      }),
  );
  return posts.sort((a, b) => b.date.localeCompare(a.date));
}

export async function getPostPublic(slug: string): Promise<Post | null> {
  const response = await fetch(`${RAW_BASE}/${CMS.postsPath}/${slug}.md`);
  if (response.status === 404) return null;
  if (!response.ok) throw new Error(`Could not load post "${slug}" (HTTP ${response.status}).`);

  const raw = await response.text();
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
