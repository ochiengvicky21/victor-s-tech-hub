import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireAdmin } from "./admin-auth.server";
import { CMS } from "./cms-config";
import {
  DEFAULT_SITE_CONTENT,
  siteContentSchema,
  type CodeSnippetSource,
  type FetchedCodeSnippet,
  type SiteContent,
} from "./site-content";

const GITHUB_API = `https://api.github.com/repos/${CMS.owner}/${CMS.repo}/contents`;
const GITHUB_RAW = `https://raw.githubusercontent.com/${CMS.owner}/${CMS.repo}/${CMS.branch}`;
const CONTENT_PATH = "content/site-content.json";
const CACHE_MS = 60_000;
const MAX_SOURCE_BYTES = 64_000;
const MAX_SNIPPET_CHARS = 4_000;
let cachedContent: { expiresAt: number; value: SiteContent } | undefined;
const snippetCache = new Map<string, { expiresAt: number; value: FetchedCodeSnippet }>();

function githubHeaders() {
  const token = process.env.GITHUB_CMS_TOKEN;
  if (!token) {
    throw new Error("CMS publishing is not configured. Set GITHUB_CMS_TOKEN on the server.");
  }
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

function readGitHubSource(urlString: string) {
  const url = new URL(urlString);
  if (url.hostname === "github.com") {
    const parts = url.pathname.split("/").filter(Boolean);
    const blobIndex = parts.indexOf("blob");
    const owner = parts[0];
    const repo = parts[1];
    const ref = parts[blobIndex + 1];
    const file = parts.slice(blobIndex + 2);
    if (!owner || !repo || !ref || file.length === 0) throw new Error("Invalid GitHub file URL.");
    const rawPath = [owner, repo.replace(/\.git$/, ""), ref, ...file]
      .map(encodeURIComponent)
      .join("/");
    return `https://raw.githubusercontent.com/${rawPath}`;
  }

  if (url.hostname === "gitlab.com") {
    const parts = url.pathname.split("/").filter(Boolean);
    const markerIndex = parts.indexOf("-");
    const ref = parts[markerIndex + 2];
    const file = parts.slice(markerIndex + 3);
    const projectPath = parts.slice(0, markerIndex);
    if (markerIndex < 2 || !ref || file.length === 0) throw new Error("Invalid GitLab file URL.");
    const rawPath = [...projectPath, "-", "raw", ref, ...file].map(encodeURIComponent).join("/");
    return `https://gitlab.com/${rawPath}`;
  }

  throw new Error("Only public GitHub and GitLab file URLs are supported.");
}

async function readLimitedText(response: Response) {
  const reader = response.body?.getReader();
  if (!reader) throw new Error("The source did not return a readable file.");
  const chunks: Uint8Array[] = [];
  let total = 0;
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    total += value.byteLength;
    if (total > MAX_SOURCE_BYTES) {
      await reader.cancel();
      throw new Error("The source file is too large to display as a snippet.");
    }
    chunks.push(value);
  }
  const bytes = new Uint8Array(total);
  let offset = 0;
  for (const chunk of chunks) {
    bytes.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return new TextDecoder().decode(bytes);
}

async function fetchSnippet(source: CodeSnippetSource): Promise<FetchedCodeSnippet> {
  const cached = snippetCache.get(source.sourceUrl);
  if (cached && cached.expiresAt > Date.now()) return { ...source, ...cached.value };

  let value: FetchedCodeSnippet;
  try {
    const response = await fetch(readGitHubSource(source.sourceUrl), {
      headers: { "User-Agent": "victor-portfolio-code-showcase" },
      signal: AbortSignal.timeout(10_000),
    });
    if (!response.ok) throw new Error(`The source returned HTTP ${response.status}.`);
    const text = await readLimitedText(response);
    value = {
      ...source,
      code: text.slice(0, MAX_SNIPPET_CHARS),
      error:
        text.length > MAX_SNIPPET_CHARS
          ? `Showing the first ${MAX_SNIPPET_CHARS.toLocaleString()} characters.`
          : null,
    };
  } catch (error) {
    value = {
      ...source,
      code: null,
      error: error instanceof Error ? error.message : "The source could not be loaded.",
    };
  }

  snippetCache.set(source.sourceUrl, { expiresAt: Date.now() + CACHE_MS, value });
  return value;
}

async function fetchPublicContent(): Promise<SiteContent> {
  if (cachedContent && cachedContent.expiresAt > Date.now()) return cachedContent.value;

  const response = await fetch(`${GITHUB_RAW}/${CONTENT_PATH}`, {
    headers: { Accept: "application/vnd.github.raw" },
    signal: AbortSignal.timeout(10_000),
  });
  if (response.status === 404) return DEFAULT_SITE_CONTENT;
  if (!response.ok)
    throw new Error(`Could not load published site content (HTTP ${response.status}).`);

  const content = siteContentSchema.parse(await response.json());
  cachedContent = { expiresAt: Date.now() + CACHE_MS, value: content };
  return content;
}

export const getPublicSiteContent = createServerFn({ method: "GET" })
  .validator(z.object({ includeCode: z.boolean().optional() }))
  .handler(async ({ data }) => {
    const content = await fetchPublicContent();
    const codeSnippets: FetchedCodeSnippet[] = data.includeCode
      ? await Promise.all(content.snippets.map(fetchSnippet))
      : [];
    return { content, codeSnippets };
  });

export const adminGetSiteContent = createServerFn({ method: "GET" }).handler(
  async (): Promise<{ content: SiteContent; sha: string | null }> => {
    await requireAdmin();
    const response = await fetch(
      `${GITHUB_API}/${CONTENT_PATH}?ref=${encodeURIComponent(CMS.branch)}`,
      { headers: githubHeaders(), signal: AbortSignal.timeout(15_000) },
    );
    if (response.status === 404) return { content: DEFAULT_SITE_CONTENT, sha: null };
    if (!response.ok) throw new Error(`GitHub returned HTTP ${response.status}.`);

    const file = (await response.json()) as { content: string; sha: string };
    return {
      content: siteContentSchema.parse(JSON.parse(decodeContent(file.content))),
      sha: file.sha,
    };
  },
);

export const adminSaveSiteContent = createServerFn({ method: "POST" })
  .validator(
    z.object({
      content: siteContentSchema,
      sha: z.string().nullable(),
    }),
  )
  .handler(async ({ data }) => {
    await requireAdmin();
    const response = await fetch(`${GITHUB_API}/${CONTENT_PATH}`, {
      method: "PUT",
      headers: githubHeaders(),
      body: JSON.stringify({
        message: "cms: update portfolio sections and code sources",
        content: encodeContent(`${JSON.stringify(data.content, null, 2)}\n`),
        branch: CMS.branch,
        ...(data.sha ? { sha: data.sha } : {}),
      }),
      signal: AbortSignal.timeout(15_000),
    });
    if (!response.ok) {
      throw new Error(`GitHub could not save site content (HTTP ${response.status}).`);
    }

    const result = (await response.json()) as { content?: { sha?: string } };
    cachedContent = undefined;
    snippetCache.clear();
    return { sha: result.content?.sha ?? null };
  });
