import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireAdmin } from "./admin-auth.server";
import { CMS } from "./cms-config";
import { buildMarkdown, parseFrontmatter, type Post, type PostMeta } from "./cms";

const GITHUB_API = `https://api.github.com/repos/${CMS.owner}/${CMS.repo}/contents`;

function githubHeaders() {
  const token = process.env.GITHUB_CMS_TOKEN;
  if (!token)
    throw new Error("CMS publishing is not configured. Set GITHUB_CMS_TOKEN on the server.");

  return {
    Accept: "application/vnd.github+json",
    Authorization: `Bearer ${token}`,
    "X-GitHub-Api-Version": "2022-11-28",
    "Content-Type": "application/json",
  };
}

function decodeContent(content: string) {
  return decodeURIComponent(escape(atob(content.replace(/\n/g, ""))));
}

function encodeContent(content: string) {
  return btoa(unescape(encodeURIComponent(content)));
}

function assertSlug(slug: string) {
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug) || slug.length > 80) {
    throw new Error("The post slug is invalid.");
  }
}

export const adminListPosts = createServerFn({ method: "GET" }).handler(async () => {
  await requireAdmin();
  const response = await fetch(
    `${GITHUB_API}/${CMS.postsPath}?ref=${encodeURIComponent(CMS.branch)}`,
    { headers: githubHeaders(), signal: AbortSignal.timeout(15_000) },
  );

  if (response.status === 404) return [];
  if (!response.ok) throw new Error(`GitHub returned HTTP ${response.status}.`);

  const files = (await response.json()) as Array<{ name: string; path: string; sha: string }>;
  const posts = await Promise.all(
    files
      .filter((file) => file.name.endsWith(".md"))
      .map(async (file): Promise<PostMeta> => {
        const fileResponse = await fetch(
          `${GITHUB_API}/${file.path}?ref=${encodeURIComponent(CMS.branch)}`,
          { headers: githubHeaders(), signal: AbortSignal.timeout(15_000) },
        );
        if (!fileResponse.ok) {
          throw new Error(`Could not read ${file.name} from GitHub (HTTP ${fileResponse.status}).`);
        }
        const content = (await fileResponse.json()) as { content: string; sha: string };
        const { meta } = parseFrontmatter(decodeContent(content.content));
        return {
          slug: file.name.slice(0, -3),
          title: meta.title || file.name.slice(0, -3),
          date: meta.date || "",
          excerpt: meta.excerpt || "",
          sha: content.sha,
        };
      }),
  );

  return posts.sort((a, b) => b.date.localeCompare(a.date));
});

export const adminGetPost = createServerFn({ method: "GET" })
  .validator(z.object({ slug: z.string().min(1).max(80) }))
  .handler(async ({ data }): Promise<(Post & { sha: string }) | null> => {
    await requireAdmin();
    assertSlug(data.slug);
    const response = await fetch(
      `${GITHUB_API}/${CMS.postsPath}/${data.slug}.md?ref=${encodeURIComponent(CMS.branch)}`,
      { headers: githubHeaders(), signal: AbortSignal.timeout(15_000) },
    );
    if (response.status === 404) return null;
    if (!response.ok) throw new Error(`GitHub returned HTTP ${response.status}.`);

    const file = (await response.json()) as { content: string; sha: string };
    const raw = decodeContent(file.content);
    const { meta, body } = parseFrontmatter(raw);
    return {
      slug: data.slug,
      title: meta.title || data.slug,
      date: meta.date || "",
      excerpt: meta.excerpt || "",
      body,
      raw,
      sha: file.sha,
    };
  });

export const adminSavePost = createServerFn({ method: "POST" })
  .validator(
    z.object({
      slug: z.string().min(1).max(80),
      title: z.string().trim().min(1).max(200),
      date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
      excerpt: z.string().max(500),
      body: z.string().max(100_000),
      sha: z.string().optional(),
    }),
  )
  .handler(async ({ data }) => {
    await requireAdmin();
    assertSlug(data.slug);
    const response = await fetch(`${GITHUB_API}/${CMS.postsPath}/${data.slug}.md`, {
      method: "PUT",
      headers: githubHeaders(),
      body: JSON.stringify({
        message: data.sha ? `cms: update ${data.slug}` : `cms: create ${data.slug}`,
        content: encodeContent(
          buildMarkdown({ title: data.title, date: data.date, excerpt: data.excerpt }, data.body),
        ),
        branch: CMS.branch,
        sha: data.sha,
      }),
      signal: AbortSignal.timeout(15_000),
    });
    if (!response.ok) throw new Error(`GitHub could not save the post (HTTP ${response.status}).`);
  });

export const adminDeletePost = createServerFn({ method: "POST" })
  .validator(z.object({ slug: z.string().min(1).max(80), sha: z.string().min(1) }))
  .handler(async ({ data }) => {
    await requireAdmin();
    assertSlug(data.slug);
    const response = await fetch(`${GITHUB_API}/${CMS.postsPath}/${data.slug}.md`, {
      method: "DELETE",
      headers: githubHeaders(),
      body: JSON.stringify({
        message: `cms: delete ${data.slug}`,
        branch: CMS.branch,
        sha: data.sha,
      }),
      signal: AbortSignal.timeout(15_000),
    });
    if (!response.ok)
      throw new Error(`GitHub could not delete the post (HTTP ${response.status}).`);
  });
