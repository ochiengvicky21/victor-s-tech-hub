import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { type PostMeta, listPostsPublic } from "@/lib/cms";

export const Route = createFileRoute("/blog")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Writing — Victor Otieno Ochieng" },
      {
        name: "description",
        content: "Notes on engineering, AI systems, SaaS and African digital infrastructure.",
      },
      { property: "og:title", content: "Writing — Victor Otieno Ochieng" },
      { property: "og:url", content: "/blog" },
    ],
    links: [{ rel: "canonical", href: "/blog" }],
  }),
  component: BlogIndex,
});

function BlogIndex() {
  const [posts, setPosts] = useState<PostMeta[] | null>(null);
  const [err, setErr] = useState("");
  useEffect(() => {
    listPostsPublic()
      .then(setPosts)
      .catch((e) => setErr(e.message));
  }, []);
  return (
    <section className="mx-auto w-full max-w-7xl px-4 pb-20 pt-8 sm:px-6 sm:pt-12">
      <header className="page-intro p-6 sm:p-10">
        <p className="eyebrow">Writing · Field notes</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight text-ink sm:text-5xl">
          Notes & essays.
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed ink-soft sm:text-base">
          Field notes from building production systems. Updated whenever I commit a new post.
        </p>
      </header>
      <div className="mt-7 grid gap-4 md:grid-cols-2">
        {err && <p className="py-6 text-sm text-red-600">{err}</p>}
        {posts === null && !err && <p className="py-6 text-sm ink-soft">Loading…</p>}
        {posts && posts.length === 0 && (
          <p className="py-6 text-sm ink-soft">No posts yet. Check back soon.</p>
        )}
        {posts?.map((p) => (
          <Link
            key={p.slug}
            to="/blog/$slug"
            params={{ slug: p.slug }}
            className="tech-card block p-5 transition-transform hover:-translate-y-0.5 sm:p-6"
          >
            <p className="eyebrow text-[10px]">{p.date}</p>
            <h2 className="mt-2 text-xl font-semibold tracking-tight text-ink sm:text-2xl">
              {p.title}
            </h2>
            {p.excerpt && <p className="mt-2 text-sm ink-soft">{p.excerpt}</p>}
          </Link>
        ))}
      </div>
    </section>
  );
}
