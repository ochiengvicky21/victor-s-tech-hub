export type JobPosting = {
  id: string;
  title: string;
  company: string;
  location: string;
  employmentType: string;
  description: string;
  url: string;
  postedAt: string;
  source: "Jobicy" | "Arbeitnow";
  matchScore: number;
};

export type JobSearchResult = {
  jobs: JobPosting[];
  warnings: string[];
  fetchedAt: string;
};

export type ApplicationStatus =
  "saved" | "applied" | "interviewing" | "offer" | "rejected" | "closed";

export type JobApplication = {
  id: string;
  admin_user_id: string;
  job_id: string;
  title: string;
  company: string;
  job_url: string;
  source: string;
  location: string;
  employment_type: string;
  posted_at: string;
  status: ApplicationStatus;
  notes: string;
  applied_at: string | null;
  created_at: string;
  updated_at: string;
};
