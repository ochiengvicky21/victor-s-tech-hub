import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { type PostMeta, listPostsPublic } from "@/lib/cms";

export const Route = createFileRoute("/blog")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Writing — Victor Otieno Ochieng" },
      { name: "description", content: "Notes on engineering, AI systems, SaaS and African digital infrastructure." },
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
    listPostsPublic().then(setPosts).catch((e) => setErr(e.message));
  }, []);
  return (
    <section className="mx-auto max-w-3xl px-5 pt-14 pb-20">
      <p className="eyebrow">Writing</p>
      <h1 className="serif-display text-5xl">Notes & essays.</h1>
      <p className="mt-3 text-sm ink-soft">
        Field notes from building production systems. Updated whenever I commit a new post.
      </p>
      <div className="mt-10 divide-y divide-rule">
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
            className="block py-6 transition-colors hover:bg-surface"
          >
            <p className="eyebrow text-[10px]">{p.date}</p>
            <h2 className="mt-1 font-serif text-2xl text-ink">{p.title}</h2>
            {p.excerpt && <p className="mt-2 text-sm ink-soft">{p.excerpt}</p>}
          </Link>
        ))}
      </div>
    </section>
  );
}
