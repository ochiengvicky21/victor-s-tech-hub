// GitHub data layer — fetched on the server (with cache + optional token)
// to avoid unauthenticated client rate limits.
export { getGhUser as fetchGhUser, getGhRepos as fetchGhRepos, getGhEvents as fetchGhEvents } from "./github.functions";
export type { GhUser, GhRepo, GhEvent } from "./github-types";

export const GITHUB_USERNAME = "ochiengvicky21";

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
