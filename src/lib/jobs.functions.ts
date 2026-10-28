import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireAdmin } from "./admin-auth.server";
import type { JobPosting, JobSearchResult } from "./jobs.types";

const EAST_AFRICA =
  /\b(africa|east africa|kenya|nairobi|uganda|kampala|tanzania|dar es salaam|rwanda|kigali|ethiopia|addis ababa|burundi|somalia|south sudan)\b/i;
const BROAD_REMOTE =
  /\b(worldwide|anywhere|global|africa|east africa|all countries|multiple countries|remote - global)\b/i;
const SPECIALTIES = [
  /\bfull[\s-]?stack\b/i,
  /\bsoftware (engineer|engineering|developer|development)\b/i,
  /\bweb (engineer|developer|development)\b/i,
  /\bfrontend\b|\bfront[\s-]?end\b/i,
  /\bbackend\b|\bback[\s-]?end\b/i,
  /\breact(?:\.js)?\b/i,
  /\btypescript\b/i,
  /\bnode(?:\.js)?\b/i,
  /\bjavascript\b/i,
  /\bsaas\b/i,
  /\b(ai|artificial intelligence|llm|generative ai|rag)\b/i,
  /\bproduct engineer\b|\bplatform engineer\b/i,
  /\bcloud engineer\b|\bdevops engineer\b/i,
];

type JobicyJob = {
  id: number;
  url: string;
  jobTitle: string;
  companyName: string;
  jobGeo: string;
  jobType?: string[];
  jobIndustry?: string[];
  jobExcerpt?: string;
  pubDate?: string;
};

type JobicyResponse = { jobs?: JobicyJob[] };

type ArbeitnowJob = {
  slug: string;
  url: string;
  title: string;
  company_name: string;
  location: string;
  remote: boolean;
  job_types?: string[];
  tags?: string[];
  created_at: number;
};

type ArbeitnowResponse = { data?: ArbeitnowJob[] };

let cached: { fetchedAt: number; jobs: JobPosting[]; warnings: string[] } | undefined;
const CACHE_DURATION = 5 * 60_000;

function plainText(value: string) {
  return value
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/&hellip;/gi, "...")
    .replace(/\s+/g, " ")
    .trim();
}

function matchScore(job: Pick<JobPosting, "title" | "description">) {
  const searchable = `${job.title} ${job.description}`;
  const matchingTerms = SPECIALTIES.filter((pattern) => pattern.test(searchable));
  return Math.min(98, matchingTerms.length * 22);
}

function locationIsRelevant(location: string) {
  return EAST_AFRICA.test(location) || BROAD_REMOTE.test(location);
}

function safeJobUrl(value: string, source: JobPosting["source"]) {
  try {
    const url = new URL(value);
    if (url.protocol !== "https:") return false;
    return source === "Jobicy"
      ? url.hostname === "jobicy.com" || url.hostname === "www.jobicy.com"
      : url.hostname === "arbeitnow.com" || url.hostname === "www.arbeitnow.com";
  } catch {
    return false;
  }
}

async function fetchJobicy() {
  const response = await fetch(
    "https://jobicy.com/api/v2/remote-jobs?count=100&industry=engineering",
    { signal: AbortSignal.timeout(15_000) },
  );
  if (!response.ok) throw new Error(`Jobicy returned HTTP ${response.status}.`);
  const data = (await response.json()) as JobicyResponse;

  return (data.jobs ?? [])
    .map<JobPosting>((job) => ({
      id: `jobicy-${job.id}`,
      title: job.jobTitle,
      company: job.companyName,
      location: job.jobGeo,
      employmentType: job.jobType?.join(", ") || "Not specified",
      description: plainText(`${(job.jobIndustry ?? []).join(", ")} ${job.jobExcerpt ?? ""}`),
      url: job.url,
      postedAt: job.pubDate ?? "",
      source: "Jobicy",
      matchScore: 0,
    }))
    .filter((job) => job.title && job.company && safeJobUrl(job.url, job.source))
    .filter((job) => locationIsRelevant(job.location))
    .map((job) => ({ ...job, matchScore: matchScore(job) }))
    .filter((job) => job.matchScore > 0);
}

async function fetchArbeitnow() {
  const response = await fetch("https://arbeitnow.com/api/job-board-api?page=1", {
    signal: AbortSignal.timeout(15_000),
  });
  if (!response.ok) throw new Error(`Arbeitnow returned HTTP ${response.status}.`);
  const data = (await response.json()) as ArbeitnowResponse;

  return (data.data ?? [])
    .map<JobPosting>((job) => ({
      id: `arbeitnow-${job.slug}`,
      title: job.title,
      company: job.company_name,
      location: job.location,
      employmentType: job.job_types?.join(", ") || "Not specified",
      description: plainText((job.tags ?? []).join(", ")),
      url: job.url,
      postedAt: job.created_at ? new Date(job.created_at * 1000).toISOString() : "",
      source: "Arbeitnow",
      matchScore: 0,
    }))
    .filter((job) => job.title && job.company && safeJobUrl(job.url, job.source))
    .filter((job) => locationIsRelevant(job.location))
    .map((job) => ({ ...job, matchScore: matchScore(job) }))
    .filter((job) => job.matchScore > 0);
}

async function searchJobs(query: string): Promise<JobSearchResult> {
  const now = Date.now();
  let jobs: JobPosting[];
  let warnings: string[] = [];

  if (cached && now - cached.fetchedAt < CACHE_DURATION) {
    jobs = cached.jobs;
    warnings = cached.warnings;
  } else {
    const sources = await Promise.allSettled([fetchJobicy(), fetchArbeitnow()]);
    const successful = sources.flatMap((source) =>
      source.status === "fulfilled" ? source.value : [],
    );
    warnings = sources.flatMap((source, index) =>
      source.status === "rejected"
        ? [
            `${index === 0 ? "Jobicy" : "Arbeitnow"} could not be reached: ${
              source.reason instanceof Error ? source.reason.message : "unknown error"
            }`,
          ]
        : [],
    );

    if (successful.length === 0 && warnings.length > 0) {
      throw new Error(`Job sources are unavailable. ${warnings.join(" ")}`);
    }

    jobs = [...new Map(successful.map((job) => [job.id, job])).values()].sort(
      (a, b) => b.matchScore - a.matchScore || b.postedAt.localeCompare(a.postedAt),
    );
    cached = { fetchedAt: now, jobs, warnings };
  }

  const normalizedQuery = query.trim().toLowerCase();
  const filtered = normalizedQuery
    ? jobs.filter((job) => {
        const searchable =
          `${job.title} ${job.company} ${job.location} ${job.description}`.toLowerCase();
        return normalizedQuery.split(/\s+/).every((term) => searchable.includes(term));
      })
    : jobs;

  return { jobs: filtered, warnings, fetchedAt: new Date(cached?.fetchedAt ?? now).toISOString() };
}

export const searchRelevantJobs = createServerFn({ method: "POST" })
  .validator(z.object({ query: z.string().trim().max(100).default("") }))
  .handler(async ({ data }) => {
    await requireAdmin();
    return searchJobs(data.query);
  });
