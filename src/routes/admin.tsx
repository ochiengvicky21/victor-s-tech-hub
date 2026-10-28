import { createFileRoute, Link } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { marked } from "marked";
import {
  ArrowUpRight,
  BriefcaseBusiness,
  ChartNoAxesCombined,
  ExternalLink,
  FileText,
  LoaderCircle,
  LogOut,
  PanelsTopLeft,
  RefreshCw,
  Search,
} from "lucide-react";
import { CMS } from "@/lib/cms-config";
import type { Post, PostMeta } from "@/lib/cms";
import {
  adminDeletePost as deletePostRequest,
  adminGetPost as getPostRequest,
  adminListPosts as listPostsRequest,
  adminSavePost as savePostRequest,
} from "@/lib/cms.functions";
import type {
  ApplicationStatus,
  JobApplication,
  JobPosting,
  JobSearchResult,
} from "@/lib/jobs.types";
import { searchRelevantJobs } from "@/lib/jobs.functions";
import { getSupabaseClient, isAdminUser, isSupabaseConfigured } from "@/lib/supabase";
import { SiteContentEditor } from "@/components/admin/SiteContentEditor";

type AdminTab = "overview" | "jobs" | "applications" | "content" | "site";

const tabs: { id: AdminTab; label: string; icon: typeof ChartNoAxesCombined }[] = [
  { id: "overview", label: "Overview", icon: ChartNoAxesCombined },
  { id: "jobs", label: "Job search", icon: Search },
  { id: "applications", label: "Applications", icon: BriefcaseBusiness },
  { id: "content", label: "Content", icon: FileText },
  { id: "site", label: "Site sections", icon: PanelsTopLeft },
];

const applicationStatuses: { value: ApplicationStatus; label: string }[] = [
  { value: "saved", label: "Saved" },
  { value: "applied", label: "Applied" },
  { value: "interviewing", label: "Interviewing" },
  { value: "offer", label: "Offer" },
  { value: "rejected", label: "Rejected" },
  { value: "closed", label: "Closed" },
];

function messageFromError(error: unknown) {
  return error instanceof Error ? error.message : "Something went wrong. Please try again.";
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80);
}

function dateLabel(value: string) {
  if (!value) return "Date not provided";
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? "Date not provided"
    : new Intl.DateTimeFormat("en", { dateStyle: "medium" }).format(date);
}

function authHeaders(accessToken: string) {
  return { headers: { Authorization: `Bearer ${accessToken}` } };
}

