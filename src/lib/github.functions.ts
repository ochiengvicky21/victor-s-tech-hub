import { createServerFn } from "@tanstack/react-start";
import type { GhUser, GhRepo, GhEvent } from "./github-types";

const GITHUB_USERNAME = "ochiengvicky21";
const GH = "https://api.github.com";

// In-memory cache (per worker instance) to dodge rate limits and serve fast.
const TTL_MS = 5 * 60 * 1000;
type CacheEntry<T> = { at: number; data: T };
const cache = new Map<string, CacheEntry<unknown>>();

async function ghFetch<T>(path: string): Promise<T> {
  const hit = cache.get(path) as CacheEntry<T> | undefined;
  if (hit && Date.now() - hit.at < TTL_MS) return hit.data;

  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "User-Agent": "ochiengvicky21-portfolio",
  };
  const token = process.env.GITHUB_TOKEN;
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${GH}${path}`, { headers });
  if (!res.ok) {
    // Serve stale on failure (e.g. rate limit) rather than breaking the UI.
    if (hit) return hit.data;
    throw new Error(`GitHub ${path} failed: ${res.status}`);
  }
  const data = (await res.json()) as T;
  cache.set(path, { at: Date.now(), data });
  return data;
}

export const getGhUser = createServerFn({ method: "GET" }).handler(async () => {
  return ghFetch<GhUser>(`/users/${GITHUB_USERNAME}`);
});

export const getGhRepos = createServerFn({ method: "GET" }).handler(async () => {
  const repos = await ghFetch<GhRepo[]>(
    `/users/${GITHUB_USERNAME}/repos?per_page=100&sort=updated`,
  );
  return repos
    .filter((r) => !r.fork && !r.archived)
    .sort((a, b) => +new Date(b.pushed_at) - +new Date(a.pushed_at));
});

export const getGhEvents = createServerFn({ method: "GET" }).handler(async () => {
  const events = await ghFetch<GhEvent[]>(
    `/users/${GITHUB_USERNAME}/events/public?per_page=20`,
  );
  return events.slice(0, 12);
});
