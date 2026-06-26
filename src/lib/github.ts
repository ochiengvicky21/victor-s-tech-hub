// GitHub public API helpers for ochiengvicky21
// All endpoints are public and unauthenticated.

export const GITHUB_USERNAME = "ochiengvicky21";
const GH = "https://api.github.com";

export interface GhUser {
  login: string;
  name: string | null;
  avatar_url: string;
  bio: string | null;
  html_url: string;
  public_repos: number;
  followers: number;
  following: number;
  location: string | null;
  company: string | null;
  blog: string | null;
}

export interface GhRepo {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  topics: string[];
  fork: boolean;
  archived: boolean;
  updated_at: string;
  pushed_at: string;
}

export interface GhEvent {
  id: string;
  type: string;
  repo: { name: string };
  created_at: string;
  payload: Record<string, unknown>;
}

async function gh<T>(path: string): Promise<T> {
  const res = await fetch(`${GH}${path}`, {
    headers: { Accept: "application/vnd.github+json" },
  });
  if (!res.ok) throw new Error(`GitHub ${path} failed: ${res.status}`);
  return res.json() as Promise<T>;
}

export const fetchGhUser = () => gh<GhUser>(`/users/${GITHUB_USERNAME}`);

export const fetchGhRepos = async (): Promise<GhRepo[]> => {
  const repos = await gh<GhRepo[]>(
    `/users/${GITHUB_USERNAME}/repos?per_page=100&sort=updated`,
  );
  return repos
    .filter((r) => !r.fork && !r.archived)
    .sort((a, b) => +new Date(b.pushed_at) - +new Date(a.pushed_at));
};

export const fetchGhEvents = async (): Promise<GhEvent[]> => {
  const events = await gh<GhEvent[]>(
    `/users/${GITHUB_USERNAME}/events/public?per_page=20`,
  );
  return events.slice(0, 12);
};

const LANG_COLORS: Record<string, string> = {
  TypeScript: "oklch(0.72 0.18 240)",
  JavaScript: "oklch(0.86 0.18 95)",
  Python: "oklch(0.72 0.16 240)",
  HTML: "oklch(0.68 0.22 30)",
  CSS: "oklch(0.68 0.18 280)",
  Java: "oklch(0.68 0.18 40)",
  Dart: "oklch(0.72 0.16 200)",
  Kotlin: "oklch(0.72 0.2 290)",
  Go: "oklch(0.78 0.14 200)",
  Rust: "oklch(0.65 0.18 40)",
  PHP: "oklch(0.62 0.14 280)",
  C: "oklch(0.72 0.05 240)",
  "C++": "oklch(0.62 0.18 350)",
  Shell: "oklch(0.78 0.18 140)",
  Vue: "oklch(0.78 0.16 160)",
  Ruby: "oklch(0.62 0.22 25)",
  Swift: "oklch(0.72 0.22 35)",
};

export const langColor = (lang: string | null) =>
  (lang && LANG_COLORS[lang]) || "oklch(0.72 0.22 255)";