function AdminPage() {
  const configured = isSupabaseConfigured();
  const [session, setSession] = useState<Session | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authBusy, setAuthBusy] = useState(false);
  const [tab, setTab] = useState<AdminTab>("overview");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [posts, setPosts] = useState<PostMeta[]>([]);
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [jobs, setJobs] = useState<JobSearchResult | null>(null);
  const [jobQuery, setJobQuery] = useState("");
  const [editing, setEditing] = useState<
    | (Pick<Post, "slug" | "title" | "date" | "excerpt" | "body" | "sha"> & {
        isNew: boolean;
      })
    | null
  >(null);

  const supabase = configured ? getSupabaseClient() : null;
  const accessToken = session?.access_token ?? "";

  useEffect(() => {
    window.localStorage.removeItem("voo_admin_token");
    window.localStorage.removeItem("voo_admin_cfg");
  }, []);

  useEffect(() => {
    if (!supabase) {
      setAuthReady(true);
      return;
    }

    let active = true;
    void supabase.auth.getSession().then(({ data, error }) => {
      if (!active) return;
      if (error) setMessage(error.message);
      if (data.session && !isAdminUser(data.session.user)) {
        setMessage("This Supabase account is not assigned the admin role.");
        void supabase.auth.signOut();
      } else {
        setSession(data.session);
      }
      setAuthReady(true);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      if (!active) return;
      if (nextSession && !isAdminUser(nextSession.user)) {
        setSession(null);
        setMessage("This Supabase account is not assigned the admin role.");
        window.setTimeout(() => void supabase.auth.signOut(), 0);
        return;
      }
      setSession(nextSession);
      if (nextSession) setMessage("");
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, [supabase]);

  async function signIn(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!supabase) return;

    setAuthBusy(true);
    setMessage("");
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });
      if (error) throw error;
      if (!isAdminUser(data.user)) {
        await supabase.auth.signOut();
        throw new Error("This account is not assigned the admin role.");
      }
      setSession(data.session);
      setPassword("");
    } catch (error) {
      setMessage(messageFromError(error));
    } finally {
      setAuthBusy(false);
    }
  }

  async function signOut() {
    if (!supabase) return;
    const { error } = await supabase.auth.signOut();
    if (error) {
      setMessage(`Sign out failed: ${error.message}`);
      return;
    }
    setSession(null);
    setJobs(null);
    setApplications([]);
    setPosts([]);
    setTab("overview");
  }

  const loadPosts = useCallback(async () => {
    if (!accessToken) return;
    setBusy(true);
    setMessage("");
    try {
      setPosts(await listPostsRequest(authHeaders(accessToken)));
    } catch (error) {
      setMessage(`Could not load posts: ${messageFromError(error)}`);
    } finally {
      setBusy(false);
    }
  }, [accessToken]);

  const loadApplications = useCallback(async () => {
    if (!supabase) return;
    setBusy(true);
    setMessage("");
    try {
      const { data, error } = await supabase
        .from("job_applications")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      setApplications(data ?? []);
    } catch (error) {
      setMessage(`Could not load your application tracker: ${messageFromError(error)}`);
    } finally {
      setBusy(false);
    }
  }, [supabase]);

  useEffect(() => {
    if (!accessToken) return;
    if (tab === "content") void loadPosts();
    if (tab === "applications" || tab === "overview") void loadApplications();
  }, [accessToken, loadApplications, loadPosts, tab]);

  async function searchJobs(event?: React.FormEvent<HTMLFormElement>) {
    event?.preventDefault();
    if (!accessToken) return;

    setBusy(true);
    setMessage("");
    try {
      const result = await searchRelevantJobs({
        data: { query: jobQuery },
        ...authHeaders(accessToken),
      });
      setJobs(result);
      if (result.warnings.length) setMessage(result.warnings.join(" "));
    } catch (error) {
      setMessage(`Could not fetch job listings: ${messageFromError(error)}`);
    } finally {
      setBusy(false);
    }
  }

  async function saveJob(job: JobPosting) {
    if (!supabase || !session) return;
    setBusy(true);
    setMessage("");
    try {
      const { error } = await supabase.from("job_applications").upsert(
        {
          admin_user_id: session.user.id,
          job_id: job.id,
          title: job.title,
          company: job.company,
          job_url: job.url,
          source: job.source,
          location: job.location,
          employment_type: job.employmentType,
          posted_at: job.postedAt,
          status: "saved",
          notes: "",
          applied_at: null,
        },
        { onConflict: "admin_user_id,job_id", ignoreDuplicates: true },
      );
      if (error) throw error;
      await loadApplications();
      setMessage(`Saved ${job.title} to your application tracker.`);
    } catch (error) {
      setMessage(`Could not save this job: ${messageFromError(error)}`);
    } finally {
      setBusy(false);
    }
  }

  async function updateApplication(
    application: JobApplication,
    updates: Pick<JobApplication, "status"> | Pick<JobApplication, "notes">,
  ) {
    if (!supabase) return;
    setBusy(true);
    setMessage("");
    try {
      const newStatus = "status" in updates ? updates.status : undefined;
      const { error } = await supabase
        .from("job_applications")
        .update({
          ...updates,
          ...(newStatus === "applied" && !application.applied_at
            ? { applied_at: new Date().toISOString() }
            : {}),
        })
        .eq("id", application.id);
      if (error) throw error;
      await loadApplications();
      setMessage("Application updated.");
    } catch (error) {
      setMessage(`Could not update this application: ${messageFromError(error)}`);
    } finally {
      setBusy(false);
    }
  }

  async function openEditPost(slug: string) {
    if (!accessToken) return;
    setBusy(true);
    setMessage("");
    try {
      const post = await getPostRequest({
        data: { slug },
        ...authHeaders(accessToken),
      });
      if (post) setEditing({ ...post, isNew: false });
      else setMessage("The post no longer exists.");
    } catch (error) {
      setMessage(`Could not open this post: ${messageFromError(error)}`);
    } finally {
      setBusy(false);
    }
  }

  async function savePost() {
    if (!editing || !accessToken) return;
    const slug = editing.isNew ? slugify(editing.slug || editing.title) : editing.slug;
    if (!slug) {
      setMessage("Add a title or a valid post slug before saving.");
      return;
    }

    setBusy(true);
    setMessage("");
    try {
      await savePostRequest({
        data: {
          slug,
          title: editing.title,
          date: editing.date,
          excerpt: editing.excerpt,
          body: editing.body,
          sha: editing.sha,
        },
        ...authHeaders(accessToken),
      });
      setEditing(null);
      await loadPosts();
      setMessage("Post saved. The site will update after its next deployment.");
    } catch (error) {
      setMessage(`Could not save this post: ${messageFromError(error)}`);
    } finally {
      setBusy(false);
    }
  }

  async function deletePost(post: PostMeta) {
    if (!accessToken || !post.sha) return;
    if (!window.confirm(`Delete "${post.title}"? This cannot be undone.`)) return;

    setBusy(true);
    setMessage("");
    try {
      await deletePostRequest({
        data: { slug: post.slug, sha: post.sha },
        ...authHeaders(accessToken),
      });
      await loadPosts();
      setMessage("Post deleted.");
    } catch (error) {
      setMessage(`Could not delete this post: ${messageFromError(error)}`);
    } finally {
      setBusy(false);
    }
  }

  const preview = editing ? marked.parse(editing.body) : "";
  const trackedIds = useMemo(
    () => new Set(applications.map((application) => application.job_id)),
    [applications],
  );
  const linkedInSearch = new URL("https://www.linkedin.com/jobs/search/");
  linkedInSearch.searchParams.set(
    "keywords",
    jobQuery || "Full Stack Engineer React TypeScript Node.js AI",
  );
  linkedInSearch.searchParams.set("location", "East Africa");

  if (!configured) {
    return (
      <AdminShell>
        <p className="eyebrow">Admin setup</p>
        <h1 className="mt-3 serif-display text-4xl">Connect Supabase</h1>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed ink-soft">
          Configure <code>VITE_SUPABASE_URL</code> and <code>VITE_SUPABASE_ANON_KEY</code> in your
          local environment and deployment settings. Follow the Supabase setup guide before signing
          in.
        </p>
        <Link to="/" className="mt-6 inline-flex text-sm font-medium underline">
          Return to the site
        </Link>
      </AdminShell>
    );
  }

  if (!authReady) {
    return (
      <AdminShell>
        <p className="inline-flex items-center gap-2 text-sm ink-soft">
          <LoaderCircle className="h-4 w-4 animate-spin" /> Checking your session…
        </p>
      </AdminShell>
    );
  }

  if (!session) {
    return (
      <AdminShell>
        <p className="eyebrow">Private workspace</p>
        <h1 className="mt-3 serif-display text-4xl">Admin sign in</h1>
        <p className="mt-3 text-sm leading-relaxed ink-soft">
          Sign in with the email and password for your Supabase admin account.
        </p>
        <form onSubmit={signIn} className="admin-panel mt-6 space-y-4 p-5 sm:p-6">
          <label className="block">
            <span className="eyebrow">Email</span>
            <input
              type="email"
              autoComplete="username"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="mt-1 w-full rounded-lg border border-rule bg-surface px-3 py-2.5 text-sm"
              required
            />
          </label>
          <label className="block">
            <span className="eyebrow">Password</span>
            <input
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="mt-1 w-full rounded-lg border border-rule bg-surface px-3 py-2.5 text-sm"
              required
            />
          </label>
          <button
            disabled={authBusy}
            className="w-full rounded-full bg-ink py-2.5 text-sm font-medium text-paper disabled:opacity-50"
          >
            {authBusy ? "Signing in…" : "Sign in"}
          </button>
        </form>
        {message && (
          <p role="alert" className="mt-4 text-sm text-red-700">
            {message}
          </p>
        )}
      </AdminShell>
    );
  }

  if (editing) {
    return (
      <AdminShell wide>
        <div className="page-intro flex flex-wrap items-center justify-between gap-3 p-5 sm:p-7">
          <div>
            <p className="eyebrow">Content · Markdown</p>
            <h1 className="mt-2 serif-display text-3xl">
              {editing.isNew ? "New post" : `Edit: ${editing.slug}`}
            </h1>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setEditing(null)}
              className="rounded-full border border-rule px-4 py-2 text-sm"
            >
              Cancel
            </button>
            <button
              disabled={busy}
              onClick={savePost}
              className="rounded-full bg-ink px-5 py-2 text-sm font-medium text-paper disabled:opacity-50"
            >
              {busy ? "Saving…" : "Save post"}
            </button>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-4">
          <input
            aria-label="Post title"
            className="rounded border border-rule px-3 py-2 text-sm md:col-span-2"
            placeholder="Title"
            value={editing.title}
            onChange={(event) => setEditing({ ...editing, title: event.target.value })}
          />
          <input
            aria-label="Post slug"
            className="rounded border border-rule px-3 py-2 text-sm"
            placeholder="Slug"
            value={editing.slug}
            onChange={(event) => setEditing({ ...editing, slug: slugify(event.target.value) })}
            disabled={!editing.isNew}
          />
          <input
            aria-label="Post date"
            type="date"
            className="rounded border border-rule px-3 py-2 text-sm"
            value={editing.date}
            onChange={(event) => setEditing({ ...editing, date: event.target.value })}
          />
          <input
            aria-label="Post excerpt"
            className="rounded border border-rule px-3 py-2 text-sm md:col-span-4"
            placeholder="Excerpt"
            value={editing.excerpt}
            onChange={(event) => setEditing({ ...editing, excerpt: event.target.value })}
          />
        </div>

        <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
          <textarea
            aria-label="Post body in Markdown"
            className="min-h-[60vh] w-full rounded-lg border border-rule bg-surface px-3 py-2 font-mono text-sm"
            value={editing.body}
            onChange={(event) => setEditing({ ...editing, body: event.target.value })}
          />
          <iframe
            title="Markdown preview"
            sandbox=""
            srcDoc={`<!doctype html><meta charset="utf-8"><style>body{font:16px/1.6 system-ui,sans-serif;color:#20242c;padding:1rem}img{max-width:100%}pre{overflow:auto}a{color:#2563eb}</style>${String(preview)}`}
            className="min-h-[60vh] w-full rounded-lg border border-rule bg-white"
          />
        </div>
        {message && (
          <p role="status" className="mt-3 text-sm ink-soft">
            {message}
          </p>
        )}
      </AdminShell>
    );
  }

  return (
    <AdminShell wide>
      <div className="page-intro flex flex-wrap items-center justify-between gap-4 p-5 sm:p-7">
        <div>
          <p className="eyebrow">Private workspace</p>
          <h1 className="mt-2 serif-display text-4xl">Admin dashboard</h1>
          <p className="mt-2 text-sm ink-soft">{session.user.email}</p>
        </div>
        <button
          onClick={() => void signOut()}
          className="inline-flex items-center gap-2 rounded-full border border-rule px-4 py-2 text-sm"
        >
          <LogOut className="h-4 w-4" /> Sign out
        </button>
      </div>

      <div
        role="tablist"
        aria-label="Admin sections"
        className="mt-7 flex flex-wrap gap-2 border-b border-rule pb-3"
      >
        {tabs.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            role="tab"
            aria-selected={tab === id}
            onClick={() => {
              setTab(id);
              setMessage("");
            }}
            className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              tab === id
                ? "bg-ink text-paper shadow-blue"
                : "text-ink-soft hover:bg-surface-2 hover:text-ink"
            }`}
          >
            <Icon className="h-4 w-4" />
            {label}
          </button>
        ))}
      </div>

      {message && (
        <p
          role="status"
          className="mt-4 rounded-xl border border-rule bg-white px-4 py-3 text-sm ink-soft"
        >
          {message}
        </p>
      )}

      {tab === "overview" && (
        <section className="mt-7">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <Metric label="Relevant jobs" value={jobs?.jobs.length ?? "—"} />
            <Metric label="Tracked jobs" value={applications.length} />
            <Metric
              label="Applications sent"
              value={applications.filter((application) => application.status === "applied").length}
            />
            <Metric
              label="Interviews"
              value={
                applications.filter((application) => application.status === "interviewing").length
              }
            />
          </div>
          <div className="mt-5 flex flex-wrap gap-3">
            <button
              onClick={() => setTab("jobs")}
              className="rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-paper"
            >
              Find relevant jobs
            </button>
            <button
              onClick={() => setTab("applications")}
              className="rounded-full border border-rule px-5 py-2.5 text-sm"
            >
              Open application tracker
            </button>
            <button
              onClick={() => setTab("content")}
              className="rounded-full border border-rule px-5 py-2.5 text-sm"
            >
              Manage writing
            </button>
            <button
              onClick={() => setTab("site")}
              className="rounded-full border border-rule px-5 py-2.5 text-sm"
            >
              Edit site sections
            </button>
          </div>
          <p className="mt-7 rounded-2xl border border-rule bg-white p-5 text-sm leading-relaxed ink-soft">
            Job matches are drawn from Jobicy and Arbeitnow and filtered for full-stack/software
            engineering, React, TypeScript, Node.js, AI, SaaS, East Africa, and broadly eligible
            remote roles. Use LinkedIn&apos;s own search for additional listings; this site does not
            scrape LinkedIn.
          </p>
        </section>
      )}

      {tab === "jobs" && (
        <section className="mt-7">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="eyebrow">East Africa · Worldwide remote</p>
              <h2 className="mt-2 serif-display text-3xl">Relevant openings</h2>
            </div>
            <a
              href={linkedInSearch.toString()}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full border border-rule px-4 py-2 text-sm font-medium hover:border-ink"
            >
              Search LinkedIn <ArrowUpRight className="h-4 w-4" />
            </a>
          </div>

          <form onSubmit={searchJobs} className="mt-5 flex flex-col gap-3 sm:flex-row">
            <label className="flex flex-1 items-center gap-2 rounded-full border border-rule bg-white px-4 py-3">
              <Search className="h-4 w-4 shrink-0 text-ink-soft" />
              <input
                value={jobQuery}
                onChange={(event) => setJobQuery(event.target.value)}
                placeholder="Filter matches by keyword, e.g. React or AI"
                className="w-full bg-transparent text-sm outline-none"
              />
            </label>
            <button
              disabled={busy}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-ink px-5 py-3 text-sm font-medium text-paper disabled:opacity-50"
            >
              {busy ? (
                <LoaderCircle className="h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4" />
              )}
              {busy ? "Searching…" : "Refresh jobs"}
            </button>
          </form>

          {jobs && (
            <div className="mt-5 flex flex-wrap items-center justify-between gap-2 text-xs ink-soft">
              <p>{jobs.jobs.length} relevant listing(s)</p>
              <p>
                Refreshed {dateLabel(jobs.fetchedAt)} ·{" "}
                <a
                  href="https://jobicy.com/jobs-rss-feed"
                  target="_blank"
                  rel="noreferrer"
                  className="underline"
                >
                  Jobicy
                </a>{" "}
                ·{" "}
                <a
                  href="https://arbeitnow.com"
                  target="_blank"
                  rel="noreferrer"
                  className="underline"
                >
                  Arbeitnow
                </a>
              </p>
            </div>
          )}

          {!jobs && !busy && (
            <p className="mt-5 rounded-2xl border border-rule bg-white p-5 text-sm ink-soft">
              Search live job feeds to find openings that match your engineering profile.
            </p>
          )}
          {jobs && jobs.jobs.length === 0 && (
            <p className="mt-5 rounded-2xl border border-rule bg-white p-5 text-sm ink-soft">
              No matching listings found. Try a broader keyword or refresh later.
            </p>
          )}
          {jobs && jobs.jobs.length > 0 && (
            <div className="mt-5 grid gap-3 lg:grid-cols-2">
              {jobs.jobs.map((job) => (
                <JobCard
                  key={job.id}
                  job={job}
                  tracked={trackedIds.has(job.id)}
                  busy={busy}
                  onSave={() => void saveJob(job)}
                />
              ))}
            </div>
          )}
        </section>
      )}

      {tab === "applications" && (
        <section className="mt-7">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="eyebrow">Job search · Follow-through</p>
              <h2 className="mt-2 serif-display text-3xl">Application tracker</h2>
            </div>
            <button
              disabled={busy}
              onClick={() => void loadApplications()}
              className="inline-flex items-center gap-2 rounded-full border border-rule px-4 py-2 text-sm"
            >
              <RefreshCw className="h-4 w-4" /> Refresh
            </button>
          </div>
          {applications.length === 0 ? (
            <p className="mt-5 rounded-2xl border border-rule bg-white p-5 text-sm ink-soft">
              No saved jobs yet. Find a relevant listing and add it to your tracker.
            </p>
          ) : (
            <div className="mt-5 space-y-3">
              {applications.map((application) => (
                <ApplicationCard
                  key={application.id}
                  application={application}
                  busy={busy}
                  onStatusChange={(status) => void updateApplication(application, { status })}
                  onSaveNotes={(notes) => void updateApplication(application, { notes })}
                />
              ))}
            </div>
          )}
        </section>
      )}

      {tab === "content" && (
        <section className="mt-7">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="eyebrow">Portfolio · Blog</p>
              <h2 className="mt-2 serif-display text-3xl">Published writing</h2>
              <p className="mt-2 text-xs ink-soft">
                Posts are committed to {CMS.owner}/{CMS.repo} and appear after deployment.
              </p>
            </div>
            <div className="flex gap-2">
              <button
                disabled={busy}
                onClick={() => void loadPosts()}
                className="inline-flex items-center gap-2 rounded-full border border-rule px-4 py-2 text-sm"
              >
                <RefreshCw className="h-4 w-4" /> Refresh
              </button>
              <button
                onClick={() =>
                  setEditing({
                    slug: "",
                    title: "",
                    date: new Date().toISOString().slice(0, 10),
                    excerpt: "",
                    body: "# Hello\n\nWrite your post in **Markdown**.\n",
                    isNew: true,
                  })
                }
                className="rounded-full bg-ink px-5 py-2 text-sm font-medium text-paper"
              >
                + New post
              </button>
            </div>
          </div>

          <div className="mt-5 divide-y divide-rule rounded-2xl border border-rule bg-white">
            {busy && posts.length === 0 ? (
              <p className="p-5 text-sm ink-soft">Loading posts…</p>
            ) : posts.length === 0 ? (
              <p className="p-5 text-sm ink-soft">
                No posts found. Create your first post or check the CMS publishing setup.
              </p>
            ) : (
              posts.map((post) => (
                <div
                  key={post.slug}
                  className="flex flex-wrap items-center justify-between gap-3 p-5"
                >
                  <div className="min-w-0">
                    <p className="font-serif text-lg text-ink">{post.title}</p>
                    <p className="text-xs ink-soft">
                      {post.date} · {post.slug}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Link
                      to="/blog/$slug"
                      params={{ slug: post.slug }}
                      className="rounded-full border border-rule px-3 py-1.5 text-xs"
                    >
                      View
                    </Link>
                    <button
                      disabled={busy}
                      onClick={() => void openEditPost(post.slug)}
                      className="rounded-full border border-rule px-3 py-1.5 text-xs"
                    >
                      Edit
                    </button>
                    <button
                      disabled={busy}
                      onClick={() => void deletePost(post)}
                      className="rounded-full border border-rule px-3 py-1.5 text-xs text-red-700"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      )}
      {tab === "site" && <SiteContentEditor accessToken={accessToken} />}
    </AdminShell>
  );
}

function AdminShell({ children, wide = false }: { children: React.ReactNode; wide?: boolean }) {
  return (
    <section
      className={`admin-shell mx-auto w-full px-4 pb-20 pt-8 sm:px-6 sm:pt-12 ${wide ? "max-w-7xl" : "max-w-lg"}`}
    >
      {children}
    </section>
  );
}

function Metric({ label, value }: { label: string; value: string | number }) {
  return (
    <article className="tech-card p-5">
      <p className="eyebrow">{label}</p>
      <p className="mt-3 serif-display text-4xl text-ink">{value}</p>
    </article>
  );
}

function JobCard({
  job,
  tracked,
  busy,
  onSave,
}: {
  job: JobPosting;
  tracked: boolean;
  busy: boolean;
  onSave: () => void;
}) {
  return (
    <article className="tech-card flex h-full flex-col p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="eyebrow">{job.company}</p>
          <h3 className="mt-2 font-sans text-lg font-semibold leading-snug text-ink">
            {job.title}
          </h3>
        </div>
        <span className="rounded-full bg-surface px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider text-ink-soft">
          {job.matchScore}% match
        </span>
      </div>
      <p className="mt-3 text-xs ink-soft">
        {job.location} · {job.employmentType}
      </p>
      {job.description && (
        <p className="mt-3 line-clamp-3 text-sm leading-relaxed ink-soft">{job.description}</p>
      )}
      <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-5">
        <span className="text-xs ink-soft">
          {job.source} · {dateLabel(job.postedAt)}
        </span>
        <div className="flex items-center gap-2">
          <button
            disabled={busy || tracked}
            onClick={onSave}
            className="rounded-full border border-rule px-3 py-2 text-xs font-medium disabled:opacity-50"
          >
            {tracked ? "In tracker" : "Save job"}
          </button>
          <a
            href={job.url}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 rounded-full bg-ink px-3 py-2 text-xs font-medium text-paper"
          >
            View & apply <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>
    </article>
  );
}

function ApplicationCard({
  application,
  busy,
  onStatusChange,
  onSaveNotes,
}: {
  application: JobApplication;
  busy: boolean;
  onStatusChange: (status: ApplicationStatus) => void;
  onSaveNotes: (notes: string) => void;
}) {
  const [notes, setNotes] = useState(application.notes);

  useEffect(() => setNotes(application.notes), [application.notes]);

  return (
    <article className="tech-card p-5">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="eyebrow">
            {application.company} · {application.location}
          </p>
          <h3 className="mt-2 font-sans text-lg font-semibold text-ink">{application.title}</h3>
          <p className="mt-1 text-xs ink-soft">
            {application.source} · Listed {dateLabel(application.posted_at)}
            {application.applied_at ? ` · Applied ${dateLabel(application.applied_at)}` : ""}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <select
            aria-label={`Application status for ${application.title}`}
            value={application.status}
            disabled={busy}
            onChange={(event) => onStatusChange(event.target.value as ApplicationStatus)}
            className="rounded-full border border-rule bg-white px-3 py-2 text-xs"
          >
            {applicationStatuses.map((status) => (
              <option key={status.value} value={status.value}>
                {status.label}
              </option>
            ))}
          </select>
          <a
            href={application.job_url}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 rounded-full border border-rule px-3 py-2 text-xs"
          >
            Open listing <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>
      <div className="mt-4 flex flex-col gap-2 sm:flex-row">
        <input
          aria-label={`Notes for ${application.title}`}
          value={notes}
          onChange={(event) => setNotes(event.target.value)}
          onBlur={() => {
            if (notes !== application.notes) onSaveNotes(notes);
          }}
          placeholder="Add a note, contact, or follow-up reminder"
          className="min-w-0 flex-1 rounded-lg border border-rule bg-surface px-3 py-2 text-sm"
        />
        {notes !== application.notes && (
          <button
            disabled={busy}
            onClick={() => onSaveNotes(notes)}
            className="rounded-full border border-rule px-4 py-2 text-xs"
          >
            Save note
          </button>
        )}
      </div>
    </article>
  );
}

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
