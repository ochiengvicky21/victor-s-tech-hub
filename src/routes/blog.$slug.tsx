import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { marked } from "marked";
import { type Post, getPostPublic } from "@/lib/cms";

export const Route = createFileRoute("/blog/$slug")({
  ssr: false,
  head: ({ params }) => ({
    meta: [
      { title: `${params.slug} — Victor Otieno Ochieng` },
      { property: "og:url", content: `/blog/${params.slug}` },
      { property: "og:type", content: "article" },
    ],
    links: [{ rel: "canonical", href: `/blog/${params.slug}` }],
  }),
  component: BlogPostPage,
});

function BlogPostPage() {
  const { slug } = Route.useParams();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    getPostPublic(slug)
      .then(setPost)
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return <p className="mx-auto max-w-3xl px-5 pt-20 text-sm ink-soft">Loading…</p>;
  if (!post)
    return (
      <section className="mx-auto max-w-3xl px-5 pb-20 pt-16">
        <p className="eyebrow">404</p>
        <h1 className="mt-2 serif-display text-4xl">Post not found</h1>
        <Link to="/blog" className="mt-4 inline-block text-sm underline">
          ← All posts
        </Link>
      </section>
    );

  const html = marked.parse(post.body) as string;
  return (
    <article className="mx-auto max-w-4xl px-5 pb-20 pt-10">
      <Link to="/blog" className="eyebrow">
        ← Writing
      </Link>
      <header className="page-intro mt-4 p-6 sm:p-10">
        <h1 className="text-3xl font-semibold tracking-tight text-ink sm:text-5xl">{post.title}</h1>
        {post.date && <p className="mt-3 font-mono text-xs text-ink-soft">{post.date}</p>}
      </header>
      <div className="mt-7 rounded-2xl border border-rule bg-white p-6 shadow-sm sm:p-10">
        <div
          className="cms-content space-y-4 text-[1.05rem] leading-relaxed text-ink"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </div>
    </article>
  );
}
