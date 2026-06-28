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
      <section className="mx-auto max-w-3xl px-5 pt-20 pb-20">
        <p className="eyebrow">404</p>
        <h1 className="mt-2 serif-display text-4xl">Post not found</h1>
        <Link to="/blog" className="mt-4 inline-block text-sm underline">← All posts</Link>
      </section>
    );

  const html = marked.parse(post.body) as string;
  return (
    <article className="mx-auto max-w-3xl px-5 pt-14 pb-20">
      <Link to="/blog" className="eyebrow">← Writing</Link>
      <h1 className="mt-2 serif-display text-5xl">{post.title}</h1>
      {post.date && <p className="mt-2 text-xs ink-soft">{post.date}</p>}
      <div
        className="cms-content mt-8 space-y-4 text-[1.05rem] leading-relaxed text-ink"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </article>
  );
}
